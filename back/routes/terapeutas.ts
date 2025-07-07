import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'
import nodemailer from "nodemailer"

const prisma = new PrismaClient()
const router = Router()

// Cores predefinidas para as legendas
const CORES_DISPONIVEIS = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", 
    "#DDA0DD", "#FFB347", "#87CEEB", "#F0E68C", "#FFA07A",
    "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", "#F8C471",
    "#82E0AA", "#F1948A", "#AED6F1", "#A9DFBF", "#F9E79F",
    "#D7BDE2", "#85AFFF", "#FFD93D", "#6BCF7F", "#FF85B3",
    "#8ED1FC", "#FFA726", "#81C784", "#64B5F6", "#FFB74D"
]

async function obterCorUnica(clinicaId: string): Promise<string> {
    // Buscar todas as cores já utilizadas na clínica
    const legendasExistentes = await prisma.legenda.findMany({
        where: { clinicaId },
        select: { cor: true }
    })
    
    const coresUtilizadas = legendasExistentes.map(legenda => legenda.cor)
    
    // Encontrar a primeira cor disponível
    const corDisponivel = CORES_DISPONIVEIS.find(cor => !coresUtilizadas.includes(cor))
    
    // Se todas as cores predefinidas estão em uso, gerar uma cor aleatória
    if (!corDisponivel) {
        let novaCor: string
        do {
            novaCor = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase()
        } while (coresUtilizadas.includes(novaCor))
        return novaCor
    }
    
    return corDisponivel
}

router.get("/", async (req, res) => {
    try {
        const terapeutas = await prisma.terapeuta.findMany({
            include: {
                clinica: {
                    include: {
                        dadosUsuario: true
                    }
                }
            }
        })
        res.status(200).json(terapeutas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/clinica/:clinicaId", async (req, res) => {
    const { clinicaId } = req.params
    
    try {
        const terapeutas = await prisma.terapeuta.findMany({
            where: {
                clinicaId: clinicaId
            },
            select: {
                id: true,
                nome: true,
                profissao: true,
                email: true,
                telefone1: true
            }
        })
        res.status(200).json(terapeutas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/:id/:clinicaId", async (req, res) => {
    const { id, clinicaId } = req.params
    
    try {
        const terapeuta = await prisma.terapeuta.findUnique({
            where: {
                id_clinicaId: {
                    id: id,
                    clinicaId: clinicaId,
                }
            },
            select: {
                id: true,
                nome: true,
                email: true,
                cpfCnpj: true,
                telefone1: true,
                telefone2: true,
                profissao: true,
                clinicaId: true
            }
        })
        
        if (!terapeuta) {
            res.status(404).json({ erro: "Terapeuta não encontrado" })
            return
        }
        
        res.status(200).json(terapeuta)
    } catch (error) {
        res.status(400).json(error)
    }
})

function validaSenha(senha: string) {

    const mensa: string[] = []

    // .length: retorna o tamanho da string (da senha)
    if (senha.length < 8) {
        mensa.push("Erro... senha deve possuir, no mínimo, 8 caracteres")
    }

    // contadores
    let pequenas = 0
    let grandes = 0
    let numeros = 0
    let simbolos = 0

    // senha = "abc123"
    // letra = "a"

    // percorre as letras da variável senha
    for (const letra of senha) {
        // expressão regular
        if ((/[a-z]/).test(letra)) {
            pequenas++
        }
        else if ((/[A-Z]/).test(letra)) {
            grandes++
        }
        else if ((/[0-9]/).test(letra)) {
            numeros++
        } else {
            simbolos++
        }
    }

    if (pequenas == 0 || grandes == 0 || numeros == 0 || simbolos == 0) {
        mensa.push("Erro... senha deve possuir letras minúsculas, maiúsculas, números e símbolos")
    }

    return mensa
}

router.post("/", async (req, res) => {
    const { nome, email, senha, cpfCnpj, telefone1, telefone2, profissao, clinicaId } = req.body

    if (!nome || !email || !senha || !cpfCnpj || !telefone1 || !profissao || !clinicaId) {
        res.status(400).json({ "erro": "Informe nome, email, senha, cnpfCnpj, telefone1, profissao e clinicaId" })
        return
    }

    const erros = validaSenha(senha)
    if (erros.length > 0) {
        res.status(400).json({ erro: erros.join("; ") })
        return
    }

    try {
        // Verificar se já existe um terapeuta com o mesmo email na clínica
        const terapeutaExistenteEmail = await prisma.terapeuta.findFirst({
            where: {
                email: email,
                clinicaId: clinicaId
            }
        })

        if (terapeutaExistenteEmail) {
            res.status(409).json({ "erro": "Já existe um funcionário cadastrado com este e-mail nesta clínica" })
            return
        }

        // Verificar se já existe um terapeuta com o mesmo CPF/CNPJ na clínica
        const terapeutaExistenteCpf = await prisma.terapeuta.findFirst({
            where: {
                cpfCnpj: cpfCnpj,
                clinicaId: clinicaId
            }
        })

        if (terapeutaExistenteCpf) {
            res.status(409).json({ "erro": "Já existe um funcionário cadastrado com este CPF/CNPJ nesta clínica" })
            return
        }

        const salt = bcrypt.genSaltSync(12)
        const hash = bcrypt.hashSync(senha, salt)

        // Usar uma transação para criar o terapeuta e a legenda atomicamente
        const resultado = await prisma.$transaction(async (tx) => {
            // Criar o terapeuta
            const terapeuta = await tx.terapeuta.create({
                data: {
                    nome,
                    email,
                    senha: hash,
                    cpfCnpj,
                    telefone1,
                    telefone2: telefone2 ? telefone2 : null,
                    profissao,
                    clinicaId
                }
            })

            // Obter uma cor única para a legenda
            const corUnica = await obterCorUnica(clinicaId)

            // Criar a legenda para o terapeuta
            const legenda = await tx.legenda.create({
                data: {
                    cor: corUnica,
                    isFixed: false,
                    clinicaId
                }
            })

            // Criar a relação entre legenda e terapeuta
            await tx.legendaTerapeuta.create({
                data: {
                    legendaId: legenda.id,
                    terapeutaId: terapeuta.id,
                    clinicaId: terapeuta.clinicaId
                }
            })

            return { terapeuta, legenda }
        })

        res.status(201).json(resultado.terapeuta)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.patch("/:id/:clinicaId", async (req, res) => {
    const { id, clinicaId } = req.params
    const { nome, email, cpfCnpj, telefone1, telefone2, profissao } = req.body

    if (!nome && !email && !cpfCnpj && !telefone1 && !profissao) {
        res.status(400).json({ "erro": "Informe pelo menos 1 dos dados: nome, email, cpfCnpj, telefone1, telefone2, profissao" })
        return
    }

    try {
        // Se estiver atualizando o email, verificar se já existe outro terapeuta com o mesmo email
        if (email) {
            const terapeutaExistenteEmail = await prisma.terapeuta.findFirst({
                where: {
                    email: email,
                    clinicaId: clinicaId,
                    NOT: {
                        id: id
                    }
                }
            })

            if (terapeutaExistenteEmail) {
                res.status(409).json({ "erro": "Já existe um funcionário cadastrado com este e-mail nesta clínica" })
                return
            }
        }

        // Se estiver atualizando o CPF/CNPJ, verificar se já existe outro terapeuta com o mesmo CPF/CNPJ
        if (cpfCnpj) {
            const terapeutaExistenteCpf = await prisma.terapeuta.findFirst({
                where: {
                    cpfCnpj: cpfCnpj,
                    clinicaId: clinicaId,
                    NOT: {
                        id: id
                    }
                }
            })

            if (terapeutaExistenteCpf) {
                res.status(409).json({ "erro": "Já existe um funcionário cadastrado com este CPF/CNPJ nesta clínica" })
                return
            }
        }

        const updateData: any = {}

        if (nome) updateData.nome = nome
        if (email) updateData.email = email
        if (cpfCnpj) updateData.cpfCnpj = cpfCnpj
        if (telefone1) updateData.telefone1 = telefone1
        if (telefone2) updateData.telefone2 = telefone2
        if (profissao) updateData.profissao = profissao

        const terapeuta = await prisma.terapeuta.update({
            where: {
                id_clinicaId: {
                    id: id,
                    clinicaId: clinicaId,
                },
            },
            data: updateData
        })

        res.status(200).json(terapeuta)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/", async (req, res) => {
    const { id, clinicaId } = req.body;

    if (!id || !clinicaId) {
        res.status(400).json({ "erro": "Informe id e clinicaId" });
        return;
    }

    try {
        // Usar uma transação para remover o terapeuta e sua legenda atomicamente
        const resultado = await prisma.$transaction(async (tx) => {
            // Buscar a relação legenda-terapeuta
            const legendaTerapeuta = await tx.legendaTerapeuta.findFirst({
                where: {
                    terapeutaId: id,
                    clinicaId: clinicaId
                }
            })

            // Deletar o terapeuta
            const terapeuta = await tx.terapeuta.delete({
                where: {
                    id_clinicaId: {
                        id: id,
                        clinicaId: clinicaId,
                    },
                }
            })

            // Se existe uma legenda associada, remover a relação e a legenda
            if (legendaTerapeuta) {
                await tx.legendaTerapeuta.delete({
                    where: {
                        legendaId_terapeutaId_clinicaId: {
                            legendaId: legendaTerapeuta.legendaId,
                            terapeutaId: id,
                            clinicaId: clinicaId
                        }
                    }
                })

                // Remover a legenda se não for fixa
                await tx.legenda.deleteMany({
                    where: {
                        id: legendaTerapeuta.legendaId,
                        isFixed: false
                    }
                })
            }

            return terapeuta
        })

        res.status(200).json(resultado)
    } catch (error) {
        res.status(400).json(error)
    }
})

async function enviaEmail(nome: string, email: string, codigo: number) {
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 587,
        secure: false,
        auth: {
            user: "ad91b593d3bd91",
            pass: "e651939fccc397",
        },
    });

    const info = await transporter.sendMail({
        from: '"Íris" <iris@iris.com>',
        to: email,
        subject: "Código para Solicitação de Troca de Senha",
        text: `Olá, ${nome}\n\nSeu código para troca de senha é: ${codigo}`,
        html: `<h3>Olá, ${nome}</h3>
               <h3>Seu código para troca de senha é: ${codigo}`
    });

    console.log("Message sent: %s", info.messageId);
}

export default router