import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const dependentesClinicas = await prisma.dependenteClinica.findMany({
            include: {
                clinica: true,
                dependente: true
            }
        })
        res.status(200).json(dependentesClinicas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/", async (req, res) => {
    const { clinicaId, dependenteId } = req.body

    if (!clinicaId || !dependenteId) {
        res.status(400).json({ erro: "Informe clinicaId, dependenteId" })
        return
    }

    try {

        const existente = await prisma.dependenteClinica.findUnique({
            where: {
                clinicaId_dependenteId: {
                    clinicaId,
                    dependenteId
                }
            }
        })

        if (existente) {
            res.status(400).json({ erro: "A combinação de clinicaId e dependenteId já existe" })
            return
        }

        const dependenteClinica = await prisma.dependenteClinica.create({
            data: {
                clinicaId,
                dependenteId
            },
            include: {
                clinica: true,
                dependente: true
            }
        })

        res.status(201).json(dependenteClinica)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const dependentesClinicas = await prisma.dependenteClinica.findMany({
            where: {
                clinicaId: id,
                dependente: {
                    deletedAt: null
                }
            },
            include: {
                dependente: true
            }
        })
        res.status(200).json(dependentesClinicas)
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router