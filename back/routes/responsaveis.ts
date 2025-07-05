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
                ResponsavelClinica: {
                    include: {
                        clinica: true
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
    const { nome, email, cpf, telefone1, telefone2, enderecoId, genero, estadoCivil, dataNascimento } = req.body

    if (!nome || !email || !cpf || !telefone1 || !enderecoId || !genero || !estadoCivil || !dataNascimento) {
        res.status(400).json({ erro: "Informe nome, email, cpf, telefone1, telefone2, enderecoId, genero, estadoCivil, dataNascimento" })
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
                genero,
                estadoCivil,
                dataNascimento,
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