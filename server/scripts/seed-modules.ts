import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const modules = [
  {
    code: 'dashboard',
    name: 'Dashboard',
    description: 'Visão geral e métricas do sistema',
    icon: 'LayoutDashboard',
  },
  {
    code: 'agendamentos',
    name: 'Agendamentos',
    description: 'Gerenciamento de agendamentos',
    icon: 'Calendar',
  },
  {
    code: 'clientes',
    name: 'Clientes',
    description: 'Cadastro e gestão de clientes',
    icon: 'Users',
  },
  {
    code: 'relatorios',
    name: 'Relatórios',
    description: 'Visualização de relatórios e análises',
    icon: 'BarChart3',
  },
  {
    code: 'pagamentos',
    name: 'Pagamentos',
    description: 'Gestão financeira e pagamentos',
    icon: 'DollarSign',
  },
  {
    code: 'conversas',
    name: 'Conversas',
    description: 'Chat e mensagens com clientes',
    icon: 'MessageCircle',
  },
  {
    code: 'catalogos',
    name: 'Catálogos',
    description: 'Gerenciamento de serviços e produtos',
    icon: 'Package',
  },
  {
    code: 'contratos',
    name: 'Assinatura de Contratos',
    description: 'Contratos e documentos',
    icon: 'FileText',
  },
]

async function main() {
  console.log('🌱 Iniciando seed dos módulos...')

  for (const module of modules) {
    const exists = await prisma.module.findUnique({
      where: { code: module.code },
    })

    if (exists) {
      console.log(`✓ Módulo "${module.name}" já existe, atualizando...`)
      await prisma.module.update({
        where: { code: module.code },
        data: module,
      })
    } else {
      console.log(`✓ Criando módulo "${module.name}"...`)
      await prisma.module.create({
        data: module,
      })
    }
  }

  console.log('✅ Seed dos módulos concluído!')
  
  // Mostrar todos os módulos
  const allModules = await prisma.module.findMany({
    orderBy: { id: 'asc' },
  })
  
  console.log('\n📋 Módulos cadastrados:')
  allModules.forEach((m) => {
    console.log(`  - ${m.name} (${m.code})`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

