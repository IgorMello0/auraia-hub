import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 Tornar Profissional Admin\n')

  // Buscar todos os profissionais
  const professionals = await prisma.professional.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      specialization: true,
      companyId: true,
    }
  })

  if (professionals.length === 0) {
    console.log('❌ Nenhum profissional encontrado!')
    return
  }

  console.log('📋 Profissionais existentes:\n')
  professionals.forEach((prof, index) => {
    console.log(`${index + 1}. ${prof.name}`)
    console.log(`   Email: ${prof.email}`)
    console.log(`   Especialização: ${prof.specialization || 'Não definida'}`)
    console.log(`   ID: ${prof.id}\n`)
  })

  // Para facilitar, vou tornar o PRIMEIRO profissional admin
  const firstProfessional = professionals[0]
  
  console.log(`✓ Tornando admin: ${firstProfessional.name} (${firstProfessional.email})`)

  // No Prisma, profissionais não têm campo 'role' diretamente
  // Então precisamos verificar se o profissional está associado a uma empresa
  // e criar um usuário admin para ele, OU adicionar o campo role na tabela professionals

  console.log('\n⚠️  NOTA: Profissionais não possuem campo "role" na tabela.')
  console.log('Você tem duas opções:')
  console.log('1. Adicionar campo "role" na tabela professionals')
  console.log('2. Criar um usuário admin na tabela usuarios para gerenciar')
  
  console.log('\n✅ Para dar permissões totais a um profissional:')
  console.log('   - Por padrão, profissionais têm acesso a todos os módulos')
  console.log('   - Use a interface de Administração para restringir acessos')
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

