import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const consultas = await prisma.consulta.findMany({
            include: {
                terapeuta: {
                    include: {
                        clinica: {
                            include: {
                                dadosUsuario: true
                            }
                        }
                    }
                },
                paciente: {
                    include: {
                        ResponsavelDependente: {
                            include: {
                                responsavel: {
                                    include: {
                                        endereco: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(consultas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/", async (req, res) => {
    const { clinicaId, terapeutaId, pacienteId, dataInicio, dataFim, detalhes } = req.body

    if (!clinicaId || !terapeutaId || !dataInicio) {
        res.status(400).json({ erro: "Informe clinicaId, terapeutaId, pacienteId" })
        return
    }

    try {

        const consulta = await prisma.consulta.create({
            data: {
                clinicaId,
                terapeutaId,
                pacienteId: pacienteId ? pacienteId : null,
                dataInicio,
                dataFim: dataFim ? dataFim : null,
                detalhes: detalhes ? detalhes : null
            }
        })

        res.status(201).json(consulta)
    } catch (error) {
        res.status(400).json(error)
    }
})
router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {

        const updated = await prisma.consulta.findUnique({
            where: { id: Number(id) },
            select: {
                updatedAt: true
            }
        })

        const consulta = await prisma.consulta.update({
            where: { id: Number(id) },
            data: {
                deletedAt: new Date(),
                updatedAt: updated?.updatedAt
            }
        })

        res.status(200).json(consulta)
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router