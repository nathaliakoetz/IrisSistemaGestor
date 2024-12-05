import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'
import nodemailer from "nodemailer"

const prisma = new PrismaClient()
const router = Router()

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
    const { nome, email, senha, cpfCnpj, telefone1, telefone2, clinicaId } = req.body

    if (!nome || !email || !senha || !cpfCnpj || !telefone1 || !clinicaId) {
        res.status(400).json({ "erro": "Informe nome, email, senha, cnpfCnpj, telefone1 e clinicaId" })
        return
    }

    const erros = validaSenha(senha)
    if (erros.length > 0) {
        res.status(400).json({ erro: erros.join("; ") })
        return
    }

    const salt = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(senha, salt)

    try {
        const terapeuta = await prisma.terapeuta.create({
            data: {
                nome,
                email,
                senha: hash,
                cpfCnpj,
                telefone1,
                telefone2: telefone2 ? telefone2 : null,
                clinicaId
            }
        })
        res.status(201).json(terapeuta)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.patch("/:id/:clinicaId", async (req, res) => {
    const { id, clinicaId } = req.params
    const { nome, email, cpfCnpj, telefone1, telefone2 } = req.body

    if (!nome && !email && !cpfCnpj && !telefone1) {
        res.status(400).json({ "erro": "Informe pelo menos 1 dos dados: nome, email, cpfCnpj, telefone1, telefone2" })
        return
    }

    const updateData: any = {}

    if (nome) updateData.nome = nome
    if (email) updateData.email = email
    if (cpfCnpj) updateData.cpfCnpj = cpfCnpj
    if (telefone1) updateData.telefone1 = telefone1
    if (telefone2) updateData.telefone2 = telefone2

    try {
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
        const terapeuta = await prisma.terapeuta.delete({
            where: {
                id_clinicaId: {
                    id: id,
                    clinicaId: clinicaId,
                },
            }
        })
        res.status(200).json(terapeuta)
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