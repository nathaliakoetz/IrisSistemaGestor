import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'
import nodemailer from "nodemailer"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const funcionarios = await prisma.funcionario.findMany({
            include: {
                Terapeuta: {
                    select: {
                        clinica: {
                            select: {
                                dadosUsuario: {
                                    select: {
                                        nome: true,
                                        email: true,
                                        cpfCnpj: true,
                                        telefone1: true,
                                        telefone2: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(funcionarios)
    } catch (error) {
        res.status(400).json(error)
    }
})

function validaSenha(senha: string) {

    const mensa: string[] = []

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
    const { nome, email, senha, cpfCnpj, telefone1, telefone2 } = req.body

    if (!nome || !email || !senha || !cpfCnpj || !telefone1) {
        res.status(400).json({ erro: "Informe nome, email, senha, cpfCnpj e telefones" })
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
        const funcionario = await prisma.funcionario.create({
            data: {
                nome,
                email,
                senha: hash,
                cpfCnpj,
                telefone1,
                telefone2: telefone2 ? telefone2 : null
            }
        })

        res.status(201).json(funcionario)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {

        const funcionario = await prisma.funcionario.delete({
            where: { id }
        })

        res.status(200).json(funcionario)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.patch("/:id", async (req, res) => {
    const { id } = req.params
    const { nome, email, cpfCnpj, telefone1, telefone2 } = req.body

    const updateData: any = {}

    if (nome) updateData.nome = nome
    if (email) updateData.email = email
    if (cpfCnpj) updateData.cpfCnpj = cpfCnpj
    if (telefone1) updateData.telefone1 = telefone1
    if (telefone2) updateData.telefone2 = telefone2

    try {
        const funcionario = await prisma.funcionario.update({
            where: { id },
            data: updateData
        })

        res.status(200).json(funcionario)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/login", async (req, res) => {
    const { clinicaId, email, senha } = req.body

    const mensaPadrao = "Login ou senha incorretos"

    if (!clinicaId || !email || !senha) {
        res.status(400).json({ erro: mensaPadrao })
        return
    }

    try {
        const funcionario = await prisma.funcionario.findFirst({
            where: {
                email,
                Terapeuta: {
                    some: {
                        clinicaId
                    }
                }
            }
        })

        if (!funcionario) {
            res.status(400).json({ erro: mensaPadrao })
            return
        }

        if (bcrypt.compareSync(senha, funcionario.senha)) {
            res.status(200).json({
                id: funcionario.id,
                nome: funcionario.nome,
                email: funcionario.email
            })
        } else {
            res.status(400).json({ erro: mensaPadrao })
        }
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

// router.post("/gera-codigo", async (req, res) => {
//     const { email } = req.body;

//     try {
//         const funcionario = await prisma.funcionario.findUnique({ where: { email } });

//         if (!funcionario) {
//             res.status(404).json({ erro: "E-mail não encontrado" });
//             return;
//         }

//         const codigo = Math.floor(100000 + Math.random() * 900000);
//         enviaEmail(funcionario.nome, funcionario.email, codigo);

//         await prisma.funcionario.update({

//             where: { email },

//             data: { codigo: codigo }

//         });

//         res.status(200).json({ mensagem: "Código enviado para o seu e-mail" });
//     } catch (error) {
//         res.status(400).json({ erro: "Erro ao enviar código" });
//     }
// });

// router.post("/verificar-codigo", async (req, res) => {
//     const { email, codigo } = req.body;

//     try {
//         const funcionario = await prisma.funcionario.findUnique({ where: { email } });

//         if (!funcionario) {
//             res.status(404).json({ erro: "E-mail não encontrado" });
//             return;
//         }

//         if (Number(codigo) !== funcionario.codigo) {
//             res.status(400).json({ erro: "Código incorreto" });
//             return;
//         }

//         res.status(200).json({ mensagem: "Código verificado!" });
//     } catch (error) {
//         res.status(400).json({ erro: "Erro ao verificar código" });
//     }
// });

// router.patch("/alterar-senha", async (req, res) => {
//     const { email, novaSenha } = req.body;

//     const erros = validaSenha(novaSenha)
//     if (erros.length > 0) {
//         res.status(400).json({ erro: erros.join("; ") })
//         return
//     }

//     try {
//         const funcionario = await prisma.funcionario.findUnique({ where: { email } });

//         if (!funcionario) {
//             res.status(404).json({ erro: "E-mail não encontrado" });
//             return;
//         }

//         const senhaAntiga = funcionario.senha;

//         if (bcrypt.compareSync(novaSenha, senhaAntiga)) {
//             res.status(400).json({ erro: "A nova senha não pode ser igual à senha antiga" });
//             return;
//         }

//         const salt = bcrypt.genSaltSync(12);
//         const hash = bcrypt.hashSync(novaSenha, salt);

//         await prisma.funcionario.update({
//             where: { email },
//             data: {
//                 senha: hash
//             }
//         });

//         res.status(200).json({ mensagem: "Senha alterada com sucesso!" });
//     } catch (error) {
//         res.status(400).json({ erro: "Erro ao alterar senha" });
//     }
// });

export default router