import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const consultas = await prisma.consulta.findMany({
            where: {
                paciente: {
                    deletedAt: null
                }
            },
            include: {
                terapeuta: {
                    include: {
                        clinica: {
                            include: {
                                dadosUsuario: true
                            }
                        }
                    }
                },
                paciente: {
                    include: {
                        ResponsavelDependente: {
                            include: {
                                responsavel: {
                                    include: {
                                        endereco: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(consultas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/", async (req, res) => {
    const { clinicaId, terapeutaId, pacienteId, dataInicio, dataFim, detalhes } = req.body

    console.log('####################')
    console.log('teste')
    console.log(clinicaId, terapeutaId, pacienteId, dataInicio, dataFim, detalhes)
    console.log('####################')

    if (!clinicaId || !terapeutaId || !dataInicio) {
        res.status(400).json({ erro: "Informe clinicaId, terapeutaId, pacienteId" })
        return
    }

    console.log(clinicaId, terapeutaId, pacienteId, dataInicio, dataFim, detalhes)

    try {

        const consulta = await prisma.consulta.create({
            data: {
                clinicaId,
                terapeutaId,
                pacienteId: pacienteId ? pacienteId : null,
                dataInicio: dataInicio,
                dataFim: dataFim ? dataFim : null,
                detalhes: detalhes ? detalhes : null
            }
        })

        // Remove o horário da lista de horários disponíveis quando uma consulta é criada
        const data = dataInicio.split(' ')[0]
        const horario = dataInicio.split(' ')[1]

        const horarioExistente = await prisma.horario.findUnique({
            where: {
                clinicaId_data: {
                    clinicaId,
                    data: new Date(data)
                }
            }
        })

        if (horarioExistente && horarioExistente.horarios.includes(horario)) {
            const horariosAtualizados = horarioExistente.horarios.filter(h => h !== horario)
            await prisma.horario.update({
                where: {
                    clinicaId_data: {
                        clinicaId,
                        data: new Date(data)
                    }
                },
                data: {
                    horarios: horariosAtualizados
                }
            })
        }

        res.status(201).json(consulta)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {

        const updated = await prisma.consulta.findUnique({
            where: { id: Number(id) },
            select: {
                updatedAt: true
            }
        })

        const consulta = await prisma.consulta.update({
            where: { id: Number(id) },
            data: {
                deletedAt: new Date(),
                updatedAt: updated?.updatedAt
            }
        })

        res.status(200).json(consulta)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.patch("/finalizar/:id", async (req, res) => {
    const { id } = req.params
    const dados = req.body

    try {
        const consulta = await prisma.consulta.update({
            where: { id: Number(id) },
            data: dados
        })

        res.status(200).json(consulta)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const consultas = await prisma.consulta.findMany({
            where: {
                clinicaId: id,
                paciente: {
                    deletedAt: null
                }
            },
            include: {
                terapeuta: {
                    include: {
                        clinica: {
                            include: {
                                dadosUsuario: true
                            }
                        }
                    }
                },
                paciente: {
                    include: {
                        ResponsavelDependente: {
                            include: {
                                responsavel: {
                                    include: {
                                        endereco: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(consultas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/terapeuta/:terapeutaId/:clinicaId", async (req, res) => {
    const { terapeutaId, clinicaId } = req.params

    try {
        const consultas = await prisma.consulta.findMany({
            where: {
                terapeutaId: terapeutaId,
                clinicaId: clinicaId,
                paciente: {
                    deletedAt: null
                }
            },
            include: {
                terapeuta: true,
                paciente: {
                    include: {
                        ResponsavelDependente: {
                            include: {
                                responsavel: {
                                    include: {
                                        endereco: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                dataInicio: 'asc'
            }
        })
        res.status(200).json(consultas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/paciente/:pacienteId", async (req, res) => {
    const { pacienteId } = req.params

    try {
        const consultas = await prisma.consulta.findMany({
            where: {
                pacienteId: pacienteId,
                paciente: {
                    deletedAt: null
                }
            },
            include: {
                terapeuta: true,
                paciente: true
            },
            orderBy: {
                dataInicio: 'desc'
            }
        })
        res.status(200).json(consultas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/detalhes/:id", async (req, res) => {
    const { id } = req.params

    try {
        const consulta = await prisma.consulta.findUnique({
            where: { id: Number(id) },
            include: {
                terapeuta: true,
                paciente: {
                    include: {
                        ResponsavelDependente: {
                            include: {
                                responsavel: {
                                    include: {
                                        endereco: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!consulta) {
            res.status(404).json({ erro: "Consulta não encontrada" })
            return
        }

        res.status(200).json(consulta)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.put("/detalhes/:id", async (req, res) => {
    const { id } = req.params
    const { detalhes } = req.body

    try {
        const consulta = await prisma.consulta.findUnique({
            where: { id: Number(id) }
        })

        if (!consulta) {
            res.status(404).json({ erro: "Consulta não encontrada" })
            return
        }

        const consultaAtualizada = await prisma.consulta.update({
            where: { id: Number(id) },
            data: { detalhes },
            include: {
                terapeuta: true,
                paciente: true
            }
        })

        res.status(200).json(consultaAtualizada)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/desmarcar/:id", async (req, res) => {
    const { id } = req.params

    try {

        const consulta = await prisma.consulta.findUnique({
            where: { id: Number(id) }
        })

        if (!consulta) {
            res.status(404).json({ erro: "Consulta não encontrada" })
            return
        }

        await prisma.consulta.delete({
            where: { id: Number(id) }
        })

        const data = consulta.dataInicio.split(' ')[0]
        const horario = consulta.dataInicio.split(' ')[1]

        const horarioExistente = await prisma.horario.findUnique({
            where: {
                clinicaId_data: {
                    clinicaId: consulta.clinicaId,
                    data: new Date(data)
                }
            }
        })

        if (horarioExistente) {
            // Verifica se o horário já existe na lista antes de adicionar
            await prisma.horario.create({
                data: {
                    clinicaId: consulta.clinicaId,
                    data: new Date(data),
                    horarios: [horario]
                }
            })
        }

        res.status(200).json({ mensagem: "Consulta desmarcada com sucesso" })
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router