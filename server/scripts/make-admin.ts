import { PrismaClient } from '@prisma/client'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('🔐 Tornar Usuário Admin\n')

  // Listar usuários
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      company: {
        select: {
          name: true
        }
      }
    }
  })

  if (usuarios.length === 0) {
    console.log('❌ Nenhum usuário encontrado!')
    return
  }

  console.log('📋 Usuários existentes:\n')
  usuarios.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} (${user.email})`)
    console.log(`   Empresa: ${user.company?.name || 'Sem empresa'}`)
    console.log(`   Role atual: ${user.role || 'Nenhuma'}`)
    console.log(`   ID: ${user.id}\n`)
  })

  const emailInput = await question('Digite o EMAIL do usuário que deseja tornar admin: ')
  
  const usuario = await prisma.usuario.findUnique({
    where: { email: emailInput.trim() }
  })

  if (!usuario) {
    console.log('❌ Usuário não encontrado!')
    return
  }

  console.log(`\n✓ Usuário encontrado: ${usuario.name}`)
  console.log(`  Email: ${usuario.email}`)
  console.log(`  Role atual: ${usuario.role || 'Nenhuma'}`)

  const confirm = await question('\n⚠️  Deseja tornar este usuário ADMIN? (s/n): ')
  
  if (confirm.toLowerCase() !== 's') {
    console.log('❌ Operação cancelada.')
    return
  }

  // Atualizar para admin
  const updated = await prisma.usuario.update({
    where: { id: usuario.id },
    data: { role: 'admin' }
  })

  console.log('\n✅ Usuário atualizado com sucesso!')
  console.log(`   ${updated.name} agora é ADMIN`)
  console.log(`   Email: ${updated.email}`)
  console.log(`   Role: ${updated.role}`)
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    rl.close()
    await prisma.$disconnect()
  })

