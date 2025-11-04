# 🎯 GUIA RÁPIDO - Deploy para Apresentação TCC

## ⏱️ Tempo estimado: 20-30 minutos

---

## PASSO 1: Subir código no GitHub (5 min)

### 1.1 Criar conta no GitHub (se não tiver)
- Acesse: https://github.com/signup
- Crie sua conta

### 1.2 Criar novo repositório
- Acesse: https://github.com/new
- Nome: `IrisSistemaGestor`
- Tipo: **Público**
- NÃO marque nenhuma opção
- Clique em **Create repository**

### 1.3 Subir o código
Abra o terminal na pasta do projeto e execute:

```bash
git init
git add .
git commit -m "Deploy para TCC"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/IrisSistemaGestor.git
git push -u origin main
```

✅ Código no GitHub!

---

## PASSO 2: Deploy do Banco de Dados + Backend (10 min)

### 2.1 Criar conta no Render
- Acesse: https://render.com
- Clique em **Get Started for Free**
- Faça login com GitHub

### 2.2 Criar Banco de Dados PostgreSQL
1. No dashboard, clique em **New +** → **PostgreSQL**
2. Preencha:
   - Name: `iris-database`
   - Database: `iris_db`
   - Region: `Oregon (US West)`
   - Plan: **Free**
3. Clique em **Create Database**
4. ⚠️ **IMPORTANTE**: Copie a **Internal Database URL** (começa com `postgresql://`)
   - Cole em um bloco de notas

### 2.3 Criar Web Service (Backend)
1. No dashboard, clique em **New +** → **Web Service**
2. Selecione **Build and deploy from a Git repository**
3. Conecte o GitHub e escolha o repositório `IrisSistemaGestor`
4. Configurações:
   - **Name**: `iris-backend`
   - **Region**: `Oregon (US West)` (mesma do banco)
   - **Branch**: `main`
   - **Root Directory**: `back`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npx ts-node index.ts`
   - **Instance Type**: **Free**

5. **Environment Variables** - Clique em **Add Environment Variable** e adicione:
   
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Cole a Internal Database URL que você copiou |
   | `PORT` | `3001` |
   | `JWT_SECRET` | `iris_tcc_secret_2025` |
   | `NODE_ENV` | `production` |

6. Clique em **Create Web Service**
7. Aguarde 5-10 minutos para o deploy completar
8. ⚠️ **COPIE A URL DO BACKEND** (algo como `https://iris-backend.onrender.com`)

✅ Backend funcionando!

---

## PASSO 3: Deploy do Frontend (5 min)

### 3.1 Criar conta na Vercel
- Acesse: https://vercel.com/signup
- Faça login com GitHub

### 3.2 Importar projeto
1. No dashboard, clique em **Add New...** → **Project**
2. Escolha o repositório `IrisSistemaGestor`
3. Clique em **Import**

### 3.3 Configurar
1. **Framework Preset**: Next.js (já detecta automaticamente)
2. **Root Directory**: Clique em **Edit** e selecione `front`
3. **Build and Output Settings**: deixe como está

### 3.4 Adicionar variável de ambiente
1. Clique em **Environment Variables**
2. Adicione:
   - **Name**: `NEXT_PUBLIC_URL_API`
   - **Value**: Cole a URL do backend do Render (sem barra no final)
   - Exemplo: `https://iris-backend.onrender.com`
3. Selecione **Production**, **Preview** e **Development**

### 3.5 Fazer Deploy
1. Clique em **Deploy**
2. Aguarde 2-5 minutos
3. ✅ Quando aparecer os fogos 🎉, clique em **Visit** ou copie a URL

✅ Sistema completo no ar!

---

## 🎓 PARA A APRESENTAÇÃO

### URLs para compartilhar com a banca:

**Frontend (principal)**: `______________________________`

**Backend (API)**: `______________________________`

### ⚠️ IMPORTANTE - Leia antes da apresentação!

**Limitação do plano gratuito do Render:**
- O backend "dorme" após 15 minutos sem uso
- **Primeiro acesso demora 30-60 segundos para "acordar"**
- Depois disso, funciona normalmente

**💡 DICA IMPORTANTE:**
1. ✅ **5 minutos ANTES da apresentação**, acesse o sistema você mesmo
2. ✅ Faça um teste rápido (criar um cadastro, fazer login)
3. ✅ Isso "acorda" o servidor
4. ✅ Durante a apresentação, o sistema estará rápido para a banca

### Mensagem para enviar à banca:

```
Prezada Banca,

Segue o link para teste do Sistema Iris:

🌐 URL: https://[SUA-URL-DA-VERCEL].vercel.app

O sistema está hospedado em servidor gratuito. Caso o primeiro acesso 
demore alguns segundos, é normal - após isso funciona perfeitamente.

Funcionalidades disponíveis para teste:
- Cadastro de clínicas e terapeutas
- Gestão de pacientes (dependentes e responsáveis)
- Agendamento de consultas
- Área do cliente e área médica
- Geração de relatórios

Atenciosamente,
[Seu Nome]
```

---

## 🆘 SE ALGO DER ERRADO

### Backend não está funcionando:
1. Acesse o dashboard do Render
2. Clique no seu service `iris-backend`
3. Vá em **Logs** - veja o erro
4. Problema comum: DATABASE_URL incorreta
   - Vá em **Environment** → edite a DATABASE_URL
   - Cole a URL correta (Internal Database URL)

### Frontend não conecta no backend:
1. Acesse o dashboard da Vercel
2. Clique no seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Verifique se `NEXT_PUBLIC_URL_API` está correta
5. Se mudou algo, vá em **Deployments** → clique nos 3 pontinhos → **Redeploy**

### Ainda com problemas?
- Render Support: https://render.com/docs
- Vercel Support: https://vercel.com/docs
- Ou me chame! 😊

---

## 📊 Checklist Final

Antes da apresentação, verifique:

- [ ] Frontend está acessível
- [ ] Backend está acessível (adicione `/` no final da URL para ver "API: Íris Sistema Gestor")
- [ ] Consegue fazer login/cadastro
- [ ] URLs anotadas para compartilhar
- [ ] Sistema testado 5 minutos antes da apresentação

---

**Boa sorte na apresentação! 🎓🚀**

Você preparou um ótimo trabalho, agora é só apresentar com confiança! 💪
