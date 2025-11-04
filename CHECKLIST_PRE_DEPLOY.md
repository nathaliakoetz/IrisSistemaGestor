# ✅ Checklist de Verificação Pré-Deploy

## Antes de fazer o deploy, verifique:

### 📁 Arquivos criados:
- [x] `.gitignore` - Evita subir arquivos sensíveis
- [x] `back/build.sh` - Script de build para o Render
- [x] `back/.env.example` - Exemplo de variáveis de ambiente
- [x] `front/.env.example` - Exemplo de variáveis de ambiente
- [x] `GUIA_DEPLOY_SIMPLES.md` - Guia passo a passo
- [x] `DEPLOY.md` - Documentação completa

### ⚙️ Configurações ajustadas:
- [x] Backend usa `process.env.PORT` - Permite Render definir a porta
- [x] `package.json` do backend tem script `start` e `build`
- [x] CORS configurado (permite todas as origens)
- [x] ts-node adicionado como dependência de produção

### 🔍 Verifique manualmente:

#### 1. Frontend se conecta ao backend?
Abra `front/src` e procure onde faz chamadas à API.
Certifique-se que usa uma variável de ambiente, exemplo:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
```

#### 2. Tem arquivo .env local?
- [ ] Verifique se tem `.env` em `back/` ou `front/`
- [ ] Se tiver, certifique-se que está no `.gitignore` (já está!)
- [ ] NÃO suba esses arquivos para o GitHub

#### 3. Credenciais sensíveis?
- [ ] Verifique se não há senhas, tokens ou chaves no código
- [ ] Use variáveis de ambiente para tudo que é sensível

---

## 🚀 Pronto para Deploy!

Se todos os itens acima estão ✅, você pode seguir o **GUIA_DEPLOY_SIMPLES.md**

---

## 📝 Anotações Importantes

Anote aqui as URLs depois do deploy:

**GitHub Repository**: 
`https://github.com/________________/IrisSistemaGestor`

**Render - Backend**: 
`https://________________.onrender.com`

**Render - Database Internal URL**: 
`postgresql://________________`

**Vercel - Frontend**: 
`https://________________.vercel.app`

---

## 🎯 Ordem de Deploy

1. ✅ GitHub (subir código)
2. ✅ Render Database (criar banco PostgreSQL)
3. ✅ Render Web Service (backend)
4. ✅ Vercel (frontend)
5. ✅ Testar tudo

**Tempo total estimado: 20-30 minutos**

---

Boa sorte! 🍀
