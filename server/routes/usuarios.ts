import { Router } from 'express'
import { prisma } from '../prisma'
import { auth } from '../middleware/auth'
import { createErrorResponse, createSuccessResponse, parsePagination } from '../utils/response'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string }
  const user = await prisma.usuario.findUnique({ where: { email } })
  if (!user) return res.status(401).json(createErrorResponse('Credenciais inválidas', 401))
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json(createErrorResponse('Credenciais inválidas', 401))
  const token = jwt.sign({ id: user.id, role: user.role, companyId: user.companyId, type: 'usuario' }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '12h' })
  res.json(createSuccessResponse({ token }))
})

router.get('/', auth(), async (req, res) => {
  const { skip, take, page, pageSize } = parsePagination(req.query)
  const [items, total] = await Promise.all([
    prisma.usuario.findMany({ skip, take, orderBy: { id: 'desc' }, include: { company: true } }),
    prisma.usuario.count()
  ])
  res.json(createSuccessResponse(items, { page, pageSize, total }))
})

router.post('/', auth(), async (req, res) => {
  const { companyId, name, email, password, role, isActive } = req.body
  const passwordHash = await bcrypt.hash(password, 10)
  const created = await prisma.usuario.create({ data: { companyId, name, email, passwordHash, role, isActive } })
  res.status(201).json(createSuccessResponse(created))
})

router.put('/:id', auth(), async (req, res) => {
  const id = Number(req.params.id)
  const { companyId, name, email, password, role, isActive } = req.body
  const data: any = { companyId, name, email, role, isActive }
  if (password) data.passwordHash = await bcrypt.hash(password, 10)
  const updated = await prisma.usuario.update({ where: { id }, data })
  res.json(createSuccessResponse(updated))
})

router.delete('/:id', auth(), async (req, res) => {
  const id = Number(req.params.id)
  await prisma.usuario.delete({ where: { id } })
  res.json(createSuccessResponse({ id }))
})


