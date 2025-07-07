import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
  try {
    const legendas = await prisma.legenda.findMany({
      include: {
        clinica: {
          include: {
            dadosUsuario: true
          }
        },
        LegendaTerapeuta: {
          include: {
            terapeuta: {
              select: {
                id: true,
                nome: true,
                profissao: true
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
  const { cor, clinicaId, isFixed } = req.body

  if (!cor || !clinicaId || isFixed === undefined) {
    res.status(400).json({ "erro": "Informe cor, clinicaId, isFixed" })
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

    const legenda = await prisma.legenda.create({
      data: { cor, clinicaId, isFixed }
    })
    res.status(201).json(legenda)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.patch("/:id", async (req, res) => {
  const { id } = req.params
  const { cor } = req.body

  if (!cor) {
    res.status(400).json({ "erro": "Informe cor" })
    return
  }

  try {
    const legenda = await prisma.legenda.findFirst({
      where: { id: Number(id) }
    })

    if (!legenda) {
      res.status(404).json({ "erro": "Legenda não encontrada" })
      return
    }

    if (legenda.cor === cor.trim()) {
      res.status(400).json({ "erro": "Cor já é a mesma" })
      return
    }

    // Verificar se a cor já existe na clínica
    const corExiste = await prisma.legenda.findFirst({
      where: { 
        cor: cor.trim(), 
        clinicaId: legenda.clinicaId,
        NOT: { id: Number(id) }
      }
    })

    if (corExiste) {
      res.status(400).json({ "erro": "Cor já cadastrada para esta Clínica" })
      return
    }

    const legendaAtualizada = await prisma.legenda.update({
      where: {
        id: Number(id)
      },
      data: {
        cor: cor.trim()
      }
    })

    res.status(200).json(legendaAtualizada)
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
      where: { clinicaId: id },
      include: {
        LegendaTerapeuta: {
          include: {
            terapeuta: {
              select: {
                id: true,
                nome: true,
                profissao: true
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

router.get("/terapeuta/:terapeutaId/:clinicaId", async (req, res) => {
  const { terapeutaId, clinicaId } = req.params

  try {
    const legendaTerapeuta = await prisma.legendaTerapeuta.findFirst({
      where: { 
        terapeutaId: terapeutaId,
        clinicaId: clinicaId
      },
      include: {
        legenda: true,
        terapeuta: {
          select: {
            id: true,
            nome: true,
            profissao: true
          }
        }
      }
    })

    if (!legendaTerapeuta) {
      res.status(404).json({ "erro": "Legenda não encontrada para este terapeuta" })
      return
    }

    res.status(200).json(legendaTerapeuta)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router