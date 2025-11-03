import { Router } from 'express'
import { prisma } from '../prisma'
import { auth } from '../middleware/auth'
import { createErrorResponse, createSuccessResponse, parsePagination } from '../utils/response'

export const router = Router()

// Listar profissionais
router.get('/', auth(false), async (req, res) => {
  const { skip, take, page, pageSize } = parsePagination(req.query)
  const [items, total] = await Promise.all([
    prisma.professional.findMany({
      skip,
      take,
      orderBy: { id: 'desc' },
      include: {
        categories: true,
        catalogItems: true,
        appointments: true,
        payments: true,
        fichaTemplates: true,
        fichas: true,
        chatHistories: true,
        settingsProfile: true,
        auditLogs: true,
        contracts: true,
        conversas: true
      }
    }),
    prisma.professional.count()
  ])
  res.json(createSuccessResponse(items, { page, pageSize, total }))
})

// Obter por id
router.get('/:id', auth(false), async (req, res) => {
  const id = Number(req.params.id)
  const item = await prisma.professional.findUnique({
    where: { id },
    include: {
      categories: true,
      catalogItems: true,
      appointments: true,
      payments: true,
      fichaTemplates: true,
      fichas: true,
      chatHistories: true,
      settingsProfile: true,
      auditLogs: true,
      contracts: true,
      conversas: true
    }
  })
  if (!item) return res.status(404).json(createErrorResponse('Profissional não encontrado', 404))
  res.json(createSuccessResponse(item))
})

// Criar
router.post('/', auth(), async (req, res) => {
  const { name, email, passwordHash, phone, specialization, companyName, logoUrl, contractType } = req.body
  const created = await prisma.professional.create({
    data: { name, email, passwordHash, phone, specialization, companyName, logoUrl, contractType }
  })
  res.status(201).json(createSuccessResponse(created))
})

// Atualizar
router.put('/:id', auth(), async (req, res) => {
  const id = Number(req.params.id)
  const { name, email, passwordHash, phone, specialization, companyName, logoUrl, contractType } = req.body
  const updated = await prisma.professional.update({
    where: { id },
    data: { name, email, passwordHash, phone, specialization, companyName, logoUrl, contractType }
  })
  res.json(createSuccessResponse(updated))
})

// Deletar
router.delete('/:id', auth(), async (req, res) => {
  const id = Number(req.params.id)
  await prisma.professional.delete({ where: { id } })
  res.json(createSuccessResponse({ id }))
})

// Listar clientes de um profissional
router.get('/:id/clientes', auth(false), async (req, res) => {
  const professionalId = Number(req.params.id)
  const { skip, take, page, pageSize } = parsePagination(req.query)
  const [items, total] = await Promise.all([
    prisma.client.findMany({
      where: { professionalId },
      skip,
      take,
      include: { appointments: true, payments: true, fichas: true, chatHistories: true, conversas: true },
      orderBy: { id: 'desc' }
    }),
    prisma.client.count({ where: { professionalId } })
  ])
  res.json(createSuccessResponse(items, { page, pageSize, total }))
})


