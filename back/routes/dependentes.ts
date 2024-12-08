import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const dependentes = await prisma.dependente.findMany({
            include: {
                ResponsavelDependente: {
                    include: {
                        dependente: true
                    }
                },
                Consulta: {
                    include: {
                        terapeuta: {
                            include: {
                                clinica: {
                                    include: {
                                        dadosUsuario: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(dependentes)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/", async (req, res) => {
    const { nome, cpf, responsavelId } = req.body

    if (!nome || !cpf || !responsavelId) {
        res.status(400).json({ erro: "Informe nome, cpf, responsavelId" })
        return
    }

    try {

        const dependente = await prisma.dependente.create({
            data: {
                nome,
                cpf,
            }
        })

        const responsavelDependente = await prisma.responsavelDependente.create({
            data: {
                responsavelId,
                dependenteId: dependente.id
            },
            include: {
                dependente: true,
                responsavel: true
                
            }
        })

        res.status(201).json(responsavelDependente)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {

        const updated = await prisma.dependente.findUnique({
            where: { id },
            select: {
                updatedAt: true
            }
        })

        const dependente = await prisma.dependente.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedAt: updated?.updatedAt
            }
        })

        res.status(200).json(dependente)
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router