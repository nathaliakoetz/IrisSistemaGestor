import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'
import nodemailer from "nodemailer"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
    try {
        const treinadores = await prisma.treinador.findMany()
        res.status(200).json(treinadores)
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
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        res.status(400).json({ erro: "Informe nome, email e senha" })
        return
    }

    const erros = validaSenha(senha)
    if (erros.length > 0) {
        res.status(400).json({ erro: erros.join("; ") })
        return
    }

    // 12 é o número de voltas (repetições) que o algoritmo faz
    // para gerar o salt (sal/tempero)
    const salt = bcrypt.genSaltSync(12)
    // gera o hash da senha acrescida do salt
    const hash = bcrypt.hashSync(senha, salt)

    // para o campo senha, atribui o hash gerado
    try {
        const treinador = await prisma.treinador.create({
            data: { nome, email, senha: hash }
        })
        res.status(201).json(treinador)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {

        await prisma.captura.deleteMany({
            where: {
                treinadorId: id,
            }
        })

        const treinador = await prisma.treinador.delete({
            where: { id }
        })

        res.status(200).json(treinador)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        res.status(400).json({ "erro": "Informe nome, email, senha," })
        return
    }

    try {

        const treinador = await prisma.treinador.update({
            where: { id: id },
            data: {
                nome,
                email,
                senha
            }
        })

        res.status(200).json(treinador)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post("/login", async (req, res) => {
    const { email, senha } = req.body

    // em termos de segurança, o recomendado é exibir uma mensagem padrão
    // a fim de evitar de dar "dicas" sobre o processo de login para hackers
    const mensaPadrao = "Login ou senha incorretos"

    if (!email || !senha) {
        res.status(400).json({ erro: mensaPadrao })
        return
    }

    try {
        const treinador = await prisma.treinador.findUnique({
            where: { email }
        })

        if (treinador == null) {
            res.status(400).json({ erro: mensaPadrao })
            return
        }

        // se o e-mail existe, faz-se a comparação dos hashs
        if (bcrypt.compareSync(senha, treinador.senha)) {
            res.status(200).json({
                id: treinador.id,
                nome: treinador.nome,
                email: treinador.email,
            })
        } else {
            res.status(400).json({ erro: mensaPadrao })
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const treinador = await prisma.treinador.findUnique({
            where: { id }
        })

        if (treinador == null) {
            res.status(400).json({ erro: "Não Cadastrado!" })
            return
        } else {
            res.status(200).json({
                id: treinador.id,
                nome: treinador.nome,
                email: treinador.email,
            })
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/:treinadorId/capturas", async (req, res) => {

    const { treinadorId } = req.params;

    try {
        const capturas = await prisma.captura.findMany({
            where: {
                treinadorId
            },
            include: {
                pokemon: true
            }
        })

        const pokemonsCapturados = capturas.map(captura => captura.pokemon);

        res.status(200).json(pokemonsCapturados)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get("/:treinadorId/capturas/grupos/:grupoId", async (req, res) => {

    const { treinadorId, grupoId } = req.params;

    try {
        const capturas = await prisma.captura.findMany({
            where: {
                treinadorId,
                pokemon: {
                    grupoId: Number(grupoId)
                }
            },
            include: {
                pokemon: true
            }
        })

        const pokemonsCapturados = capturas.map(captura => captura.pokemon);

        res.status(200).json(pokemonsCapturados)
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
        from: '"Wiki Pokedex" <wikipokedex@wikipokedex.com>',
        to: email,
        subject: "Código para Solicitação de Troca de Senha",
        text: `Olá, ${nome}\n\nSeu código para troca de senha é: ${codigo}`,
        html: `<h3>Olá, ${nome}</h3>
               <h3>Seu código para troca de senha é: ${codigo}`
    });

    console.log("Message sent: %s", info.messageId);
}

router.post("/gera-codigo", async (req, res) => {
    const { email } = req.body;

    try {
        const treinador = await prisma.treinador.findUnique({ where: { email } });

        if (!treinador) {
            res.status(404).json({ erro: "E-mail não encontrado" });
            return;
        }

        const codigo = Math.floor(100000 + Math.random() * 900000);
        enviaEmail(treinador.nome, treinador.email, codigo);

        await prisma.treinador.update({

            where: { email },

            data: { codigo: codigo }

        });

        res.status(200).json({ mensagem: "Código enviado para o seu e-mail" });
    } catch (error) {
        res.status(400).json({ erro: "Erro ao enviar código" });
    }
});

router.post("/verificar-codigo", async (req, res) => {
    const { email, codigo } = req.body;

    try {
        const treinador = await prisma.treinador.findUnique({ where: { email } });

        if (!treinador) {
            res.status(404).json({ erro: "E-mail não encontrado" });
            return;
        }

        if (Number(codigo) !== treinador.codigo) {
            res.status(400).json({ erro: "Código incorreto" });
            return;
        }

        res.status(200).json({ mensagem: "Código verificado!" });
    } catch (error) {
        res.status(400).json({ erro: "Erro ao verificar código" });
    }
});

router.patch("/alterar-senha", async (req, res) => {
    const { email, novaSenha } = req.body;

    const erros = validaSenha(novaSenha)
    if (erros.length > 0) {
        res.status(400).json({ erro: erros.join("; ") })
        return
    }

    try {
        const treinador = await prisma.treinador.findUnique({ where: { email } });

        if (!treinador) {
            res.status(404).json({ erro: "E-mail não encontrado" });
            return;
        }

        const senhaAntiga = treinador.senha;

        if (bcrypt.compareSync(novaSenha, senhaAntiga)) {
            res.status(400).json({ erro: "A nova senha não pode ser igual à senha antiga" });
            return;
        }

        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(novaSenha, salt);

        await prisma.treinador.update({
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