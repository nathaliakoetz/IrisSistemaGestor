import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const terapeutas = await prisma.terapeuta.findMany({
            include: {
                clinica: {
                    select: {
                        dadosUsuario: {
                            select: {
                                nome: true,
                                email: true,
                                cpfCnpj: true,
                                telefone1: true,
                                telefone2: true
                            }
                        }
                    }
                },
                terapeuta: {
                    select: {
                        nome: true,
                        email: true,
                        cpfCnpj: true,
                        telefone1: true,
                        telefone2: true
                    }
                }
            }
        })
        res.status(200).json(terapeutas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/", async (req, res) => {
    const { clinicaId, terapeutaId } = req.body

    if (!clinicaId || !terapeutaId) {
        res.status(400).json({ "erro": "Informe clinicaId e terapeutaId" })
        return
    }

    try {
        const terapeuta = await prisma.terapeuta.create({
            data: { clinicaId: clinicaId, terapeutaId: terapeutaId }
        })
        res.status(201).json(terapeuta)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/", async (req, res) => {
    const { clinicaId, terapeutaId } = req.body;

    if (!clinicaId || !terapeutaId) {
        res.status(400).json({ "erro": "Informe clinicaId e terapeutaId" });
        return;
    }

    try {
        const terapeuta = await prisma.terapeuta.delete({
            where: {
                clinicaId_terapeutaId: {
                    clinicaId: clinicaId,
                    terapeutaId: terapeutaId,
                },
            }
        })
        res.status(200).json(terapeuta)
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router