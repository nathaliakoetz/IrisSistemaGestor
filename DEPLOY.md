# 🚀 Guia de Deploy - Sistema Iris

## Pré-requisitos
- Conta no GitHub
- Conta no Vercel (gratuita)
- Conta no Render (gratuita)

---

## 📦 PARTE 1: Preparar o Repositório GitHub

### 1. Criar repositório no GitHub
1. Acesse https://github.com/new
2. Nome: `IrisSistemaGestor` (ou o nome que preferir)
3. Deixe como **Público**
4. **NÃO** marque "Add a README file"
5. Clique em "Create repository"

### 2. Subir o código para o GitHub

Abra o terminal na pasta raiz do projeto e execute:

```bash
git init
git add .
git commit -m "Preparar projeto para deploy"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/IrisSistemaGestor.git
git push -u origin main
```

---

## 🗄️ PARTE 2: Deploy do Backend (Render)

### 1. Criar conta no Render
1. Acesse https://render.com
2. Clique em "Get Started for Free"
3. Faça login com sua conta do GitHub

### 2. Criar Banco de Dados PostgreSQL
1. No dashboard do Render, clique em "New +" → "PostgreSQL"
2. Configurações:
   - **Name**: `iris-database`
   - **Database**: `iris_db`
   - **User**: (deixe o padrão)
   - **Region**: `Oregon (US West)` ou mais próximo
   - **Plan**: **Free**
3. Clique em "Create Database"
4. **IMPORTANTE**: Copie a "Internal Database URL" e salve em algum lugar

### 3. Deploy do Backend
1. No dashboard do Render, clique em "New +" → "Web Service"
2. Conecte seu repositório GitHub
3. Configurações:
   - **Name**: `iris-backend`
   - **Region**: Mesma do banco de dados
   - **Branch**: `main`
   - **Root Directory**: `back`
   - **Runtime**: `Node`
   - **Build Command**: `bash build.sh`
   - **Start Command**: `npx ts-node index.ts`
   - **Plan**: **Free**

4. **Environment Variables** (Clique em "Add Environment Variable"):
   ```
   DATABASE_URL = [Cole a Internal Database URL que você copiou]
   PORT = 3001
   JWT_SECRET = iris_tcc_2025_secret_key
   NODE_ENV = production
   ```

5. Clique em "Create Web Service"
6. Aguarde o deploy (5-10 minutos)
7. **Copie a URL do backend** (algo como: `https://iris-backend.onrender.com`)

---

## 🎨 PARTE 3: Deploy do Frontend (Vercel)

### 1. Criar conta na Vercel
1. Acesse https://vercel.com
2. Clique em "Sign Up"
3. Faça login com sua conta do GitHub

### 2. Deploy do Frontend
1. No dashboard da Vercel, clique em "Add New..." → "Project"
2. Importe seu repositório `IrisSistemaGestor`
3. Configurações:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `front`
   - **Build Command**: `npm run build` (já vem preenchido)
   - **Output Directory**: `.next` (já vem preenchido)

4. **Environment Variables**:
   ```
   NEXT_PUBLIC_URL_API = [Cole a URL do backend do Render]
   ```
   Exemplo: `https://iris-backend.onrender.com`

5. Clique em "Deploy"
6. Aguarde o deploy (2-5 minutos)
7. **Copie a URL do frontend** (algo como: `https://iris-sistema-gestor.vercel.app`)

---

## ✅ PARTE 4: Testar o Sistema

### Acessar o sistema:
- **Frontend**: `https://iris-sistema-gestor.vercel.app`
- **Backend**: `https://iris-backend.onrender.com`

### ⚠️ IMPORTANTE - Primeiro Acesso:
O Render coloca aplicações gratuitas em "sleep" após 15 minutos de inatividade.
- **Primeiro acesso pode demorar 30-60 segundos** para "acordar" o backend
- Após o primeiro acesso, fica rápido por 15 minutos
- **DICA**: Abra o backend 5 minutos antes da apresentação

---

## 🎯 Para a Apresentação do TCC

### Antes da apresentação:
1. ✅ Acesse o frontend 5 minutos antes
2. ✅ Faça um teste rápido de login/cadastro
3. ✅ Mantenha as URLs anotadas:
   - Frontend: `______________________________`
   - Backend: `______________________________`

### Durante a apresentação:
- Compartilhe a URL do frontend com a banca
- Eles poderão acessar e testar livremente
- Se der timeout no primeiro acesso, explique que é normal no plano gratuito

---

## 🆘 Solução de Problemas Comuns

### Backend não conecta no banco:
1. Verifique se a `DATABASE_URL` está correta no Render
2. Use a **Internal Database URL**, não a External

### Frontend não conecta no backend:
1. Verifique a variável `NEXT_PUBLIC_API_URL` na Vercel
2. Certifique-se que está sem barra "/" no final
3. Verifique se o backend está rodando

### Erro de CORS:
O backend precisa permitir requisições do frontend. Verifique o arquivo `back/index.ts`

### Deploy falhou:
1. Verifique os logs no Render/Vercel
2. Certifique-se que as dependências estão no `package.json`
3. Verifique se o `build.sh` tem permissão de execução

---

## 📱 Compartilhar com a Banca

Envie este texto para a banca:

```
Prezada Banca,

Para testar o Sistema Iris, acesse:

🌐 URL: https://[SUA-URL].vercel.app

📋 Funcionalidades disponíveis:
- Cadastro de clínicas e terapeutas
- Gestão de pacientes e responsáveis
- Agendamento de consultas
- Área médica e área do cliente
- Geração de relatórios

⚠️ Observação: Como o sistema está em servidor gratuito, o primeiro acesso pode levar 30-60 segundos para carregar. Após isso, funciona normalmente.

Atenciosamente,
[Seu Nome]
```

---

## 💡 Alternativas (caso necessário)

### Se o Render estiver lento:
- **Railway**: Também gratuito, similar ao Render
- **Fly.io**: Outra opção gratuita

### Se precisar de mais performance:
- **Heroku**: Pago, mas mais estável ($7/mês)
- **Digital Ocean**: VPS mais barato ($4/mês)

---

## 📞 Suporte

Se tiver problemas, consulte:
- Documentação Render: https://render.com/docs
- Documentação Vercel: https://vercel.com/docs
- Prisma Deploy: https://www.prisma.io/docs/guides/deployment

Boa sorte na apresentação! 🎓🚀
