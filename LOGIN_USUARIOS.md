# 🔓 Login de Usuários - Implementado

## ✅ O que foi feito

Agora o sistema suporta login tanto para **Profissionais** quanto para **Usuários** (tabela `usuarios`).

### Alterações Realizadas:

1. **Backend (`server/routes/usuarios.ts`):**
   - Login de usuário agora retorna dados completos (nome, email, role, empresa)
   - Token JWT inclui tipo 'usuario'

2. **Frontend (`src/contexts/AuthContext.tsx`):**
   - Tenta login como profissional primeiro
   - Se falhar, tenta login como usuário
   - Salva tipo de usuário no localStorage (`userType`)

3. **Interface (`src/pages/Login.tsx`):**
   - Texto atualizado para "Entrar no Sistema"
   - Mensagem de sucesso indica tipo de usuário logado

4. **Menu (`src/components/AppSidebar.tsx`):**
   - Mostra label correto baseado no tipo
   - Filtra módulos baseado em permissões

## 🎯 Como Funciona

### Fluxo de Login:

1. Usuário digita email e senha
2. Sistema tenta login como **Profissional**
   - ✅ Sucesso → Loga como profissional
   - ❌ Falha → Tenta próximo passo
3. Sistema tenta login como **Usuário**
   - ✅ Sucesso → Loga como usuário
   - ❌ Falha → Mostra erro "Credenciais inválidas"

### Diferenças entre Tipos:

| Característica | Profissional | Usuário |
|----------------|--------------|---------|
| **Tabela** | `professionals` | `usuarios` |
| **Acesso Padrão** | Todos os módulos (se não configurado) | Nenhum (precisa configurar) |
| **Gerenciar Usuários** | ✅ Sim | ❌ Não (exceto se admin) |
| **Administração** | ✅ Sim | ❌ Não (exceto se admin) |
| **Permissões** | Configuradas por Admin | Configuradas por Profissional ou Admin |

## 🧪 Como Testar

### 1. Criar Usuário no Banco (se não existe)

**Opção A - Via Prisma Studio:**
```bash
npx prisma studio
# Acesse http://localhost:5555
# Tabela 'usuarios' → Adicionar registro
```

**Opção B - Via SQL:**
```sql
-- Gerar hash de senha (use bcrypt)
-- No Node: require('bcryptjs').hashSync('senha123', 10)

INSERT INTO usuarios (company_id, name, email, password_hash, role, is_active, created_at, updated_at)
VALUES (
  1,  -- ID da sua empresa
  'Usuário Teste',
  'usuario@teste.com',
  '$2a$10$YourHashHere',  -- Hash bcrypt da senha
  'atendente',
  true,
  NOW(),
  NOW()
);
```

**Gerar Hash de Senha:**
```bash
node -e "console.log(require('bcryptjs').hashSync('senha123', 10))"
```

### 2. Configurar Permissões do Usuário

**Como Profissional ou Admin:**
1. Faça login no sistema
2. Vá para **Administração** → **Usuários**
3. Clique no ícone 🔑 (chave) ao lado do usuário
4. Ative os módulos que ele deve acessar
5. As alterações são salvas automaticamente

### 3. Testar Login como Usuário

1. Faça logout se estiver logado
2. Acesse http://localhost:8080/login
3. Digite:
   - **Email:** usuario@teste.com
   - **Senha:** senha123 (ou a que você configurou)
4. Clique em **Entrar**

**Resultado Esperado:**
- ✅ Login bem-sucedido com mensagem "(Usuário)"
- ✅ Menu lateral mostra apenas módulos com permissão
- ✅ Nome e "Usuário" ou role aparecem no sidebar
- ❌ NÃO tem acesso à página Administração (a não ser que seja admin)

### 4. Verificar Permissões

**No Console do Navegador (F12):**
```javascript
// Ver tipo de usuário
localStorage.getItem('userType')  // 'user' ou 'professional'

// Ver token
localStorage.getItem('token')

// Ver dados do usuário
localStorage.getItem('professional')
```

**Logs esperados:**
```
[Auth] Attempting login for: usuario@teste.com
[Auth] Professional login failed, trying user login...
[Auth] User login response: {success: true, ...}
[Auth] Login successful as user
[Auth] Permissions loaded: [{moduleCode: 'clientes', hasAccess: true}, ...]
```

## 🔐 Criar Usuário Admin

Para ter um usuário com acesso total:

```sql
-- 1. Criar usuário admin
INSERT INTO usuarios (company_id, name, email, password_hash, role, is_active, created_at, updated_at)
VALUES (
  1,
  'Administrador',
  'admin@empresa.com',
  '$2a$10$YourHashHere',
  'admin',  -- IMPORTANTE: role = 'admin'
  true,
  NOW(),
  NOW()
);

-- 2. OU atualizar usuário existente para admin
UPDATE usuarios SET role = 'admin' WHERE email = 'usuario@teste.com';
```

**Usuário com role 'admin':**
- ✅ Acesso a TODOS os módulos automaticamente
- ✅ Pode gerenciar permissões de profissionais
- ✅ Pode criar e gerenciar outros usuários
- ✅ Acessa página de Administração

## 🐛 Troubleshooting

### Problema: "Credenciais inválidas"
**Solução:** Verificar se:
1. Email está correto no banco
2. Senha está correta (compare hash)
3. Usuário está ativo (`is_active = true`)
4. Tem `company_id` configurado

### Problema: Menu vazio após login
**Solução:**
1. Verificar se módulos foram populados (`npm run seed:modules`)
2. Verificar permissões do usuário (deve ter registros em `user_permissions`)
3. Abrir Console (F12) e verificar logs `[Auth] Permissions loaded`

### Problema: Não consegue acessar Administração
**Esperado!** Usuários comuns NÃO têm acesso. Apenas:
- Profissionais
- Usuários com `role = 'admin'`

### Problema: Hash de senha inválido
```bash
# Gerar novo hash
node -e "console.log(require('bcryptjs').hashSync('sua-senha', 10))"

# Atualizar no banco
UPDATE usuarios SET password_hash = '$2a$10$NovoHash' WHERE email = 'usuario@teste.com';
```

## 📊 Verificar no Banco

```sql
-- Ver todos os usuários
SELECT id, name, email, role, is_active, company_id FROM usuarios;

-- Ver permissões de um usuário
SELECT u.name, u.email, m.name as module_name, up.has_access
FROM usuarios u
LEFT JOIN user_permissions up ON u.id = up.user_id
LEFT JOIN modules m ON up.module_id = m.id
WHERE u.email = 'usuario@teste.com';

-- Ver se módulos existem
SELECT * FROM modules ORDER BY id;
```

## ✨ Próximos Passos

Agora você pode:
1. ✅ Fazer login como profissional ou usuário
2. ✅ Criar múltiplos usuários
3. ✅ Configurar permissões individuais
4. ✅ Ter usuários admin com acesso total
5. ✅ Sistema hierárquico funcional: Admin → Profissional → Usuário



