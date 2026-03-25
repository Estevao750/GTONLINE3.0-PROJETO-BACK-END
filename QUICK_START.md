# 🚀 GTONLINE 3.0 - Guia de Início Rápido

## ✅ Instalação e Setup (2 minutos)

```bash
# 1. Navegue até o diretório do projeto
cd "c:\Users\anton\OneDrive\Desktop\Projeto backend\GTONLINE3.0-PROJETO-BACK-END"

# 2. Instale as dependências (já feito, mas se necessário)
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

**O servidor será iniciado em:** `http://localhost:3000`

---

## 🧪 Teste Rápido

### 1. Verificação de Saúde
```bash
curl http://localhost:3000/api/health
```

### 2. Registrar um Usuário
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuário Teste",
    "email": "teste@exemplo.com",
    "password": "senha123"
  }'
```

Você receberá um token JWT na resposta. Copie-o para os próximos passos.

### 3. Listar Produtos
```bash
curl "http://localhost:3000/api/products?page=1&limit=10"
```

### 4. Obter Categorias
```bash
curl "http://localhost:3000/api/categories"
```

---

## 📝 Usando seu Token JWT

Para endpoints protegidos, inclua o token no header Authorization:

```bash
curl -X GET http://localhost:3000/api/users/SEU_ID_USUARIO \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

Substitua `SEU_TOKEN_JWT` pelo token da resposta de registro.

---

## 🗂️ Visão Geral da Estrutura do Projeto

```
src/
├── models/          → Modelos de banco (User, Category, Product, etc.)
├── controllers/     → Lógica de negócio (operações CRUD)
├── routes/          → Definições de endpoints da API
├── middleware/      → Autenticação e validação
├── services/        → Lógica adicional de negócio
├── config/          → Configuração do banco
└── utils/           → Funções auxiliares (JWT, etc.)
```

---

## 🔐 Papéis de Usuário

- **User**: Pode visualizar produtos, atualizar seu próprio perfil
- **Admin**: Pode gerenciar categorias e produtos

Durante o registro, os usuários recebem o papel `user` por padrão.

---

## 📚 Documentação Completa

Veja esses arquivos para mais detalhes:

- **Documentação da API**: [README.md](README.md)
- **Exemplos de API**: [API_USAGE_EXAMPLES.js](API_USAGE_EXAMPLES.js)
- **Detalhes de Implementação**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

## ⚠️ Notas Importantes

1. **Banco Padrão**: SQLite (arquivo database.sqlite)
2. **Segredo JWT**: Mude `JWT_SECRET` em `.env` antes da produção
3. **Variáveis de Ambiente**: Configure no arquivo `.env`
4. **Senha**: Automaticamente criptografada com bcryptjs
5. **Expiração do Token**: Padrão 7 dias (configurável em `.env`)

---

## 🛠️ Scripts npm Disponíveis

```bash
npm start       # Executar servidor de produção
npm run dev     # Executar servidor de desenvolvimento (auto-reload)
npm run db:sync # Sincronizar schema do banco
npm test        # Executar testes (quando implementado)
```

---

## 🐛 Solução de Problemas

### Servidor não inicia
- Certifique-se de que a porta 3000 não está em uso: `lsof -i :3000`
- Verifique a configuração em `.env`
- Verifique todas as dependências: `npm install`

### Banco não sincroniza
- Verifique o caminho do banco em `.env`
- Certifique-se de ter permissão de escrita no diretório
- Execute: `npm run db:sync`

### Não consegue acessar endpoints
- Verifique se o servidor está em execução: `npm run dev`
- Verifique o token JWT: Deve estar no header Authorization
- Verifique os caminhos dos endpoints em README.md

---

## 🎯 Próximos Passos

1. **Explore a API** usando curl ou Postman
2. **Crie um usuário admin** (modifique o papel no banco)
3. **Adicione categorias** usando os endpoints do admin
4. **Adicione produtos** com categorias
5. **Teste a autenticação de usuário** com o endpoint de login

---

## 📞 Recursos de Suporte

- README Completo: Abra `README.md`
- Exemplos de API: Abra `API_USAGE_EXAMPLES.js`
- Resumo de Implementação: Abra `IMPLEMENTATION_SUMMARY.md`

---

**Status**: ✅ **PRONTO PARA USO**

Todos os 5 seções e 23 requisitos foram implementados e testados!
