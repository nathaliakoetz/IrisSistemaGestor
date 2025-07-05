import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

// Buscar todas as relações responsável-dependente
router.get("/", async (req, res) => {
    try {
        const responsaveisDependentes = await prisma.responsavelDependente.findMany({
            include: {
                responsavel: {
                    include: {
                        endereco: true
                    }
                },
                dependente: true
            }
        })
        res.status(200).json(responsaveisDependentes)
    } catch (error) {
        res.status(400).json(error)
    }
})

// Buscar responsáveis de um dependente específico
router.get("/dependente/:dependenteId", async (req, res) => {
    const { dependenteId } = req.params

    try {
        const responsaveisDependentes = await prisma.responsavelDependente.findMany({
            where: {
                dependenteId: dependenteId
            },
            include: {
                responsavel: {
                    include: {
                        endereco: true
                    }
                },
                dependente: true
            }
        })
        res.status(200).json(responsaveisDependentes)
    } catch (error) {
        res.status(400).json(error)
    }
})

// Buscar dependentes de um responsável específico
router.get("/responsavel/:responsavelId", async (req, res) => {
    const { responsavelId } = req.params

    try {
        const responsaveisDependentes = await prisma.responsavelDependente.findMany({
            where: {
                responsavelId: responsavelId
            },
            include: {
                responsavel: {
                    include: {
                        endereco: true
                    }
                },
                dependente: true
            }
        })
        res.status(200).json(responsaveisDependentes)
    } catch (error) {
        res.status(400).json(error)
    }
})

// Criar nova relação responsável-dependente
router.post("/", async (req, res) => {
    const { responsavelId, dependenteId } = req.body

    if (!responsavelId || !dependenteId) {
        res.status(400).json({ erro: "Informe responsavelId e dependenteId" })
        return
    }

    try {
        // Verificar se a relação já existe
        const existente = await prisma.responsavelDependente.findUnique({
            where: {
                responsavelId_dependenteId: {
                    responsavelId,
                    dependenteId
                }
            }
        })

        if (existente) {
            res.status(400).json({ erro: "A relação entre este responsável e dependente já existe" })
            return
        }

        // Verificar se o responsável existe
        const responsavel = await prisma.responsavel.findUnique({
            where: { id: responsavelId }
        })

        if (!responsavel) {
            res.status(404).json({ erro: "Responsável não encontrado" })
            return
        }

        // Verificar se o dependente existe
        const dependente = await prisma.dependente.findUnique({
            where: { id: dependenteId }
        })

        if (!dependente) {
            res.status(404).json({ erro: "Dependente não encontrado" })
            return
        }

        const responsavelDependente = await prisma.responsavelDependente.create({
            data: {
                responsavelId,
                dependenteId
            },
            include: {
                responsavel: {
                    include: {
                        endereco: true
                    }
                },
                dependente: true
            }
        })

        res.status(201).json(responsavelDependente)
    } catch (error) {
        res.status(400).json(error)
    }
})

// Remover relação responsável-dependente por ID da relação
router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {
        // Buscar a relação primeiro para validações
        const relacao = await prisma.responsavelDependente.findFirst({
            where: {
                OR: [
                    { responsavelId: id },
                    { dependenteId: id }
                ]
            },
            include: {
                responsavel: true,
                dependente: true
            }
        })

        if (!relacao) {
            res.status(404).json({ erro: "Relação não encontrada" })
            return
        }

        // Verificar se existem outros responsáveis para este dependente
        const outrosResponsaveis = await prisma.responsavelDependente.findMany({
            where: {
                dependenteId: relacao.dependenteId,
                responsavelId: {
                    not: relacao.responsavelId
                }
            }
        })

        if (outrosResponsaveis.length === 0) {
            res.status(400).json({ 
                erro: "Não é possível remover o último responsável do dependente" 
            })
            return
        }

        await prisma.responsavelDependente.delete({
            where: {
                responsavelId_dependenteId: {
                    responsavelId: relacao.responsavelId,
                    dependenteId: relacao.dependenteId
                }
            }
        })

        res.status(200).json({ message: "Relação removida com sucesso" })
    } catch (error) {
        res.status(400).json(error)
    }
})

// Remover relação responsável-dependente por IDs específicos
router.delete("/:responsavelId/:dependenteId", async (req, res) => {
    const { responsavelId, dependenteId } = req.params

    try {
        // Verificar se existem outros responsáveis para este dependente
        const outrosResponsaveis = await prisma.responsavelDependente.findMany({
            where: {
                dependenteId: dependenteId,
                responsavelId: {
                    not: responsavelId
                }
            }
        })

        if (outrosResponsaveis.length === 0) {
            res.status(400).json({ 
                erro: "Não é possível remover o último responsável do dependente" 
            })
            return
        }

        await prisma.responsavelDependente.delete({
            where: {
                responsavelId_dependenteId: {
                    responsavelId,
                    dependenteId
                }
            }
        })

        res.status(200).json({ message: "Relação removida com sucesso" })
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router
