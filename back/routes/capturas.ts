import { PrismaClient } from "@prisma/client"
import { Router } from "express"

// const prisma = new PrismaClient()
const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
        {
            emit: 'stdout',
            level: 'info',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ],
})

prisma.$on('query', (e) => {
    console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
    console.log('Duration: ' + e.duration + 'ms')
})

const router = Router()

router.get("/", async (req, res) => {
    try {
        const capturas = await prisma.captura.findMany({
            include: {
                treinador: true,
                pokemon: true
            }
        })
        res.status(200).json(capturas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/", async (req, res) => {
    const { treinadorId, pokemonId } = req.body

    if (!treinadorId || !pokemonId) {
        res.status(400).json({ "erro": "Informe treinadorId e pokemonId" })
        return
    }

    try {
        const captura = await prisma.captura.create({
            data: { treinadorId: treinadorId, pokemonId: Number(pokemonId) }
        })
        res.status(201).json(captura)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/", async (req, res) => {
    const { treinadorId, pokemonId } = req.body;

    if (!treinadorId || !pokemonId) {
        res.status(400).json({ "erro": "Informe treinadorId e pokemonId" });
        return;
    }

    try {
        const captura = await prisma.captura.delete({
            where: {
                treinadorId_pokemonId: {
                    treinadorId: treinadorId,
                    pokemonId: Number(pokemonId),
                },
            }
        })
        res.status(200).json(captura)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/:treinadorId/:pokemonId", async (req, res) => {

    const { treinadorId, pokemonId } = req.params;

    try {
        const captura = await prisma.captura.findUnique({
            where: {
                treinadorId_pokemonId: {
                    treinadorId: treinadorId,
                    pokemonId: Number(pokemonId),
                },
            }
        });

        res.status(200).json({ capturado: !!captura });
    } catch (error) {
        res.status(400).json(error);
    }

});

export default router