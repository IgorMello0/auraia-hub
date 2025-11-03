import { Router } from 'express'
import { prisma } from '../prisma'
import { auth } from '../middleware/auth'
import { createErrorResponse, createSuccessResponse, parsePagination } from '../utils/response'

export const router = Router()

router.get('/', auth(false), async (req, res) => {
  const { skip, take, page, pageSize } = parsePagination(req.query)
  const [items, total] = await Promise.all([
    prisma.catalogItem.findMany({
      skip,
      take,
      orderBy: { id: 'desc' },
      include: { professional: true, category: true, appointments: true }
    }),
    prisma.catalogItem.count()
  ])
  res.json(createSuccessResponse(items, { page, pageSize, total }))
})

router.get('/:id', auth(false), async (req, res) => {
  const id = Number(req.params.id)
  const item = await prisma.catalogItem.findUnique({
    where: { id },
    include: { professional: true, category: true, appointments: true }
  })
  if (!item) return res.status(404).json(createErrorResponse('Item de catálogo não encontrado', 404))
  res.json(createSuccessResponse(item))
})

router.post('/', auth(), async (req, res) => {
  const { professionalId, categoryId, name, description, price, imageUrl, status, durationMinutes } = req.body
  const created = await prisma.catalogItem.create({
    data: { professionalId, categoryId, name, description, price, imageUrl, status, durationMinutes }
  })
  res.status(201).json(createSuccessResponse(created))
})

router.put('/:id', auth(), async (req, res) => {
  const id = Number(req.params.id)
  const { professionalId, categoryId, name, description, price, imageUrl, status, durationMinutes } = req.body
  const updated = await prisma.catalogItem.update({
    where: { id },
    data: { professionalId, categoryId, name, description, price, imageUrl, status, durationMinutes }
  })
  res.json(createSuccessResponse(updated))
})

router.delete('/:id', auth(), async (req, res) => {
  const id = Number(req.params.id)
  await prisma.catalogItem.delete({ where: { id } })
  res.json(createSuccessResponse({ id }))
})


