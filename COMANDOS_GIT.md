# 📝 Comandos Git Prontos - Copy & Paste

## ⚠️ ANTES DE EXECUTAR

1. Abra o terminal na pasta raiz do projeto (onde está este arquivo)
2. Certifique-se que você já criou o repositório no GitHub
3. Tenha em mãos a URL do seu repositório

---

## 🚀 Comandos para Executar

### PASSO 1: Inicializar Git (se ainda não foi)

```bash
git init
```

### PASSO 2: Adicionar todos os arquivos

```bash
git add .
```

### PASSO 3: Fazer o primeiro commit

```bash
git commit -m "Deploy para apresentacao TCC"
```

### PASSO 4: Renomear branch para main

```bash
git branch -M main
```

### PASSO 5: Conectar ao repositório GitHub

⚠️ **IMPORTANTE**: Substitua `SEU_USUARIO` e `NOME_DO_REPO` pelos valores corretos!

```bash
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
```

**Exemplo:**
```bash
git remote add origin https://github.com/nathaliakoetz/IrisSistemaGestor.git
```

### PASSO 6: Enviar para o GitHub

```bash
git push -u origin main
```

---

## ✅ Pronto!

Se todos os comandos executaram sem erro, seu código está no GitHub!

Acesse: `https://github.com/SEU_USUARIO/NOME_DO_REPO` para verificar.

---

## 🆘 Erros Comuns

### "fatal: remote origin already exists"

Você já adicionou o remote. Para corrigir:

```bash
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
```

### "Author identity unknown"

Configure seu nome e email:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

Depois execute o commit novamente.

### "failed to push"

Provavelmente o repositório já tem conteúdo. Para forçar:

```bash
git push -u origin main --force
```

⚠️ Use `--force` apenas se tiver certeza!

---

## 📌 Comandos Úteis

### Ver status do git

```bash
git status
```

### Ver histórico de commits

```bash
git log --oneline
```

### Ver arquivos que serão enviados

```bash
git diff --cached --name-only
```

---

## 🔄 Atualizar Código Depois do Deploy

Se você fizer alterações e quiser atualizar:

```bash
git add .
git commit -m "Descricao das alteracoes"
git push
```

O Render e Vercel vão detectar automaticamente e fazer redeploy!

---

## 👉 Próximo Passo

Depois que o código estiver no GitHub, continue com o **GUIA_DEPLOY_SIMPLES.md** no **PASSO 2**.
