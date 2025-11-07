# Configuração de Autenticação e Usuário Admin

## 📋 Pré-requisitos

1. Banco de dados PostgreSQL configurado e rodando
2. Arquivo `.env` na raiz do projeto com `DATABASE_URL`

## 🔧 Configuração Inicial

### 1. Criar arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"

# JWT Secret
JWT_SECRET="seu-secret-jwt-aqui"

# Server Port
PORT=4000

# API URL (para o frontend)
VITE_API_URL="http://localhost:4000/api"
```

**Exemplo:**
```env
DATABASE_URL="postgresql://postgres:minhasenha@localhost:5432/auraia_hub"
JWT_SECRET="meu-secret-super-seguro"
PORT=4000
VITE_API_URL="http://localhost:4000/api"
```

### 2. Executar migrações do Prisma

```bash
npm run prisma:migrate
```

### 3. Criar usuário admin

```bash
npm run create-admin
```

Isso criará um usuário admin com as seguintes credenciais:
- **Email:** `admin@admin.com`
- **Senha:** `admin123`

## 🚀 Iniciar o Sistema

### 1. Iniciar o servidor backend

```bash
npm run server:dev
```

O servidor deve iniciar na porta 4000 e mostrar:
```
[server] listening on http://localhost:4000
```

### 2. Iniciar o frontend

Em outro terminal:

```bash
npm run dev
```

O frontend deve iniciar e abrir automaticamente no navegador.

## 🔐 Fazer Login

1. Acesse a página de login
2. Use as credenciais do admin:
   - Email: `admin@admin.com`
   - Senha: `admin123`

## 🐛 Solução de Problemas

### Erro: "DATABASE_URL não configurado"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Verifique se a `DATABASE_URL` está correta

### Erro: "Não foi possível conectar ao banco de dados"
- Verifique se o PostgreSQL está rodando
- Verifique se as credenciais estão corretas
- Verifique se o banco de dados existe

### Erro: "Failed to fetch" no frontend
- Verifique se o servidor backend está rodando na porta 4000
- Verifique se a URL da API está correta no `.env`

### Erro: "Credenciais inválidas"
- Verifique se o usuário admin foi criado: `npm run create-admin`
- Verifique se está usando as credenciais corretas

## 📝 Logs de Debug

O sistema agora possui logs detalhados:

- **Backend:** Logs no console do servidor com prefixo `[Login]` e `[Signup]`
- **Frontend:** Logs no console do navegador com prefixo `[API]` e `[Auth]`

Abra o DevTools (F12) para ver os logs do frontend.

## ✅ Funcionalidades Implementadas

- ✅ Login de profissionais
- ✅ Criação de conta (signup)
- ✅ Autenticação via JWT
- ✅ Armazenamento de sessão
- ✅ Validação de campos
- ✅ Mensagens de erro específicas
- ✅ Script para criar usuário admin
- ✅ Logs de debug


