# CRM FacilitaAI - Backend API

Backend completo para o sistema CRM FacilitaAI desenvolvido com Node.js, Express e MongoDB.

## 🚀 Tecnologias

- **Node.js** + **Express** - Framework web
- **MongoDB** + **Mongoose** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Stripe** - Integração de pagamentos (preparado)

## 📋 Pré-requisitos

- Node.js >= 18.x
- MongoDB >= 6.x
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` com suas configurações:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/crm_facilitaai
JWT_SECRET=seu_secret_super_seguro
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

## 🏃 Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## 📚 Estrutura do Projeto

```
backend/
├── config/           # Configurações (database)
├── controllers/      # Lógica de negócio
├── middleware/       # Middlewares (auth, error handling)
├── models/           # Models do Mongoose
├── routes/           # Rotas da API
├── utils/            # Utilitários
├── .env.example      # Exemplo de variáveis de ambiente
├── server.js         # Arquivo principal
└── package.json
```

## 🔐 Sistema de Autenticação

### Roles disponíveis:
- **admin**: Acesso total ao sistema
- **user**: Criar e editar próprios registros
- **viewer**: Apenas visualização

### Endpoints de autenticação:
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado
- `PUT /api/auth/me` - Atualizar perfil
- `PUT /api/auth/password` - Alterar senha

## 📡 Endpoints da API

### Usuários (Admin apenas)
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/:id` - Buscar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário
- `PATCH /api/users/:id/role` - Alterar role

### Clientes
- `GET /api/clientes` - Listar clientes (com filtros)
- `GET /api/clientes/ativos` - Listar apenas ativos
- `POST /api/clientes` - Criar cliente
- `GET /api/clientes/:id` - Buscar cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Deletar cliente (Admin)

### Tarefas
- `GET /api/tarefas` - Listar tarefas (com filtros)
- `GET /api/tarefas/cliente/:clienteId` - Tarefas de um cliente
- `POST /api/tarefas` - Criar tarefa
- `GET /api/tarefas/:id` - Buscar tarefa
- `PUT /api/tarefas/:id` - Atualizar tarefa
- `PATCH /api/tarefas/:id/status` - Atualizar status
- `DELETE /api/tarefas/:id` - Deletar tarefa

### Stripe (Preparado para implementação futura)
- `POST /api/stripe/create-customer` - Criar cliente no Stripe
- `POST /api/stripe/create-payment-intent` - Criar payment intent
- `POST /api/stripe/webhook` - Webhook do Stripe
- `GET /api/stripe/customer/:clienteId` - Dados Stripe do cliente
- `GET /api/stripe/transactions/:clienteId` - Transações do cliente

## 🔒 Autenticação

Todas as rotas (exceto `/api/auth/login` e `/api/auth/register`) requerem autenticação via JWT.

Envie o token no header:
```
Authorization: Bearer seu_token_jwt
```

## 🌐 Health Check

```bash
GET /health
```

Retorna o status da API.

## 📝 Modelos de Dados

### User
- nome, email, senha (hash), role, avatar, ativo, ultimoLogin

### Cliente
- nome, email, telefone, empresa, cnpj/cpf, tipo (PF/PJ), status, endereço

### Tarefa
- clienteId, titulo, descricao, status, prioridade, dataVencimento, responsavel, tags

### StripeCustomer (preparado)
- clienteId, stripeCustomerId, stripePaymentMethods

### Transaction (preparado)
- clienteId, stripePaymentIntentId, amount, currency, status

## 🚀 Deploy

Ver documentação de deploy no arquivo principal do projeto.

## 📄 Licença

MIT - Rodrigo Bezerra
