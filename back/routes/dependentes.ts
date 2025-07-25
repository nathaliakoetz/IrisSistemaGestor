import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const dependentes = await prisma.dependente.findMany({
            include: {
                ResponsavelDependente: {
                    include: {
                        responsavel: {
                            include: {
                                endereco: true,
                            }
                        }
                    }
                },
                Consulta: {
                    include: {
                        terapeuta: {
                            include: {
                                clinica: {
                                    include: {
                                        dadosUsuario: true
                                    }
                                }
                            }
                        }
                    }
                },
                DependenteClinica: {
                    include: {
                        clinica: {
                            include: {
                                dadosUsuario: true
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(dependentes)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/", async (req, res) => {
    const { nome, cpf, responsavelId, clinicaId, genero, dataNascimento } = req.body

    console.log(nome, cpf, responsavelId, clinicaId, genero, dataNascimento)

    if (!nome || !cpf || !responsavelId || !genero || !dataNascimento) {
        res.status(400).json({ erro: "Informe nome, cpf, responsavelId, genero, dataNascimento" })
        return
    }

    try {
        // Verificar se já existe um dependente/paciente com o mesmo CPF
        const dependenteExistenteCpf = await prisma.dependente.findFirst({
            where: {
                cpf: cpf,
                deletedAt: null
            }
        })

        if (dependenteExistenteCpf) {
            res.status(409).json({ "erro": "Já existe um paciente cadastrado com este CPF" })
            return
        }

        const dependente = await prisma.dependente.create({
            data: {
                nome,
                cpf,
                genero,
                dataNascimento
            }
        })

        await prisma.responsavelDependente.create({
            data: {
                responsavelId,
                dependenteId: dependente.id
            },
            include: {
                dependente: true,
                responsavel: true
                
            }
        })

        await prisma.dependenteClinica.create({
            data: {
                clinicaId,
                dependenteId: dependente.id
            },
            include: {
                dependente: true,
                clinica: true
                
            }
        })

        const dependenteCriado = await prisma.dependente.findUnique({
            where: {
                id: dependente.id
            },
            include: {
                ResponsavelDependente: {
                    include: {
                        dependente: true
                    }
                },
                DependenteClinica: {
                    include: {
                        clinica: {
                            include: {
                                dadosUsuario: true
                            }
                        }
                    }
                }
            }
        })

        res.status(201).json(dependenteCriado)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const dependente = await prisma.dependente.findUnique({
            where: { id },
            include: {
                ResponsavelDependente: {
                    include: {
                        responsavel: {
                            include: {
                                endereco: true,
                            }
                        }
                    }
                },
                Consulta: {
                    include: {
                        terapeuta: {
                            include: {
                                clinica: {
                                    include: {
                                        dadosUsuario: true
                                    }
                                }
                            }
                        }
                    }
                },
                DependenteClinica: {
                    include: {
                        clinica: {
                            include: {
                                dadosUsuario: true
                            }
                        }
                    }
                }
            }
        })

        if (!dependente) {
            res.status(404).json({ erro: "Dependente não encontrado" })
            return
        }

        res.status(200).json(dependente)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {

        const updated = await prisma.dependente.findUnique({
            where: { id },
            select: {
                updatedAt: true
            }
        })

        const dependente = await prisma.dependente.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedAt: updated?.updatedAt
            }
        })

        res.status(200).json(dependente)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { nome, cpf, genero, dataNascimento, responsavelId } = req.body

    if (!nome || !cpf || !genero || !dataNascimento) {
        res.status(400).json({ erro: "Informe nome, cpf, genero, dataNascimento" })
        return
    }

    try {
        // Verificar se o dependente existe
        const dependenteExistente = await prisma.dependente.findUnique({
            where: { id }
        })

        if (!dependenteExistente) {
            res.status(404).json({ erro: "Dependente não encontrado" })
            return
        }

        // Se estiver atualizando o CPF, verificar se já existe outro dependente com o mesmo CPF
        if (cpf && cpf !== dependenteExistente.cpf) {
            const dependenteExistenteCpf = await prisma.dependente.findFirst({
                where: {
                    cpf: cpf,
                    deletedAt: null,
                    NOT: {
                        id: id
                    }
                }
            })

            if (dependenteExistenteCpf) {
                res.status(409).json({ "erro": "Já existe um paciente cadastrado com este CPF" })
                return
            }
        }

        // Atualizar dados do dependente
        const dependente = await prisma.dependente.update({
            where: { id },
            data: {
                nome,
                cpf,
                genero,
                dataNascimento
            }
        })

        // Se responsavelId foi fornecido, atualizar a relação responsável-dependente
        if (responsavelId) {
            // Primeiro, deletar a relação existente
            await prisma.responsavelDependente.deleteMany({
                where: {
                    dependenteId: id
                }
            })

            // Criar nova relação
            await prisma.responsavelDependente.create({
                data: {
                    responsavelId,
                    dependenteId: id
                }
            })
        }

        // Buscar o dependente atualizado com todas as relações
        const dependenteAtualizado = await prisma.dependente.findUnique({
            where: { id },
            include: {
                ResponsavelDependente: {
                    include: {
                        responsavel: {
                            include: {
                                endereco: true,
                            }
                        }
                    }
                },
                Consulta: {
                    include: {
                        terapeuta: {
                            include: {
                                clinica: {
                                    include: {
                                        dadosUsuario: true
                                    }
                                }
                            }
                        }
                    }
                },
                DependenteClinica: {
                    include: {
                        clinica: {
                            include: {
                                dadosUsuario: true
                            }
                        }
                    }
                }
            }
        })

        res.status(200).json(dependenteAtualizado)
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router