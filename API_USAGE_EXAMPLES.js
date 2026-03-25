/**
 * Exemplos de Uso da API
 * Este arquivo contém comandos curl e exemplos de requisições para testar a API GTONLINE 3.0
 */

/**
 * ==========================================
 * ENDPOINTS DE AUTENTICAÇÃO
 * ==========================================
 */

// 1. REGISTRAR USUÁRIO
// curl -X POST http://localhost:3000/api/users/register \
//   -H "Content-Type: application/json" \
//   -d '{
//     "name": "João Silva",
//     "email": "joao@exemplo.com",
//     "password": "senha123",
//     "phone": "(11) 99999-9999",
//     "address": "Rua das Flores, 123",
//     "city": "São Paulo",
//     "state": "SP",
//     "zip_code": "01234-567"
//   }'

// Resposta Esperada:
// {
//   "success": true,
//   "message": "User created successfully",
//   "data": {
//     "id": "uuid-string",
//     "name": "João Silva",
//     "email": "joao@exemplo.com",
//     "phone": "(11) 99999-9999",
//     "address": "Rua das Flores, 123",
//     "city": "São Paulo",
//     "state": "SP",
//     "zip_code": "01234-567",
//     "role": "user",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
//   }
// }

// 2. LOGIN DE USUÁRIO
// curl -X POST http://localhost:3000/api/users/login \
//   -H "Content-Type: application/json" \
//   -d '{
//     "email": "joao@exemplo.com",
//     "password": "senha123"
//   }'

/**
 * ==========================================
 * ENDPOINTS CRUD DE USUÁRIOS
 * ==========================================
 */

// 3. OBTER TODOS OS USUÁRIOS (Protegido)
// curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
//   -H "Authorization: Bearer SEU_TOKEN_JWT"

// 4. OBTER USUÁRIO POR ID (Protegido)
// curl -X GET http://localhost:3000/api/users/UUID_DO_USUARIO \
//   -H "Authorization: Bearer SEU_TOKEN_JWT"

// 5. ATUALIZAR USUÁRIO (Protegido)
// curl -X PUT http://localhost:3000/api/users/UUID_DO_USUARIO \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer SEU_TOKEN_JWT" \
//   -d '{
//     "name": "João Silva Atualizado",
//     "phone": "(11) 98888-8888",
//     "address": "Nova Rua, 456"
//   }'

// 6. DELETAR USUÁRIO (Protegido)
// curl -X DELETE http://localhost:3000/api/users/UUID_DO_USUARIO \
//   -H "Authorization: Bearer SEU_TOKEN_JWT"

/**
 * ==========================================
 * ENDPOINTS CRUD DE CATEGORIAS
 * ==========================================
 */

// 7. OBTER TODAS AS CATEGORIAS (Público)
// curl -X GET "http://localhost:3000/api/categories?page=1&limit=10"

// 8. OBTER CATEGORIA POR ID (Público)
// curl -X GET http://localhost:3000/api/categories/UUID_DA_CATEGORIA

// 9. CRIAR CATEGORIA (Apenas Admin)
// curl -X POST http://localhost:3000/api/categories \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer TOKEN_ADMIN" \
//   -d '{
//     "name": "Eletrônicos",
//     "description": "Produtos eletrônicos em geral",
//     "image_url": "https://exemplo.com/eletronicos.jpg"
//   }'

// 10. ATUALIZAR CATEGORIA (Apenas Admin)
// curl -X PUT http://localhost:3000/api/categories/UUID_DA_CATEGORIA \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer TOKEN_ADMIN" \
//   -d '{
//     "name": "Eletrônicos Premium",
//     "description": "Produtos eletrônicos de alta qualidade",
//     "is_active": true
//   }'

// 11. DELETAR CATEGORIA (Apenas Admin)
// curl -X DELETE http://localhost:3000/api/categories/UUID_DA_CATEGORIA \
//   -H "Authorization: Bearer TOKEN_ADMIN"

/**
 * ==========================================
 * ENDPOINTS CRUD DE PRODUTOS
 * ==========================================
 */

// 12. OBTER TODOS OS PRODUTOS (Público)
// curl -X GET "http://localhost:3000/api/products?page=1&limit=10&minPrice=100&maxPrice=1000&sortBy=price&sortOrder=ASC"

// 13. OBTER PRODUTO POR ID (Público)
// curl -X GET http://localhost:3000/api/products/UUID_DO_PRODUTO

// 14. CRIAR PRODUTO (Apenas Admin)
// curl -X POST http://localhost:3000/api/products \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer TOKEN_ADMIN" \
//   -d '{
//     "name": "Smartphone XYZ",
//     "description": "Smartphone de última geração com câmera 108MP",
//     "price": 2999.99,
//     "discount_price": 2499.99,
//     "sku": "SMARTXYZ001",
//     "stock_quantity": 50,
//     "weight": 0.2,
//     "dimensions": "15x7x0.8cm",
//     "category_ids": ["UUID_CATEGORIA_1", "UUID_CATEGORIA_2"]
//   }'

// 15. ATUALIZAR PRODUTO (Apenas Admin)
// curl -X PUT http://localhost:3000/api/products/UUID_DO_PRODUTO \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer TOKEN_ADMIN" \
//   -d '{
//     "name": "Smartphone XYZ Pro",
//     "price": 3299.99,
//     "stock_quantity": 30,
//     "is_active": true
//   }'

// 16. DELETAR PRODUTO (Apenas Admin)
// curl -X DELETE http://localhost:3000/api/products/UUID_DO_PRODUTO \
//   -H "Authorization: Bearer TOKEN_ADMIN"

/**
 * ==========================================
 * VERIFICAÇÃO DE SAÚDE
 * ==========================================
 */

// 17. VERIFICAÇÃO DE SAÚDE (Público)
// curl -X GET http://localhost:3000/api/health

// Resposta Esperada:
// {
//   "success": true,
//   "message": "Server is running",
//   "timestamp": "2024-03-24T10:30:00.000Z"
// }

/**
 * ==========================================
 * EXEMPLOS EM NODEJS/JAVASCRIPT
 * ==========================================
 */

/**
 * Exemplo: Registrar Usuário
 * 
const axios = require('axios');

async function registrarUsuario() {
  try {
    const response = await axios.post('http://localhost:3000/api/users/register', {
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      phone: '(11) 98888-8888'
    });
    console.log('Usuário registrado:', response.data);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
}
 */

/**
 * Exemplo: Login de Usuário
 * 
const axios = require('axios');

async function fazerLogin() {
  try {
    const response = await axios.post('http://localhost:3000/api/users/login', {
      email: 'maria@exemplo.com',
      password: 'senha123'
    });
    const token = response.data.data.token;
    console.log('Login realizado com sucesso. Token:', token);
    return token;
  } catch (error) {
    console.error('Erro de login:', error.response.data);
  }
}
 */

/**
 * Exemplo: Obter Todos os Produtos
 * 
const axios = require('axios');

async function obterProdutos() {
  try {
    const response = await axios.get('http://localhost:3000/api/products', {
      params: {
        page: 1,
        limit: 10,
        minPrice: 100,
        maxPrice: 2000
      }
    });
    console.log('Produtos:', response.data.data);
    console.log('Paginação:', response.data.pagination);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
}
 */

/**
 * Exemplo: Criar Produto (com autenticação)
 * 
const axios = require('axios');

async function criarProduto(token) {
  try {
    const response = await axios.post('http://localhost:3000/api/products', {
      name: 'Laptop Dell',
      description: 'Laptop de alto desempenho',
      price: 3999.99,
      discount_price: 3499.99,
      sku: 'LAPTOP001',
      stock_quantity: 20,
      weight: 2.5,
      dimensions: '35x25x2cm',
      category_ids: ['UUID_CATEGORIA']
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Produto criado:', response.data.data);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
}
 */

module.exports = {};
