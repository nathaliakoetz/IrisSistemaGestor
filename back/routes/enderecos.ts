import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const enderecos = await prisma.endereco.findMany({
            include: {
                Responsavel: true
            }
        })
        res.status(200).json(enderecos)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/", async (req, res) => {
    const { logradouro, numero, bairro, cidade, estado, cep } = req.body

    if (!logradouro || !numero || !bairro || !cidade || !estado || !cep) {
        res.status(400).json({ erro: "Informe logradouro, numero, bairro, cidade, estado, cep" })
        return
    }

    try {

        const endereco = await prisma.endereco.create({
            data: {
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep
            }
        })

        res.status(201).json(endereco)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {

        const endereco = await prisma.endereco.delete({
            where: { id: Number(id) }
          })
          res.status(200).json(endereco)

        res.status(200).json(endereco)
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router