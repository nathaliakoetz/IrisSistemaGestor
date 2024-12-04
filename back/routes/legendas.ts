import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
  try {
    const legendas = await prisma.legenda.findMany({
      include: {
        clinica: {
          select: {
            dadosUsuario: {
              select: {
                nome: true
              }
            }
          }
        }
      }
    })
    res.status(200).json(legendas)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", async (req, res) => {
  const { descricao, cor, clinicaId, isFixed } = req.body

  if (!descricao || !cor || !clinicaId || isFixed === undefined) {
    res.status(400).json({ "erro": "Informe descricao, cor, clinicaId, isFixed" })
    return
  }

  try {

    const corExiste = await prisma.legenda.findFirst({
      where: { cor, clinicaId }
    })

    if (corExiste) {
      res.status(400).json({ "erro": "Cor já cadastrada para esta Clínica" })
      return
    }

    const descricaoExiste = await prisma.legenda.findFirst({
      where: { descricao: descricao.trim(), clinicaId }
    })

    if (descricaoExiste) {
      res.status(400).json({ "erro": "Descrição já cadastrada para esta Clínica" })
      return
    }

    const legenda = await prisma.legenda.create({
      data: { descricao, cor, clinicaId, isFixed }
    })
    res.status(201).json(legenda)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.patch("/:id", async (req, res) => {
  const { id } = req.params
  const { descricao } = req.body

  if (!descricao) {
    res.status(400).json({ "erro": "Informe descricao" })
    return
  }

  const legenda = await prisma.legenda.findFirst({
    where: { id: Number(id) }
  })

  if (legenda?.descricao === descricao.trim()) {
    res.status(400).json({ "erro": "Descrição já cadastrada" })
    return
  }

  const updateData: any = {}

  if (descricao) updateData.descricao = descricao

  try {
      const legenda = await prisma.legenda.update({
          where: {
              id: Number(id)
          },
          data: updateData
      })

      res.status(200).json(legenda)
  } catch (error) {
      res.status(400).json(error)
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {

    const legenda = await prisma.legenda.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(legenda)

  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/clinica/:id", async (req, res) => {

  const { id } = req.params

  try {
    const legendas = await prisma.legenda.findMany({
      where: { clinicaId: id }
    })
    res.status(200).json(legendas)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router