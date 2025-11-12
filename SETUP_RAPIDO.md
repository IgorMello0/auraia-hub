# 🚀 Setup Rápido - Sistema de Permissões

## Passos para Iniciar

### 1. Aplicar Schema no Banco
```bash
npx prisma db push
```
Pressione Enter quando perguntar. Isso vai criar as tabelas necessárias.

### 2. Gerar Prisma Client
```bash
npx prisma generate
```

### 3. Popular os Módulos
```bash
npm run seed:modules
```

### 4. Tornar seu usuário Admin

**Se você é um PROFISSIONAL:**

Os profissionais têm acesso total por padrão. Para ter acesso de administrador completo, execute via SQL:

```sql
-- Conecte no seu banco e execute:
SELECT id, name, email FROM professionals;

-- Anote o ID do seu profissional e crie permissões totais (opcional)
-- Por padrão, profissionais já têm acesso a tudo
```

**Se você quer criar um USUÁRIO Admin:**

```sql
-- 1. Veja sua empresa
SELECT id, name FROM empresas;

-- 2. Crie um usuário admin
INSERT INTO usuarios (company_id, name, email, password_hash, role, is_active, created_at, updated_at)
VALUES (
  1,  -- ID da sua empresa
  'Administrador',
  'admin@empresa.com',
  '$2a$10$YourBcryptHashHere',  -- Use bcrypt para gerar
  'admin',
  true,
  NOW(),
  NOW()
);
```

**OU se você já tem um usuário e quer torná-lo admin:**

```sql
-- Ver usuários
SELECT id, name, email, role FROM usuarios;

-- Tornar admin
UPDATE usuarios SET role = 'admin' WHERE email = 'seu-email@empresa.com';
```

### 5. Gerar Hash de Senha (se precisar criar usuário)

Execute no Node:

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('sua-senha', 10);
console.log(hash);
```

Ou use o script:

```bash
node -e "console.log(require('bcryptjs').hashSync('sua-senha', 10))"
```

### 6. Reiniciar Servidor
```bash
npm run server:dev
npm run dev
```

## ✅ Verificar se Funcionou

1. Faça login com suas credenciais
2. Vá para a página **Administração**
3. Você deve ver as abas: **Overview, Usuários, Profissionais, Categorias, Modelos de Fichas**
4. Na aba **Profissionais**, clique em um profissional e vá na aba **Módulos de Acesso**
5. Na aba **Usuários**, clique no ícone 🔑 para gerenciar permissões

## 🔍 Debug

Se o menu não aparecer:
1. Abra o Console do navegador (F12)
2. Vá para Network → XHR
3. Faça refresh
4. Procure pela chamada `/api/permissions/my-permissions`
5. Veja o que está retornando

Logs úteis:
- `[Auth] Permissions loaded:` - mostra permissões carregadas
- `[Permissions] Error:` - mostra erros de permissões

