import { Router } from 'express'
import { prisma } from '../prisma'
import { auth } from '../middleware/auth'
import { createErrorResponse, createSuccessResponse, parsePagination } from '../utils/response'

export const router = Router()

router.get('/', auth(false), async (req, res) => {
  const { skip, take, page, pageSize } = parsePagination(req.query)
  const [items, total] = await Promise.all([
    prisma.client.findMany({
      skip,
      take,
      orderBy: { id: 'desc' },
      include: {
        professional: true,
        appointments: true,
        payments: true,
        fichas: true,
        chatHistories: true,
        conversas: true
      }
    }),
    prisma.client.count()
  ])
  res.json(createSuccessResponse(items, { page, pageSize, total }))
})

router.get('/:id', auth(false), async (req, res) => {
  const id = Number(req.params.id)
  const item = await prisma.client.findUnique({
    where: { id },
    include: { professional: true, appointments: true, payments: true, fichas: true, chatHistories: true, conversas: true }
  })
  if (!item) return res.status(404).json(createErrorResponse('Cliente não encontrado', 404))
  res.json(createSuccessResponse(item))
})

router.post('/', auth(), async (req, res) => {
  const { professionalId, name, email, phone, dateOfBirth, document, notes } = req.body
  const created = await prisma.client.create({
    data: { professionalId, name, email, phone, dateOfBirth, document, notes }
  })
  res.status(201).json(createSuccessResponse(created))
})

router.put('/:id', auth(), async (req, res) => {
  const id = Number(req.params.id)
  const { professionalId, name, email, phone, dateOfBirth, document, notes } = req.body
  const updated = await prisma.client.update({
    where: { id },
    data: { professionalId, name, email, phone, dateOfBirth, document, notes }
  })
  res.json(createSuccessResponse(updated))
})

router.delete('/:id', auth(), async (req, res) => {
  const id = Number(req.params.id)
  await prisma.client.delete({ where: { id } })
  res.json(createSuccessResponse({ id }))
})


