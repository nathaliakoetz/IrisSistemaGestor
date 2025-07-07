import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const responsaveis = await prisma.responsavel.findMany({
            include: {
                endereco: true,
                ResponsavelDependente: {
                    include: {
                        dependente: true
                    }
                },
                ResponsavelClinica: {
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
        // Verificar se já existe um responsável com o mesmo email
        const responsavelExistenteEmail = await prisma.responsavel.findFirst({
            where: {
                email: email,
                deletedAt: null
            }
        })

        if (responsavelExistenteEmail) {
            res.status(409).json({ "erro": "Já existe um responsável cadastrado com este e-mail" })
            return
        }

        // Verificar se já existe um responsável com o mesmo CPF
        const responsavelExistenteCpf = await prisma.responsavel.findFirst({
            where: {
                cpf: cpf,
                deletedAt: null
            }
        })

        if (responsavelExistenteCpf) {
            res.status(409).json({ "erro": "Já existe um responsável cadastrado com este CPF" })
            return
        }

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

router.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const responsavel = await prisma.responsavel.findUnique({
            where: { id },
            include: {
                endereco: true,
                ResponsavelDependente: {
                    include: {
                        dependente: true
                    }
                },
                ResponsavelClinica: {
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

        if (!responsavel) {
            res.status(404).json({ erro: "Responsável não encontrado" })
            return
        }

        res.status(200).json(responsavel)
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

router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { nome, email, cpf, telefone1, telefone2, genero, estadoCivil, dataNascimento, endereco } = req.body

    try {
        const responsavelExistente = await prisma.responsavel.findUnique({
            where: { id },
            include: { endereco: true }
        })

        if (!responsavelExistente) {
            res.status(404).json({ erro: "Responsável não encontrado" })
            return
        }

        // Se estiver atualizando o email, verificar se já existe outro responsável com o mesmo email
        if (email) {
            const responsavelExistenteEmail = await prisma.responsavel.findFirst({
                where: {
                    email: email,
                    deletedAt: null,
                    NOT: {
                        id: id
                    }
                }
            })

            if (responsavelExistenteEmail) {
                res.status(409).json({ "erro": "Já existe um responsável cadastrado com este e-mail" })
                return
            }
        }

        // Se estiver atualizando o CPF, verificar se já existe outro responsável com o mesmo CPF
        if (cpf) {
            const responsavelExistenteCpf = await prisma.responsavel.findFirst({
                where: {
                    cpf: cpf,
                    deletedAt: null,
                    NOT: {
                        id: id
                    }
                }
            })

            if (responsavelExistenteCpf) {
                res.status(409).json({ "erro": "Já existe um responsável cadastrado com este CPF" })
                return
            }
        }

        // Preparar dados para atualização
        const updateData: any = {}
        if (nome) updateData.nome = nome
        if (email) updateData.email = email
        if (cpf) updateData.cpf = cpf
        if (telefone1) updateData.telefone1 = telefone1
        if (telefone2 !== undefined) updateData.telefone2 = telefone2
        if (genero) updateData.genero = genero
        if (estadoCivil) updateData.estadoCivil = estadoCivil
        if (dataNascimento) updateData.dataNascimento = dataNascimento

        // Atualizar endereço se fornecido
        if (endereco && responsavelExistente.endereco) {
            const enderecoUpdateData: any = {}
            if (endereco.logradouro) enderecoUpdateData.logradouro = endereco.logradouro
            if (endereco.numero) enderecoUpdateData.numero = endereco.numero
            if (endereco.bairro) enderecoUpdateData.bairro = endereco.bairro
            if (endereco.cidade) enderecoUpdateData.cidade = endereco.cidade
            if (endereco.estado) enderecoUpdateData.estado = endereco.estado
            if (endereco.cep) enderecoUpdateData.cep = endereco.cep

            await prisma.endereco.update({
                where: { id: responsavelExistente.endereco.id },
                data: enderecoUpdateData
            })
        }

        // Atualizar responsável
        const responsavelAtualizado = await prisma.responsavel.update({
            where: { id },
            data: updateData,
            include: {
                endereco: true,
                ResponsavelDependente: {
                    include: {
                        dependente: true
                    }
                },
                ResponsavelClinica: {
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

        res.status(200).json(responsavelAtualizado)
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router