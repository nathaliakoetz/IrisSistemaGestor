# 🌸 Iris - Sistema Gestor para Clínicas

Sistema completo de gestão para clínicas médicas e terapêuticas, desenvolvido como Trabalho de Conclusão de Curso.

## 🚀 Deploy Rápido

Para fazer o deploy do projeto para apresentação do TCC, siga o guia completo em:

**📖 [DEPLOY.md](./DEPLOY.md)**

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Zustand (State Management)

## 💻 Executar Localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL

### Backend
```bash
cd back
npm install
# Configure o .env com sua DATABASE_URL
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd front
npm install
# Configure o .env.local com NEXT_PUBLIC_API_URL
npm run dev
```

## 📱 Funcionalidades

- ✅ Cadastro e gestão de clínicas
- ✅ Gestão de terapeutas e profissionais
- ✅ Cadastro de pacientes e responsáveis
- ✅ Agendamento de consultas
- ✅ Área do cliente
- ✅ Área médica
- ✅ Geração de relatórios
- ✅ Calendário de consultas

## 👥 Autores

Projeto desenvolvido para TCC - Análise e Desenvolvimento de Sistemas

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.
