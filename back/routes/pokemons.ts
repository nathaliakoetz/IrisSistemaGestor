import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
  try {
    const pokemons = await prisma.pokemon.findMany({
      include: {
        grupo: true,
        evolucao: true,
        evoluiDe: true
      },
      orderBy: {
        numero: 'asc'
      }
    })
    res.status(200).json(pokemons)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", async (req, res) => {
  const { nome, numero, peso, altura, habPassiva, descricao, tipos, fraquezas, foto, grupoId, evolucaoId, evoluiDeId } = req.body

  if (!nome || !numero || !peso || !altura || !habPassiva || !descricao || !tipos || !fraquezas || !foto || !grupoId) {
    res.status(400).json({ "erro": "Informe nome, numero, peso, altura, habPassiva, descricao, tipos, fraquezas, foto, grupoId" })
    return
  }

  try {

    const pokemon = await prisma.pokemon.create({
      data: {
        nome,
        numero,
        peso,
        altura,
        habPassiva,
        descricao,
        tipos,
        fraquezas,
        foto,
        grupoId,
        evolucaoId: evolucaoId ? Number(evolucaoId) : null,
        evoluiDeId: evoluiDeId ? Number(evoluiDeId) : null
      }
    })

    if (evoluiDeId) {
      const pokemonEvoluiDe = await prisma.pokemon.findUnique({
        where: { id: Number(evoluiDeId) }
      })

      if (pokemonEvoluiDe && !pokemonEvoluiDe.evolucaoId) {
        await prisma.pokemon.update({
          where: { id: Number(evoluiDeId) },
          data: { evolucaoId: pokemon.id }
        })
      }
    }

    if (evolucaoId) {
      const pokemonEvolucao = await prisma.pokemon.findUnique({
        where: { id: Number(evolucaoId) }
      })

      if (pokemonEvolucao && !pokemonEvolucao.evoluiDeId) {
        await prisma.pokemon.update({
          where: { id: Number(evolucaoId) },
          data: { evoluiDeId: pokemon.id }
        })
      }
    }

    res.status(201).json(pokemon)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {

    await prisma.captura.deleteMany({
      where: {
        pokemonId: Number(id),
      }
    })

    const pokemon = await prisma.pokemon.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(pokemon)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { nome, numero, peso, altura, habPassiva, descricao, tipos, fraquezas, foto, grupoId, evolucaoId, evoluiDeId } = req.body

  if (!nome || !numero || !peso || !altura || !habPassiva || !descricao || !tipos || !fraquezas || !foto || !grupoId) {
    res.status(400).json({ "erro": "Informe nome, numero, peso, altura, habPassiva, descricao, tipos, fraquezas, foto, grupoId" })
    return
  }

  try {

    const pokemon = await prisma.pokemon.findUnique({
      where: { id: Number(id) }
    })

    if (pokemon) {
      if (evoluiDeId && evoluiDeId !== pokemon.evoluiDeId) {
        if (pokemon.evoluiDeId !== null) {
          const pokemonAnterior = await prisma.pokemon.findUnique({
            where: { id: pokemon.evoluiDeId }
          })

          if (pokemonAnterior) {
            await prisma.pokemon.update({
              where: { id: pokemonAnterior.id },
              data: { evolucaoId: null }
            })
          }
        }

        const pokemonEvoluiDe = await prisma.pokemon.findUnique({
          where: { id: Number(evoluiDeId) }
        })

        if (pokemonEvoluiDe) {
          await prisma.pokemon.update({
            where: { id: Number(evoluiDeId) },
            data: { evolucaoId: pokemon.id }
          })
        }
      }

      if (evolucaoId && evolucaoId !== pokemon.evolucaoId) {
        const pokemonProximo = await prisma.pokemon.findFirst({
          where: { evoluiDeId: pokemon.id }
        })

        if (pokemonProximo) {
          await prisma.pokemon.update({
            where: { id: pokemonProximo.id },
            data: { evoluiDeId: null }
          })

          await prisma.pokemon.update({
            where: { id: pokemon.id },
            data: { evoluiDeId: pokemonProximo.id }
          })
        }

        const pokemonEvolucao = await prisma.pokemon.findUnique({
          where: { id: Number(evolucaoId) }
        })

        if (pokemonEvolucao) {
          await prisma.pokemon.update({
            where: { id: pokemon.id },
            data: { evolucaoId: Number(evolucaoId) }
          })

          await prisma.pokemon.update({
            where: { id: Number(evolucaoId) },
            data: { evoluiDeId: pokemon.id }
          })
        }
      }
    }

    const pokemonAtualizado = await prisma.pokemon.update({
      where: { id: Number(id) },
      data: {
        nome,
        numero,
        peso,
        altura,
        habPassiva,
        descricao,
        tipos,
        fraquezas,
        foto,
        grupoId,
        evolucaoId: evolucaoId ? Number(evolucaoId) : null,
        evoluiDeId: evoluiDeId ? Number(evoluiDeId) : null
      }
    })

    res.status(200).json(pokemonAtualizado)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/pesquisa/:termo", async (req, res) => {

  const termo = req.params.termo

  const termoNumero = Number(termo)

  if (isNaN(termoNumero)) {
    try {
      const pokemons = await prisma.pokemon.findMany({
        include: {
          grupo: true,
          evolucao: true,
          evoluiDe: true
        },
        where: {
          OR: [
            { nome: { contains: termo } },
            // tipos teve que ficar assim devido a limitação do mysql que nao permite definir um array de strings como tipo de um campo na model
            // então ele só busca se digitar corretamente como está dentro do Json.
            { tipos: { array_contains: termo } },
            { habPassiva: { contains: termo } }
          ]
        },
        orderBy: {
          numero: 'asc'
        }

      })
      res.status(200).json(pokemons)
    } catch (error) {
      res.status(400).json(error)
    }
  } else {
    try {
      const pokemons = await prisma.pokemon.findMany({
        include: {
          grupo: true,
          evolucao: true,
          evoluiDe: true
        },
        where: {
          numero: termoNumero
        }
      })
      res.status(200).json(pokemons)
    } catch (error) {
      res.status(400).json(error)
    }
  }


})

router.get("/pesquisaGrupo/:termo", async (req, res) => {

  const termo = req.params.termo

  try {
    const pokemons = await prisma.pokemon.findMany({
      include: {
        grupo: true,
        evolucao: true,
        evoluiDe: true
      },
      where: {
        grupoId: Number(termo)
      },
      orderBy: {
        numero: 'asc'
      }
    })
    res.status(200).json(pokemons)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/pesquisaIniciais/:termo", async (req, res) => {

  const termo = req.params.termo

  const termoNumero = Number(termo)

  if (isNaN(termoNumero)) {
    try {
      const pokemons = await prisma.pokemon.findMany({
        include: {
          grupo: true,
          evolucao: true,
          evoluiDe: true
        },
        where: {
          AND: [
            {
              OR: [
                { nome: { contains: termo } },
                { tipos: { array_contains: termo } },
                { habPassiva: { contains: termo } }
              ]
            },
            { grupoId: 2 }
          ]
        },
        orderBy: {
          numero: 'asc'
        }

      })
      res.status(200).json(pokemons)
    } catch (error) {
      res.status(400).json(error)
    }
  } else {
    try {
      const pokemons = await prisma.pokemon.findMany({
        include: {
          grupo: true,
          evolucao: true,
          evoluiDe: true
        },
        where: {
          AND: [
            { numero: termoNumero },
            { grupoId: 2 }
          ]
        },
        orderBy: {
          numero: 'asc'
        }

      })
      res.status(200).json(pokemons)
    } catch (error) {
      res.status(400).json(error)
    }
  }
})

router.get("/pesquisaMiticos/:termo", async (req, res) => {

  const termo = req.params.termo

  const termoNumero = Number(termo)

  if (isNaN(termoNumero)) {
    try {
      const pokemons = await prisma.pokemon.findMany({
        include: {
          grupo: true,
          evolucao: true,
          evoluiDe: true
        },
        where: {
          AND: [
            {
              OR: [
                { nome: { contains: termo } },
                { tipos: { array_contains: termo } },
                { habPassiva: { contains: termo } }
              ]
            },
            { grupoId: 3 }
          ]
        },
        orderBy: {
          numero: 'asc'
        }

      })
      res.status(200).json(pokemons)
    } catch (error) {
      res.status(400).json(error)
    }
  } else {
    try {
      const pokemons = await prisma.pokemon.findMany({
        include: {
          grupo: true,
          evolucao: true,
          evoluiDe: true
        },
        where: {
          AND: [
            { numero: termoNumero },
            { grupoId: 3 }
          ]
        },
        orderBy: {
          numero: 'asc'
        }

      })
      res.status(200).json(pokemons)
    } catch (error) {
      res.status(400).json(error)
    }
  }
})

router.get("/pesquisaLendarios/:termo", async (req, res) => {

  const termo = req.params.termo

  const termoNumero = Number(termo)

  if (isNaN(termoNumero)) {
    try {
      const pokemons = await prisma.pokemon.findMany({
        include: {
          grupo: true,
          evolucao: true,
          evoluiDe: true
        },
        where: {
          AND: [
            {
              OR: [
                { nome: { contains: termo } },
                { tipos: { array_contains: termo } },
                { habPassiva: { contains: termo } }
              ]
            },
            { grupoId: 4 }
          ]
        },
        orderBy: {
          numero: 'asc'
        }

      })
      res.status(200).json(pokemons)
    } catch (error) {
      res.status(400).json(error)
    }
  } else {
    try {
      const pokemons = await prisma.pokemon.findMany({
        include: {
          grupo: true,
          evolucao: true,
          evoluiDe: true
        },
        where: {
          AND: [
            { numero: termoNumero },
            { grupoId: 4 }
          ]
        },
        orderBy: {
          numero: 'asc'
        }

      })
      res.status(200).json(pokemons)
    } catch (error) {
      res.status(400).json(error)
    }
  }
})

router.get("/:id", async (req, res) => {

  const { id } = req.params

  try {
    const pokemon = await prisma.pokemon.findUnique({
      include: {
        grupo: true,
        evolucao: {
          include: {
            evolucao: true
          }
        },
        evoluiDe: {
          include: {
            evoluiDe: true
          }
        }
      },
      where: {
        id: Number(id)
      }
    })
    res.status(200).json(pokemon)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router