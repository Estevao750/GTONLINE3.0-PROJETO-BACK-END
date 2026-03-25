# 🔌 Guia Rápido de Endpoints - GTONLINE 3.0

---

## 📌 Autenticação

### Registrar Usuário
```
POST /api/users/register
Tipo: Público
Status: 201 (criado)
Corpo:
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "phone": "(11) 99999-9999",
  "address": "Rua Principal, 123",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234-567"
}
```

### Login
```
POST /api/users/login
Tipo: Público
Status: 200 (OK)
Corpo:
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
Retorna: Token JWT
```

---

## 👤 Usuários

### Obter Todos
```
GET /api/users?page=1&limit=10&role=user
Tipo: Protegido (precisa token)
Status: 200
Header: Authorization: Bearer <token>
```

### Obter Um Usuário
```
GET /api/users/{id}
Tipo: Protegido
Status: 200
Header: Authorization: Bearer <token>
```

### Atualizar Usuário
```
PUT /api/users/{id}
Tipo: Protegido
Status: 200
Header: Authorization: Bearer <token>
Corpo:
{
  "name": "Novo Nome",
  "phone": "(11) 98888-8888",
  "address": "Novo Endereço",
  "city": "Rio de Janeiro",
  "state": "RJ",
  "zip_code": "20000-000"
}
```

### Deletar Usuário
```
DELETE /api/users/{id}
Tipo: Protegido
Status: 200
Header: Authorization: Bearer <token>
```

---

## 🏷️ Categorias

### Listar Categorias
```
GET /api/categories?page=1&limit=10&isActive=true
Tipo: Público
Status: 200
```

### Obter Uma Categoria
```
GET /api/categories/{id}
Tipo: Público
Status: 200
```

### Criar Categoria
```
POST /api/categories
Tipo: Admin Only
Status: 201
Header: Authorization: Bearer <token>
Corpo:
{
  "name": "Eletrônicos",
  "description": "Produtos eletrônicos em geral",
  "image_url": "https://exemplo.com/imagem.jpg"
}
```

### Atualizar Categoria
```
PUT /api/categories/{id}
Tipo: Admin Only
Status: 200
Header: Authorization: Bearer <token>
Corpo:
{
  "name": "Eletrônicos Premium",
  "description": "Eletrônicos de alta qualidade",
  "image_url": "https://exemplo.com/nova-imagem.jpg",
  "is_active": true
}
```

### Deletar Categoria
```
DELETE /api/categories/{id}
Tipo: Admin Only
Status: 200
Header: Authorization: Bearer <token>
```

---

## 📦 Produtos

### Listar Produtos
```
GET /api/products?page=1&limit=10&minPrice=100&maxPrice=1000&categoryId={id}&sortBy=price&sortOrder=ASC
Tipo: Público
Status: 200
Parâmetros opcionais:
  - page: Número da página (padrão: 1)
  - limit: Produtos por página (padrão: 10)
  - minPrice: Preço mínimo
  - maxPrice: Preço máximo
  - categoryId: ID da categoria
  - sortBy: Campo para ordenar (name, price, rating, etc)
  - sortOrder: ASC (crescente) ou DESC (decrescente)
```

### Obter Um Produto
```
GET /api/products/{id}
Tipo: Público
Status: 200
Retorna: Produto com categorias, imagens e opções
```

### Criar Produto
```
POST /api/products
Tipo: Admin Only
Status: 201
Header: Authorization: Bearer <token>
Corpo:
{
  "name": "Smartphone XYZ",
  "description": "Smartphone última geração",
  "price": 2999.99,
  "discount_price": 2499.99,
  "sku": "SMARTXYZ001",
  "stock_quantity": 50,
  "weight": 0.2,
  "dimensions": "15x7x0.8cm",
  "category_ids": ["uuid-categoria-1", "uuid-categoria-2"]
}
```

### Atualizar Produto
```
PUT /api/products/{id}
Tipo: Admin Only
Status: 200
Header: Authorization: Bearer <token>
Corpo:
{
  "name": "Smartphone XYZ Pro",
  "price": 3299.99,
  "discount_price": 2899.99,
  "stock_quantity": 30,
  "is_active": true,
  "category_ids": ["uuid-categoria-1"]
}
```

### Deletar Produto
```
DELETE /api/products/{id}
Tipo: Admin Only
Status: 200
Header: Authorization: Bearer <token>
```

---

## ❤️ Health Check

### Verificar Status
```
GET /api/health
Tipo: Público
Status: 200
Retorna: Status do servidor e timestamp
```

---

## 📊 Códigos de Resposta

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Criado - Recurso criado com sucesso |
| 400 | Requisição inválida - Verifique o corpo |
| 401 | Não autorizado - Token ausente ou inválido |
| 403 | Proibido - Sem permissão (não é admin) |
| 404 | Não encontrado - Recurso não existe |
| 409 | Conflito - Email/SKU já existe |
| 500 | Erro do servidor - Tente novamente |

---

## 🔐 Headers Obrigatórios

### Para endpoints protegidos:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Para POST/PUT:
```
Content-Type: application/json
```

---

## 📝 Formato de Resposta

### Sucesso:
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... },
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### Erro:
```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Detalhes técnicos (apenas em desenvolvimento)"
}
```

---

## 🎯 Fluxo Típico

1. **Registre um usuário** → `POST /api/users/register`
2. **Receba o token** → Guarde-o
3. **Obtenha as categorias** → `GET /api/categories`
4. **Veja os produtos** → `GET /api/products`
5. **Como admin, crie produtos** → `POST /api/products`
6. **Atualize seu perfil** → `PUT /api/users/{id}`

---

## 💡 Dicas

- Sempre use `Authorization: Bearer {token}` para endpoints protegidos
- Tokens JWT expiram em 7 dias por padrão
- Passwords são criptografados automaticamente
- Use query parameters para filtrar e paginar
- Verifique o status HTTP retornado

---

## 🔄 Conversão de IDs

Todos os IDs são **UUIDs** (não números):
- Exemplo: `550e8400-e29b-41d4-a716-446655440000`
- Copie do response anterior para usar em requisições subsequentes

