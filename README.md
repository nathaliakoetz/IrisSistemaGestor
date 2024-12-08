![Sistema Gestor íris](https://i.postimg.cc/44QgvkZ9/Logo.png)

#

> **Projeto desenvolvido para a unidade de Gestão Ágil de Projetos, com o Prof. Pablo De Chiaro, UniSenac Pelotas/RS.**  

## **Descrição do Projeto**  
O Sistema Gestor Íris é uma aplicação web criada para auxiliar no acompanhamento e gerenciamento de informações de crianças autistas não-verbais em clínicas especializadas. O objetivo é simplificar processos administrativos, oferecer ferramentas interativas para agendamento e consultas, e melhorar a comunicação entre cuidadores e profissionais.

## **Funcionalidades**  
- **Cadastro de usuários:** Permite o registro de profissionais e cuidadores.  
- **Login seguro:** Acesso restrito para proteger os dados sensíveis.  
- **Agendamento de consultas:** Interface intuitiva para criar e gerenciar consultas.  
- **Agenda interativa:** Ferramenta visual para acompanhar compromissos em tempo real.  

---

## **Tecnologias Utilizadas**  
As principais tecnologias empregadas no desenvolvimento do Sistema Gestor Íris incluem:  
- **[Next.js](https://nextjs.org/):** Framework React para renderização e rotas.  
- **[React](https://reactjs.org/):** Biblioteca para construção de interfaces dinâmicas.  
- **[PostgreSQL](https://www.postgresql.org/):** Banco de dados relacional para armazenamento eficiente.  
- **[Tailwind CSS](https://tailwindcss.com/):** Framework de estilização CSS utilitário.  

## **Metodologias e Ferramentas Ágeis**  
O desenvolvimento foi guiado por práticas ágeis:  
- **Scrum e Kanban:** Planejamento e organização de tarefas no **[Miro](https://miro.com/)**.  
- **Prototipagem:** Design inicial das telas no **[Figma](https://figma.com/)**.  

---

## **Como Executar o Projeto**  

### **Pré-requisitos**  
Certifique-se de ter as seguintes ferramentas instaladas:  
- [Node.js](https://nodejs.org/) (versão 16 ou superior)  
- [PostgreSQL](https://www.postgresql.org/)  

### **Passo a Passo**  
1. Clone o repositório:  
   ```bash
   git clone https://github.com/usuario/sistema-gestor-iris.git
   cd sistema-gestor-iris
   ```  
2. Instale as dependências:  
   ```bash
   npm install
   ```  
3. Configure o banco de dados:  
   - Crie um banco de dados no PostgreSQL.  
   - Atualize o arquivo `.env` com as credenciais do banco (exemplo incluído no repositório).  

4. Inicie o servidor de desenvolvimento:  
   ```bash
   npm run dev
   ```  
5. Acesse a aplicação no navegador em: `http://localhost:3000`.  

---

## **Estrutura do Projeto**  
```plaintext
📂 sistema-gestor-iris
├── 📁 components        # Componentes reutilizáveis do front-end
├── 📁 pages             # Páginas e rotas do Next.js
├── 📁 public            # Arquivos estáticos (imagens, ícones, etc.)
├── 📁 styles            # Arquivos de estilização (Tailwind CSS)
├── 📁 utils             # Funções e utilitários auxiliares
├── 📄 .env.example      # Exemplo de configuração de ambiente
└── 📄 README.md         # Documentação do projeto
```  

---

## **Contribuição**  
Contribuições são bem-vindas! Siga os passos abaixo para contribuir:  
1. Faça um fork do projeto.  
2. Crie uma nova branch com sua funcionalidade:  
   ```bash
   git checkout -b minha-feature
   ```  
3. Faça suas alterações e commit:  
   ```bash
   git commit -m "Minha nova funcionalidade"
   ```  
4. Envie para o repositório principal:  
   ```bash
   git push origin minha-feature
   ```  

---

## **Autores**  
- **Nathalia Koetz**  
- **Guilherme Acosta**  

---

## **Licença**  
Este projeto está licenciado sob a [MIT License](LICENSE).  
