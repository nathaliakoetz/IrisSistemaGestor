import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const clinicas = await prisma.clinica.findMany({
            include: {
                dadosUsuario: true,
                Terapeuta: true,
                Legendas: true,
                DependenteClinica: {
                    include: {
                        dependente: {
                            include: {
                                ResponsavelDependente: {
                                    include: {
                                        responsavel: true
                                    }
                                }
                            }
                        }
                    }
                },
                ResponsavelClinica: {
                    include: {
                        responsavel: {
                            include: {
                                endereco: true,
                                ResponsavelDependente: {
                                    include: {
                                        dependente: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(clinicas)
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
        const dados = await prisma.dadosUsuario.create({
            data: {
                nome,
                email,
                senha: hash,
                cpfCnpj,
                telefone1,
                telefone2: telefone2 ? telefone2 : null
            }
        })

        const clinica = await prisma.clinica.create({
            data: {
                dadosUsuarioId: dados.id
            }
        })

        res.status(201).json(clinica)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {

        const updated = await prisma.clinica.findUnique({
            where: { id },
            select: {
                updatedAt: true
            }
        })

        const clinica = await prisma.clinica.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedAt: updated?.updatedAt
            }
        })

        res.status(200).json(clinica)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.patch("/:id", async (req, res) => {
    const { id } = req.params
    const { nome, email, cpfCnpj, telefone1, telefone2, foto } = req.body

    if (!nome && !email && !cpfCnpj && !telefone1 && !telefone2 && !foto) {
        res.status(400).json({ erro: "Informe pelo menos 1 dos dados: nome, email, cpfCnpj, telefone1, telefone2, foto" })
        return
    }

    const updateData: any = {}

    if (nome) updateData.nome = nome
    if (email) updateData.email = email
    if (cpfCnpj) updateData.cpfCnpj = cpfCnpj
    if (telefone1) updateData.telefone1 = telefone1
    if (telefone2) updateData.telefone2 = telefone2
    if (foto) updateData.foto = foto

    try {
        const clinica = await prisma.clinica.update({
            where: { id },
            data: {
                dadosUsuario: {
                    update: updateData
                }
            },
            include: {
                dadosUsuario: true
            }
        })

        res.status(200).json(clinica)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.patch("/reativar/:id", async (req, res) => {
    const { id } = req.params

    try {

        const updated = await prisma.clinica.findUnique({
            where: { id },
            select: {
                updatedAt: true
            }
        })

        const clinica = await prisma.clinica.update({
            where: { id },
            data: {
                deletedAt: null,
                updatedAt: updated?.updatedAt
            }
        })

        res.status(200).json(clinica)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/ativas", async (req, res) => {
    try {
        const clinicas = await prisma.clinica.findMany({
            where: {
                deletedAt: null
            },
            include: {
                dadosUsuario: true
            }
        })
        res.status(200).json(clinicas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const clinicas = await prisma.clinica.findUnique({
            where: { id },
            include: {
                dadosUsuario: true,
                Terapeuta: true,
                Legendas: true,
                ResponsavelClinica: {
                    include: {
                        responsavel: {
                            include: {
                                endereco: true,
                                ResponsavelDependente: {
                                    include: {
                                        dependente: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(clinicas)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/login", async (req, res) => {
    const { email, senha } = req.body

    const mensaPadrao = "Login ou senha incorretos"

    console.log('Tentativa de login:', email);

    if (!email || !senha) {
        console.log('Campos vazios');
        res.status(400).json({ erro: mensaPadrao })
        return
    }

    try {
        const dadosUsuario = await prisma.dadosUsuario.findUnique({
            where: { email },
            include: { clinica: true }
        })

        if (!dadosUsuario) {
            console.log('Usuário não encontrado:', email);
            res.status(400).json({ erro: mensaPadrao })
            return
        }

        if (dadosUsuario.clinica && dadosUsuario.clinica.deletedAt) {
            console.log('Conta desativada:', email);
            res.status(400).json({ erro: "Conta desativada" })
            return
        }

        const senhaCorreta = bcrypt.compareSync(senha, dadosUsuario.senha);
        console.log('Senha correta:', senhaCorreta);

        if (senhaCorreta) {
            // Verificar se JWT_KEY existe
            if (!process.env.JWT_KEY) {
                console.error('JWT_KEY não configurada!');
                res.status(500).json({ erro: "Erro de configuração do servidor" })
                return
            }

            const token = jwt.sign({
                admin_logado_id: dadosUsuario.clinica?.id,
                admin_logado_nome: dadosUsuario.nome
            },
                process.env.JWT_KEY as string,
                { expiresIn: "12h" }
            )

            console.log('Login bem-sucedido para:', email);
            res.status(200).json({ id: dadosUsuario.clinica?.id, nome: dadosUsuario.nome, token })
        } else {
            console.log('Senha incorreta para:', email);
            res.status(400).json({ erro: mensaPadrao })
        }
    } catch (error) {
        console.error("Erro ao tentar autenticar o usuário:", error)
        res.status(500).json({ erro: "Erro interno do servidor" })
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

router.get("/horarios/:id", async (req, res) => {
    const { id } = req.params

    try {
        const horarios = await prisma.horario.findMany({
            where: {
                clinicaId: id
            },
            include: {
                clinica: {
                    include: {
                        dadosUsuario: true
                    }
                }
            }
        })

        console.log(horarios)
        res.status(200).json(horarios)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/horario", async (req, res) => {
    const { clinicaId, data, horario } = req.body

    if (!clinicaId || !data || !horario) {
        res.status(400).json({ erro: "Informe clinicaId, data, horario" })
        return
    }

    try {
        const horarioExistente = await prisma.horario.findUnique({
            where: {
                clinicaId_data: {
                    clinicaId,
                    data: new Date(data)
                }
            }
        })

        if (horarioExistente) {
            if (horarioExistente.horarios.includes(horario)) {
                res.status(400).json({ erro: "Horário já existe para esta data" })
                return
            }

            const horariosAtualizados = [...horarioExistente.horarios, horario].sort()
            const horarios = await prisma.horario.update({
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
            res.status(201).json(horarios)
        } else {
            const horarios = await prisma.horario.create({
                data: {
                    clinicaId,
                    data: new Date(data),
                    horarios: [horario]
                }
            })
            res.status(201).json(horarios)
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

// router.post("/gera-codigo", async (req, res) => {
//     const { email } = req.body;

//     try {
//         const clinica = await prisma.clinica.findUnique({ where: { email } });

//         if (!clinica) {
//             res.status(404).json({ erro: "E-mail não encontrado" });
//             return;
//         }

//         const codigo = Math.floor(100000 + Math.random() * 900000);
//         enviaEmail(clinica.nome, clinica.email, codigo);

//         await prisma.clinica.update({

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
//         const clinica = await prisma.clinica.findUnique({ where: { email } });

//         if (!clinica) {
//             res.status(404).json({ erro: "E-mail não encontrado" });
//             return;
//         }

//         if (Number(codigo) !== clinica.codigo) {
//             res.status(400).json({ erro: "Código incorreto" });
//             return;
//         }

//         res.status(200).json({ mensagem: "Código verificado!" });
//     } catch (error) {
//         res.status(400).json({ erro: "Erro ao verificar código" });
//     }
// });

router.patch("/alterar-senha", async (req, res) => {
    const { email, novaSenha } = req.body;

    const erros = validaSenha(novaSenha)
    if (erros.length > 0) {
        res.status(400).json({ erro: erros.join("; ") })
        return
    }

    try {
        const clinica = await prisma.dadosUsuario.findUnique({
            where: { email }
        });

        if (!clinica) {
            res.status(404).json({ erro: "E-mail não encontrado" });
            return;
        }

        const senhaAntiga = clinica.senha;

        if (bcrypt.compareSync(novaSenha, senhaAntiga)) {
            res.status(400).json({ erro: "A nova senha não pode ser igual à senha antiga" });
            return;
        }

        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(novaSenha, salt);

        await prisma.dadosUsuario.update({
            where: { email },
            data: {
                senha: hash
            }
        });

        res.status(200).json({ mensagem: "Senha alterada com sucesso!" });
    } catch (error) {
        res.status(400).json({ erro: "Erro ao alterar senha" });
    }
});

export default router