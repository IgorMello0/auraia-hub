# Configuração do Prisma com Supabase

## Estrutura Criada

### 1. Arquivos de Configuração
- `prisma/schema.prisma` - Schema do banco de dados
- `.env` - Variáveis de ambiente (DATABASE_URL)
- `src/lib/prisma.ts` - Cliente Prisma configurado
- `src/lib/database.ts` - Funções de exemplo para uso

### 2. Scripts Adicionados ao package.json
```json
{
  "prisma:studio": "prisma studio",
  "prisma:migrate": "prisma migrate dev --name init",
  "prisma:pull": "prisma db pull"
}
```

## Como Usar

### 1. Configurar Supabase
1. Acesse seu projeto no Supabase
2. Vá em Settings > Database
3. Copie a Connection String
4. Substitua no arquivo `.env`:
```
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.SEU_PROJECT_ID.supabase.co:5432/postgres"
```

### 2. Executar Migrações
```bash
# Criar e aplicar migrações
npm run prisma:migrate

# Ou se já tem tabelas no Supabase, sincronizar schema
npm run prisma:pull
```

### 3. Abrir Prisma Studio
```bash
npm run prisma:studio
```

### 4. Usar no Código
```typescript
import { prisma } from '@/lib/prisma'
import { getProfessionals, createCategory } from '@/lib/database'

// Exemplo de uso
const professionals = await getProfessionals()
const newCategory = await createCategory({
  name: 'Depilação a Laser',
  description: 'Serviços de depilação',
  status: 'ativo'
})
```

## Modelos Disponíveis

### Professional
- Dados dos profissionais/usuários
- Relacionamentos com categorias, catálogos e agendamentos

### Category
- Categorias de catálogo
- Relacionamento many-to-many com profissionais

### Catalog
- Itens do catálogo
- Pertence a um profissional e uma categoria

### Appointment
- Agendamentos
- Pertence a um profissional

### Payment
- Pagamentos
- Pode estar vinculado a um agendamento

### Conversation & Message
- Sistema de conversas/mensagens

### Contract
- Contratos digitais

## Próximos Passos

1. Configure a DATABASE_URL no `.env`
2. Execute `npm run prisma:migrate` para criar as tabelas
3. Use as funções em `src/lib/database.ts` como exemplo
4. Integre com os componentes React existentes
5. Substitua os dados mockados pelas chamadas do Prisma


