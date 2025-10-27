import { prisma } from './prisma'

// Exemplos de uso do Prisma com Supabase

// Buscar todos os profissionais
export async function getProfessionals() {
  return await prisma.professional.findMany({
    include: {
      categories: {
        include: {
          category: true
        }
      },
      catalogs: true,
      appointments: true
    }
  })
}

// Buscar profissional por ID
export async function getProfessionalById(id: string) {
  return await prisma.professional.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          category: true
        }
      },
      catalogs: true,
      appointments: true
    }
  })
}

// Buscar todas as categorias
export async function getCategories() {
  return await prisma.category.findMany({
    include: {
      catalogs: true,
      professionals: {
        include: {
          professional: true
        }
      }
    }
  })
}

// Buscar catálogos de um profissional
export async function getCatalogsByProfessional(professionalId: string) {
  return await prisma.catalog.findMany({
    where: { professionalId },
    include: {
      category: true,
      professional: true
    }
  })
}

// Criar nova categoria
export async function createCategory(data: {
  name: string
  description?: string
  status?: string
}) {
  return await prisma.category.create({
    data
  })
}

// Atualizar categoria
export async function updateCategory(id: string, data: {
  name?: string
  description?: string
  status?: string
}) {
  return await prisma.category.update({
    where: { id },
    data
  })
}

// Deletar categoria
export async function deleteCategory(id: string) {
  return await prisma.category.delete({
    where: { id }
  })
}

// Atribuir categoria a profissional
export async function assignCategoryToProfessional(
  professionalId: string, 
  categoryId: string
) {
  return await prisma.professionalCategory.create({
    data: {
      professionalId,
      categoryId
    }
  })
}

// Remover categoria de profissional
export async function removeCategoryFromProfessional(
  professionalId: string, 
  categoryId: string
) {
  return await prisma.professionalCategory.delete({
    where: {
      professionalId_categoryId: {
        professionalId,
        categoryId
      }
    }
  })
}

// Buscar agendamentos
export async function getAppointments(professionalId?: string) {
  return await prisma.appointment.findMany({
    where: professionalId ? { professionalId } : {},
    include: {
      professional: true
    },
    orderBy: {
      startTime: 'asc'
    }
  })
}

// Criar agendamento
export async function createAppointment(data: {
  title: string
  description?: string
  startTime: Date
  endTime: Date
  professionalId: string
  clientName?: string
  clientPhone?: string
  clientEmail?: string
}) {
  return await prisma.appointment.create({
    data
  })
}

