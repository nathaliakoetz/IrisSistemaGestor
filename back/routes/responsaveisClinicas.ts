import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const responsaveisClinicas = await prisma.responsavelClinica.findMany({
            include: {
                clinica: true,
                responsavel: {
                    include: {
                        endereco: true,
                        ResponsavelDependente: {
                            include: {
                                dependente: true
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(responsaveisClinicas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/", async (req, res) => {
    const { clinicaId, responsavelId } = req.body

    if (!clinicaId || !responsavelId) {
        res.status(400).json({ erro: "Informe clinicaId, responsavelId" })
        return
    }

    try {

        const existente = await prisma.responsavelClinica.findUnique({
            where: {
                clinicaId_responsavelId: {
                    clinicaId,
                    responsavelId
                }
            }
        })

        if (existente) {
            res.status(400).json({ erro: "A combinação de clinicaId e responsavelId já existe" })
            return
        }

        const responsavelClinica = await prisma.responsavelClinica.create({
            data: {
                clinicaId,
                responsavelId
            },
            include: {
                clinica: true,
                responsavel: {
                    include: {
                        endereco: true,
                        ResponsavelDependente: {
                            include: {
                                dependente: true
                            }
                        }
                    }
                }
            }
        })

        res.status(201).json(responsavelClinica)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const responsaveisClinicas = await prisma.responsavelClinica.findMany({
            where: {
                clinicaId: id
            },
            include: {
                responsavel: {
                    include: {
                        endereco: true,
                        ResponsavelDependente: {
                            include: {
                                dependente: true
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(responsaveisClinicas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/:clinicaId/:responsavelId", async (req, res) => {
    const { clinicaId, responsavelId } = req.params

    try {

        const updated = await prisma.responsavelClinica.findUnique({
            where: {
                clinicaId_responsavelId: {
                    clinicaId,
                    responsavelId
                }
            },
            select: {
                updatedAt: true
            }
        })

        const responsavelClinica = await prisma.responsavelClinica.update({
            where: {
                clinicaId_responsavelId: {
                    clinicaId,
                    responsavelId
                }
            },
            data: {
                deletedAt: new Date(),
                updatedAt: updated?.updatedAt
            }
        })

        res.status(200).json(responsavelClinica)
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router
