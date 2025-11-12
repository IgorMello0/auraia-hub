# 🔐 Sistema de Controle de Acesso Modular

## Visão Geral

Sistema hierárquico de permissões com 3 níveis de acesso:
1. **Usuário Admin** (role: 'admin' na tabela usuarios)
2. **Profissional**
3. **Usuário** (role: 'atendente', 'suporte', etc.)

## Hierarquia de Permissões

```
┌─────────────────────┐
│   USUÁRIO ADMIN     │ ← Acesso Total + Gerencia Profissionais
└──────────┬──────────┘
           │
    ┌──────▼──────────┐
    │  PROFISSIONAL   │ ← Acesso Configurável + Gerencia Usuários
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │    USUÁRIO      │ ← Acesso Restrito (definido pelo Profissional)
    └─────────────────┘
```

## Módulos do Sistema

1. **Dashboard** (`dashboard`)
2. **Agendamentos** (`agendamentos`)
3. **Clientes** (`clientes`)
4. **Relatórios** (`relatorios`)
5. **Pagamentos** (`pagamentos`)
6. **Conversas** (`conversas`)
7. **Catálogos** (`catalogos`)
8. **Assinatura de Contratos** (`contratos`)

**Módulo Especial:**
- **Administração** - Sempre acessível para Admin e Profissionais, NUNCA para Usuários comuns

## Como Funciona

### Usuário Admin (role: 'admin')
- ✅ Acesso total a TODOS os módulos
- ✅ Pode gerenciar permissões de Profissionais
- ✅ Pode criar e gerenciar Usuários
- ✅ Pode gerenciar permissões de Usuários
- ✅ Acessa página de Administração

### Profissional
- ✅ Acesso configurável aos módulos (definido pelo Admin)
- ✅ Pode criar Usuários
- ✅ Pode gerenciar permissões de Usuários (apenas módulos que ele tem acesso)
- ✅ Acessa página de Administração
- ⚠️ Não pode alterar suas próprias permissões

### Usuário
- ✅ Acesso apenas aos módulos liberados pelo Profissional
- ❌ NÃO pode criar outros usuários
- ❌ NÃO pode acessar página de Administração
- ❌ NÃO pode alterar permissões

## Setup Inicial

### 1. Aplicar Migration
```bash
npx prisma db push
# ou
npx prisma migrate dev
```

### 2. Popular Módulos
```bash
npm run seed:modules
```

### 3. Criar Usuário Admin (se ainda não existe)
```bash
npm run create-admin
```

Ou criar manualmente no banco:
```sql
INSERT INTO usuarios (company_id, name, email, password_hash, role, is_active) 
VALUES (1, 'Administrador', 'admin@empresa.com', '$2a$10$...', 'admin', true);
```

### 4. Reiniciar Servidor
```bash
npm run server:dev
```

## Fluxo de Uso

### 1. Login como Admin
- Email: admin@empresa.com
- Senha: (definida na criação)

### 2. Configurar Profissional
1. Vá para **Administração** → **Profissionais**
2. Selecione um profissional
3. Clique na aba **Módulos de Acesso**
4. Ative/Desative os módulos que ele pode acessar

### 3. Criar Usuário (como Profissional ou Admin)
1. Vá para **Administração** → **Usuários**
2. Clique em **Novo Usuário**
3. Preencha os dados (name, email, password, role)

### 4. Configurar Permissões do Usuário
1. Na lista de usuários, clique no ícone 🔑 (chave)
2. Selecione quais módulos o usuário pode acessar
3. Alterações são salvas automaticamente

**Importante:** 
- Admin pode liberar QUALQUER módulo para o usuário
- Profissional pode liberar APENAS os módulos que ele próprio tem acesso

## API Endpoints

### Permissões de Profissionais
- `GET /api/permissions/professional/:id` - Ver permissões
- `PUT /api/permissions/professional/:id` - Atualizar (apenas admin)

### Permissões de Usuários
- `GET /api/permissions/user/:id` - Ver permissões
- `PUT /api/permissions/user/:id` - Atualizar (profissional ou admin)

### Minhas Permissões
- `GET /api/permissions/my-permissions` - Ver permissões do usuário logado

### Módulos
- `GET /api/modules` - Listar todos os módulos

## Estrutura do Banco

### Tabela: `modules`
```sql
- id: INT (PK)
- code: VARCHAR (UNIQUE) - Ex: "clientes", "agendamentos"
- name: VARCHAR - Ex: "Clientes", "Agendamentos"
- description: TEXT
- icon: VARCHAR - Nome do ícone lucide-react
- is_active: BOOLEAN
```

### Tabela: `professional_permissions`
```sql
- id: INT (PK)
- professional_id: INT (FK → professionals)
- module_id: INT (FK → modules)
- has_access: BOOLEAN
- UNIQUE(professional_id, module_id)
```

### Tabela: `user_permissions`
```sql
- id: INT (PK)
- user_id: INT (FK → usuarios)
- module_id: INT (FK → modules)
- has_access: BOOLEAN
- UNIQUE(user_id, module_id)
```

## Segurança

### Backend
- ✅ Middleware `requireModule(moduleCode)` em todas as rotas
- ✅ Verificação de permissões no banco de dados
- ✅ Validação de hierarquia (profissional não pode dar permissões que não tem)
- ✅ Isolamento por empresa (companyId)

### Frontend
- ✅ Menu filtrado baseado em permissões
- ✅ Componente `ProtectedRoute` para proteger páginas
- ✅ Hook `hasModuleAccess(moduleCode)` no AuthContext
- ✅ Mensagem de acesso negado para módulos sem permissão

## Troubleshooting

### Usuário não vê nenhum módulo no menu
1. Verificar se as permissões foram carregadas (`/api/permissions/my-permissions`)
2. Verificar se o módulo está ativo no banco
3. Verificar se a tabela `user_permissions` tem registros para o usuário

### Admin não consegue gerenciar permissões
1. Verificar se `role = 'admin'` no banco de dados
2. Verificar token JWT (deve conter `role: 'admin'`)
3. Fazer logout e login novamente

### Profissional não pode criar usuário
1. Verificar se está associado a uma empresa (`companyId`)
2. Verificar permissões no backend (logs do console)

## Logs

O sistema gera logs detalhados:
- `[Auth]` - Autenticação e carregamento de permissões
- `[Permissions]` - Operações de permissões
- `[Usuarios]` - Operações de usuários
- `[ModulesAccessTab]` - Interface de gerenciamento

Monitore o console do navegador e do servidor para debug.

## Adicionando Novos Módulos

1. Adicionar no seed (`server/scripts/seed-modules.ts`):
```typescript
{
  code: 'novo_modulo',
  name: 'Novo Módulo',
  description: 'Descrição do novo módulo',
  icon: 'IconeLucide',
}
```

2. Executar seed:
```bash
npm run seed:modules
```

3. Adicionar no menu (`src/components/AppSidebar.tsx`):
```typescript
{
  title: 'Novo Módulo',
  url: '/novo-modulo',
  icon: IconeLucide,
  moduleCode: 'novo_modulo',
}
```

4. Proteger rotas backend:
```typescript
router.get('/', auth(), requireModule('novo_modulo'), async (req, res) => {
  // ...
})
```

5. Proteger página frontend:
```typescript
<ProtectedRoute moduleCode="novo_modulo">
  <NovoModuloPage />
</ProtectedRoute>
```

