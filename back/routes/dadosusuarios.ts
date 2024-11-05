import { PrismaClient } from "@prisma/client"
import { Router } from "express"

// const prisma = new PrismaClient()
const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
  try {
    const dados = await prisma.dadosUsuario.findMany()
    res.status(200).json(dados)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router