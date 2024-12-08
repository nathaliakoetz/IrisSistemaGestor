import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const responsaveis = await prisma.responsavel.findMany({
            include: {
                ResponsavelDependente: {
                    include: {
                        dependente: true
                    }
                },
                endereco: true
            }
        })
        res.status(200).json(responsaveis)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/", async (req, res) => {
    const { nome, email, cpf, telefone1, telefone2, enderecoId } = req.body

    if (!nome || !email || !cpf || !telefone1 || !enderecoId) {
        res.status(400).json({ erro: "Informe nome, email, cpf, telefone1, telefone2, enderecoId" })
        return
    }

    try {

        const responsavel = await prisma.responsavel.create({
            data: {
                nome,
                email,
                cpf,
                telefone1,
                telefone2: telefone2 ? telefone2 : null,
                enderecoId
            }
        })

        res.status(201).json(responsavel)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {

        const updated = await prisma.responsavel.findUnique({
            where: { id },
            select: {
                updatedAt: true
            }
        })

        const responsavel = await prisma.responsavel.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedAt: updated?.updatedAt
            }
        })

        res.status(200).json(responsavel)
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router