# 🔧 Checklist - Variáveis de Ambiente no Render

## ⚠️ IMPORTANTE: Configurar no Backend (Render)

O login precisa dessas variáveis configuradas no Render:

### 1. DATABASE_URL
```
postgresql://usuario:senha@host:porta/database
```
- **Obtenha do:** Dashboard do PostgreSQL no Render
- **Exemplo:** `postgresql://iris_db_user:abc123@dpg-xyz.oregon-postgres.render.com/iris_db`

### 2. JWT_KEY (ou JWT_SECRET)
```
uma_chave_secreta_aleatoria_qualquer_123456
```
- **Pode ser qualquer texto longo e aleatório**
- **Exemplo:** `minha_super_chave_secreta_2024_iris_@#$`
- ⚠️ **Sem aspas!** Apenas o texto

### 3. PORT
- **Deixar VAZIO** (Render define automaticamente)

### 4. NODE_ENV
```
production
```

---

## 📋 Como Configurar no Render

1. Dashboard do Render → Seu serviço de backend
2. **Environment** (menu lateral)
3. **Add Environment Variable**
4. Adicionar cada variável:
   - Key: `JWT_KEY`
   - Value: `sua_chave_secreta_aqui`
5. Clicar em **Save Changes**
6. **Aguardar redeploy automático** (~2-3 minutos)

---

## 🧪 Como Testar se está funcionando

### No navegador (console F12):

Depois de fazer commit/push das mudanças:

1. Ir na página de login
2. Abrir F12 → Console
3. Tentar fazer login
4. Ver os logs:
   ```
   Tentando login com: seu@email.com
   URL da API: https://iris-backend-peum.onrender.com
   Status da resposta: 200 (ou 400, 500...)
   ```

### Nos Logs do Render:

1. Dashboard → Seu serviço → **Logs**
2. Procurar por:
   ```
   Tentativa de login: seu@email.com
   Senha correta: true
   Login bem-sucedido para: seu@email.com
   ```

---

## 🐛 Erros Comuns

### "JWT_KEY não configurada!"
**Solução:** Adicionar variável `JWT_KEY` no Render

### "Login ou senha incorretos" (mas a senha está certa)
**Causas possíveis:**
1. Email não cadastrado
2. Senha com hash diferente (cadastrou em localhost, tentando logar em produção)
3. **Solução:** Cadastrar novamente em produção

### "Erro interno do servidor"
**Ver logs do Render** para detalhes do erro

---

## ✅ Teste Rápido

Faça uma requisição direta para testar:

```bash
# Substituir pelos seus dados reais
curl -X POST https://iris-backend-peum.onrender.com/clinicas/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","senha":"suasenha"}'
```

**Resposta esperada:**
```json
{
  "id": "abc123",
  "nome": "Nome da Clínica",
  "token": "eyJhbGc..."
}
```

---

## 📝 Próximos Passos

1. ✅ Fazer commit e push das mudanças (logs adicionados)
2. ✅ Aguardar deploy no Render
3. ✅ Verificar se `JWT_KEY` está configurada
4. ✅ Testar login e ver console F12
5. ✅ Me mostrar os logs se der erro
