import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'
import nodemailer from "nodemailer"

// const prisma = new PrismaClient()
const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
  try {
    const dados = await prisma.dadosUsuario.findMany()
    res.status(200).json(dados)
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