# GTONLINE 3.0 - Documentação da API Backend

## Índice
1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Pilha de Tecnologias](#pilha-de-tecnologias)
3. [Instalação](#instalação)
4. [Configuração](#configuração)
5. [Executando o Servidor](#executando-o-servidor)
6. [Endpoints da API](#endpoints-da-api)
7. [Autenticação](#autenticação)
8. [Esquema do Banco de Dados](#esquema-do-banco-de-dados)

---

## Visão Geral do Projeto

GTONLINE 3.0 é uma API backend completa de e-commerce construída com Node.js, Express e Sequelize ORM. Fornece operações CRUD completas para usuários, categorias e produtos com autenticação baseada em JWT.

### Recursos Implementados:
- ✓ Esquema de banco de dados com 6 tabelas
- ✓ Gerenciamento de usuários com autenticação
- ✓ Gerenciamento de catálogo de produtos
- ✓ Gerenciamento de categorias
- ✓ Geração e validação de tokens JWT
- ✓ Endpoints protegidos com controle de acesso baseado em função

---

## Pilha de Tecnologias

- **Runtime**: Node.js
- **Framework**: Express.js v5.x
- **ORM do Banco**: Sequelize v6.x
- **Autenticação**: JWT (jsonwebtoken)
- **Hash de Senha**: bcryptjs
- **Utilitários HTTP**: CORS
- **Gerenciamento de Ambiente**: dotenv

---

## Instalação

### Pré-requisitos
- Node.js (v14 ou superior)
- npm ou yarn

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Estevao750/GTONLINE3.0-PROJETO-BACK-END.git
   cd GTONLINE3.0-PROJETO-BACK-END
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Crie e configure o arquivo .env**
   ```bash
   cp .env.example .env
   ```

---

## Configuração

Edite o arquivo `.env` com suas configurações:

```env
# Configuração do Banco de Dados
DB_DIALECT=sqlite          # ou: mysql, postgres, mariadb
DB_STORAGE=database.sqlite # Caminho para SQLite
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gtonline
DB_USER=root
DB_PASSWORD=password

# Configuração JWT
JWT_SECRET=sua_chave_secreta_muito_segura_mude_em_producao
JWT_EXPIRES_IN=7d

# Configuração do Servidor
PORT=3000
NODE_ENV=development
```

---

## Executando o Servidor

### Modo de Desenvolvimento (com reinício automático)
```bash
npm run dev
```

### Modo de Produção
```bash
npm start
```

### Sincronizar Banco de Dados (DDL)
```bash
npm run db:sync
```

O servidor será iniciado em `http://localhost:3000`

---

## Endpoints da API

### Verificação de Saúde
- **GET** `/api/health`
  - Endpoint público
  - Retorna o status do servidor

### Endpoints de Autenticação

#### Login do Usuário
- **POST** `/api/users/login`
  - **Público**
  - **Corpo:**
    ```json
    {
      "email": "usuario@exemplo.com",
      "password": "senha123"
    }
    ```
  - **Resposta:** Dados do usuário + token JWT

#### Registro de Usuário
- **POST** `/api/users/register`
  - **Público**
  - **Corpo:**
    ```json
    {
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "password": "senha123",
      "phone": "123456789",
      "address": "Rua Principal, 123",
      "city": "Cidade",
      "state": "ST",
      "zip_code": "12345"
    }
    ```
  - **Resposta:** Dados do usuário + token JWT

---

### Endpoints CRUD de Usuários

#### Obter Todos os Usuários
- **GET** `/api/users`
  - **Protegido** (requer token)
  - **Parâmetros de Query:**
    - `page` (padrão: 1)
    - `limit` (padrão: 10)
    - `role` (filtro: 'user' ou 'admin')
  - **Resposta:** Lista paginada de usuários

#### Obter Usuário por ID
- **GET** `/api/users/:id`
  - **Protegido** (requer token)
  - **Resposta:** Detalhes do usuário

#### Atualizar Usuário
- **PUT** `/api/users/:id`
  - **Protegido** (requer token)
  - **Corpo:**
    ```json
    {
      "name": "Nome Atualizado",
      "phone": "987654321",
      "address": "Novo Endereço",
      "city": "Nova Cidade",
      "state": "ST",
      "zip_code": "54321"
    }
    ```
  - **Nota:** Usuários podem atualizar apenas seu próprio perfil (admin pode atualizar qualquer um)
  - **Resposta:** Dados do usuário atualizado

#### Deletar Usuário
- **DELETE** `/api/users/:id`
  - **Protegido** (requer token)
  - **Nota:** Usuários podem deletar apenas seu próprio perfil (admin pode deletar qualquer um)
  - **Resposta:** Mensagem de confirmação

---

### Endpoints CRUD de Categorias

#### Obter Todas as Categorias
- **GET** `/api/categories`
  - **Público**
  - **Parâmetros de Query:**
    - `page` (padrão: 1)
    - `limit` (padrão: 10)
    - `isActive` (padrão: true)
  - **Resposta:** Lista paginada de categorias

#### Obter Categoria por ID
- **GET** `/api/categories/:id`
  - **Público**
  - **Resposta:** Detalhes da categoria com produtos associados

#### Criar Categoria
- **POST** `/api/categories`
  - **Protegido** (Apenas admin)
  - **Corpo:**
    ```json
    {
      "name": "Eletrônicos",
      "description": "Produtos eletrônicos",
      "image_url": "https://exemplo.com/imagem.jpg"
    }
    ```
  - **Resposta:** Dados da categoria criada

#### Atualizar Categoria
- **PUT** `/api/categories/:id`
  - **Protegido** (Apenas admin)
  - **Corpo:**
    ```json
    {
      "name": "Eletrônicos Atualizados",
      "description": "Descrição atualizada",
      "image_url": "https://exemplo.com/nova-imagem.jpg",
      "is_active": true
    }
    ```
  - **Resposta:** Dados da categoria atualizada

#### Deletar Categoria
- **DELETE** `/api/categories/:id`
  - **Protegido** (Apenas admin)
  - **Resposta:** Mensagem de confirmação

---

### Endpoints CRUD de Produtos

#### Obter Todos os Produtos
- **GET** `/api/products`
  - **Público**
  - **Parâmetros de Query:**
    - `page` (padrão: 1)
    - `limit` (padrão: 10)
    - `isActive` (padrão: true)
    - `categoryId` (filtro por categoria)
    - `minPrice` (filtro de preço mínimo)
    - `maxPrice` (filtro de preço máximo)
    - `sortBy` (nome do campo, padrão: 'name')
    - `sortOrder` (ASC ou DESC)
  - **Resposta:** Lista paginada de produtos com imagens

#### Obter Produto por ID
- **GET** `/api/products/:id`
  - **Público**
  - **Resposta:** Detalhes do produto com categorias, imagens e opções

#### Criar Produto
- **POST** `/api/products`
  - **Protegido** (Apenas admin)
  - **Corpo:**
    ```json
    {
      "name": "Nome do Produto",
      "description": "Descrição do produto",
      "price": 99.99,
      "discount_price": 79.99,
      "sku": "PROD-001",
      "stock_quantity": 100,
      "weight": 1.5,
      "dimensions": "10x10x10cm",
      "category_ids": ["uuid-categoria-1", "uuid-categoria-2"]
    }
    ```
  - **Resposta:** Dados do produto criado com associações

#### Atualizar Produto
- **PUT** `/api/products/:id`
  - **Protegido** (Apenas admin)
  - **Corpo:**
    ```json
    {
      "name": "Produto Atualizado",
      "price": 89.99,
      "stock_quantity": 50,
      "is_active": true,
      "category_ids": ["uuid-categoria-1"]
    }
    ```
  - **Resposta:** Dados do produto atualizado

#### Deletar Produto
- **DELETE** `/api/products/:id`
  - **Protegido** (Apenas admin)
  - **Resposta:** Mensagem de confirmação

---

## Autenticação

### Estrutura do Token JWT

Requisições para endpoints protegidos devem incluir o token JWT no header Authorization:

```
Authorization: Bearer <jwt_token>
```

### Payload do Token
```json
{
  "id": "uuid-usuario",
  "role": "user",
  "iat": 1234567890,
  "exp": 1235000000
}
```

### Controle de Acesso Baseado em Função

- **Endpoints públicos**: Nenhuma autenticação necessária
- **Endpoints protegidos**: Token JWT válido necessário
- **Endpoints apenas para admin**: Token JWT com `role: 'admin'` necessário

---

## Esquema do Banco de Dados

### Tabela de Usuários
```
- id (UUID, PK)
- name (String)
- email (String, Único)
- password (String, Criptografado)
- phone (String)
- address (Text)
- city (String)
- state (String)
- zip_code (String)
- role (Enum: 'user', 'admin')
- is_active (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Tabela de Categorias
```
- id (UUID, PK)
- name (String, Único)
- description (Text)
- slug (String, Único)
- image_url (String)
- is_active (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Tabela de Produtos
```
- id (UUID, PK)
- name (String)
- description (Text)
- price (Decimal)
- discount_price (Decimal)
- sku (String, Único)
- stock_quantity (Integer)
- weight (Decimal)
- dimensions (String)
- is_active (Boolean)
- rating (Float, 0-5)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Tabela de Imagens de Produtos
```
- id (UUID, PK)
- product_id (UUID, FK)
- image_url (String)
- alt_text (String)
- display_order (Integer)
- is_primary (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Tabela de Opções de Produtos
```
- id (UUID, PK)
- product_id (UUID, FK)
- option_name (String)
- option_value (String)
- additional_price (Decimal)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Tabela de Categorias de Produtos (Junction)
```
- id (UUID, PK)
- product_id (UUID, FK)
- category_id (UUID, FK)
- created_at (Timestamp)
- updated_at (Timestamp)
```

---

## Exemplos de Requisições

### Registrar Usuário
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'
```

### Login de Usuário
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'
```

### Criar Categoria (Admin)
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Eletrônicos",
    "description": "Produtos eletrônicos"
  }'
```

### Obter Produtos
```bash
curl "http://localhost:3000/api/products?page=1&limit=10&minPrice=10&maxPrice=100"
```

---

## Tratamento de Erros

Todas as respostas de erro seguem este formato:
```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Erro detalhado (apenas em desenvolvimento)"
}
```

### Códigos de Status
- `200`: Sucesso
- `201`: Criado
- `400`: Requisição Inválida
- `401`: Não Autorizado
- `403`: Proibido
- `404`: Não Encontrado
- `409`: Conflito
- `500`: Erro do Servidor

---

## Estrutura do Projeto

```
src/
├── app.js                          # Configuração da app Express
├── server.js                       # Ponto de entrada do servidor
├── config/
│   └── database.js                # Configuração Sequelize
├── database/
│   └── index.js                   # Inicialização do banco
├── models/
│   ├── User.js
│   ├── Category.js
│   ├── Product.js
│   ├── ProductImage.js
│   ├── ProductOption.js
│   └── ProductCategory.js
├── controllers/
│   ├── UserController.js
│   ├── CategoryController.js
│   └── ProductController.js
├── routes/
│   ├── userRoutes.js
│   ├── categoryRoutes.js
│   └── productRoutes.js
├── middleware/
│   └── auth.js                    # Middleware de autenticação JWT
└── utils/
    └── jwt.js                     # Utilitários JWT
```

---

## Notas de Desenvolvimento

- Senhas são automaticamente criptografadas usando bcryptjs antes do armazenamento
- Todas as respostas usam um formato consistente de sucesso/erro
- Modelos de banco de dados usam timestamps automaticamente
- Exclusão suave pode ser implementada adicionando timestamp `deleted_at`
- Considere adicionar rate limiting para produção


