import { Router } from 'express'
import { prisma } from '../prisma'
import { auth, requireModule } from '../middleware/auth'
import { createErrorResponse, createSuccessResponse, parsePagination } from '../utils/response'

export const router = Router()

router.get('/', auth(false), requireModule('agendamentos'), async (req, res) => {
  const { skip, take, page, pageSize } = parsePagination(req.query)
  const { professionalId, clientId, status } = req.query as any
  const where: any = {}
  if (professionalId) where.professionalId = Number(professionalId)
  if (clientId) where.clientId = Number(clientId)
  if (status) where.status = status

  const [items, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      skip,
      take,
      orderBy: { startTime: 'desc' },
      include: { professional: true, client: true, service: true, appointmentLogs: true, payments: true }
    }),
    prisma.appointment.count({ where })
  ])
  res.json(createSuccessResponse(items, { page, pageSize, total }))
})

router.get('/:id', auth(false), requireModule('agendamentos'), async (req, res) => {
  const id = Number(req.params.id)
  const item = await prisma.appointment.findUnique({
    where: { id },
    include: { professional: true, client: true, service: true, appointmentLogs: true, payments: true }
  })
  if (!item) return res.status(404).json(createErrorResponse('Agendamento não encontrado', 404))
  res.json(createSuccessResponse(item))
})

router.post('/', auth(), requireModule('agendamentos'), async (req, res) => {
  const { professionalId, clientId, serviceId, startTime, endTime, status, notes } = req.body
  const created = await prisma.appointment.create({
    data: { professionalId, clientId, serviceId, startTime, endTime, status, notes }
  })
  res.status(201).json(createSuccessResponse(created))
})

router.put('/:id', auth(), requireModule('agendamentos'), async (req, res) => {
  const id = Number(req.params.id)
  const { professionalId, clientId, serviceId, startTime, endTime, status, notes } = req.body
  const updated = await prisma.appointment.update({
    where: { id },
    data: { professionalId, clientId, serviceId, startTime, endTime, status, notes }
  })
  res.json(createSuccessResponse(updated))
})

router.delete('/:id', auth(), requireModule('agendamentos'), async (req, res) => {
  const id = Number(req.params.id)
  await prisma.appointment.delete({ where: { id } })
  res.json(createSuccessResponse({ id }))
})


