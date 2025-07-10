<h1 align="center">
  <img src="https://i.postimg.cc/44QgvkZ9/Logo.png" alt="Logo Íris" width="200"><br>
</h1>

<p align="center">
  <strong>Uma plataforma web integrada para a gestão de clínicas e o acompanhamento especializado de crianças com Transtorno do Espectro Autista (TEA).</strong>
</p>

<p align="center">
  <a href="https://github.com/nathaliakoetz/IrisSistemaGestor/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Licença MIT">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellowgreen" alt="Status do Projeto">
  </a>
  <a href="https://github.com/nathaliakoetz/IrisSistemaGestor/issues">
    <img src="https://img.shields.io/github/issues/nathaliakoetz/IrisSistemaGestor" alt="Issues">
  </a>
  <a href="https://github.com/nathaliakoetz/IrisSistemaGestor/stargazers">
    <img src="https://img.shields.io/github/stars/nathaliakoetz/IrisSistemaGestor" alt="Stars">
  </a>
</p>

## 📖 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [🚀 Como Começar](#-começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
- [🎨 Design e Prototipação](#-design-e-prototipação)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Como Contribuir](#-como-contribuir)
- [🧑‍💻 Autores](#-autores)

## 🎯 Sobre o Projeto

O **Sistema Gestor Íris** é uma aplicação web criada para auxiliar no acompanhamento e gerenciamento de informações de crianças autistas não-verbais em clínicas especializadas. O projeto nasceu da necessidade de uma solução que centralizasse as informações clínicas, facilitasse o acompanhamento interativo dos pacientes e criasse uma plataforma de conexão entre profissionais e clínicas.

Atualmente, muitos sistemas de gestão clínica são genéricos e não atendem às necessidades específicas desse público. O Íris se propõe a resolver essa lacuna, combinando a eficiência administrativa com ferramentas terapêuticas especializadas.

## ✨ Funcionalidades

- **Gestão Administrativa:** Cadastro e gerenciamento completo de clínicas, profissionais, pacientes e responsáveis.
- **Agenda Inteligente:** Sistema para agendamento de consultas com visualização interativa e gestão de horários.
- **Acompanhamento Clínico:** Registro detalhado de informações das consultas para acompanhamento do progresso dos pacientes.
- **Plataforma Connect:** Área para profissionais da saúde cadastrarem seus currículos, facilitando a conexão com clínicas.
- **Segurança e Conformidade:** Validação de senha, criptografia e estrutura pensada para a segurança dos dados.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

| Categoria | Tecnologia |
| :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) |
| **Estilização** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) |
| **Banco de Dados** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) |
| **ORM** | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) |

## 🚀 Como Começar

Siga estas instruções para obter uma cópia do projeto em execução na sua máquina local para desenvolvimento e testes.

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (v18 ou superior)
-   [Yarn](https://yarnpkg.com/) ou npm
-   [Git](https://git-scm.com/)
-   Uma instância do [PostgreSQL](https://www.postgresql.org/) ativa

### Instalação

1.  **Clone o repositório:**
    ```sh
    git clone [https://github.com/nathaliakoetz/IrisSistemaGestor.git](https://github.com/nathaliakoetz/IrisSistemaGestor.git)
    ```

2.  **Instale as dependências do Backend:**
    ```sh
    cd IrisSistemaGestor/back
    npm install
    ```

3.  **Instale as dependências do Frontend:**
    ```sh
    cd ../front
    npm install
    ```

4.  **Configure o Banco de Dados com Prisma:**
    -   No diretório `back`, renomeie o arquivo `.env.example` para `.env` (se existir) ou crie um novo.
    -   Adicione a URL de conexão do seu banco PostgreSQL:
        ```env
        DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO"
        ```
    -   Execute as migrações do Prisma para criar as tabelas do banco:
        ```sh
        npx prisma migrate dev
        ```

5.  **Inicie o servidor de Backend:**
    ```sh
    cd ../back
    npm run dev
    ```
    O backend estará rodando em `http://localhost:3004`.

6.  **Inicie o servidor de Frontend:**
    -   Abra um novo terminal.
    -   No diretório `front`, verifique se o arquivo `.env.local` contém a URL correta da API:
        ```
        NEXT_PUBLIC_URL_API="http://localhost:3004"
        ```
    -   Execute o comando:
        ```sh
        cd ../front
        npm run dev
        ```
    A aplicação estará disponível em `http://localhost:3000`.

## 🎨 Design e Prototipação

O design e o fluxo de telas do projeto foram criados no Figma e podem ser acessados publicamente.

➡️ **[Acessar Protótipo no Figma](https://www.figma.com/design/cMrr6Hh5QQ1Yx3vYUCKxLg/%C3%8Dris-Sistema-Gestor)**

## 🗺️ Roadmap

-   [x] Estruturação do banco de dados e modelagem ER.
-   [x] Implementação da autenticação de usuários (Clínica e Profissional).
-   [x] CRUD completo para Pacientes, Responsáveis e Funcionários.
-   [x] Implementação da Agenda com visualização e agendamento de consultas.
-   [ ] Implementação da área Médica, onde será feito todo o atendimento.
-   [ ] Criação do módulo interativo "Mundo das Emoções".
-   [ ] Desenvolvimento do Módulo "Connect" para currículos.

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Se você tem alguma sugestão para melhorar o projeto, por favor, faça um fork do repositório e crie um pull request.

1.  Faça um **Fork** do projeto.
2.  Crie uma nova Branch (`git checkout -b feature/sua-feature`).
3.  Faça o **Commit** de suas alterações (`git commit -m 'Adiciona sua-feature'`).
4.  Faça o **Push** para a Branch (`git push origin feature/sua-feature`).
5.  Abra um **Pull Request**.

## 🧑‍💻 Autores

| [<img src="https://github.com/nathaliakoetz.png" width="100px;" alt="Nathalia Koetz"/><br /><sub><b>Nathalia Koetz</b></sub>](https://github.com/nathaliakoetz) | [<img src="https://github.com/gwacosta.png" width="100px;" alt="Guilherme Acosta"/><br /><sub><b>Guilherme Acosta</b></sub>](https://github.com/gwacosta) |
| :---: | :---: |
