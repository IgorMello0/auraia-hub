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
  try {
    // Verificar se é um profissional autenticado
    if (req.user?.type !== 'profissional') {
      return res.status(403).json(createErrorResponse('Acesso negado', 403))
    }

    // Buscar o profissional e sua empresa
    const professional = await prisma.professional.findUnique({
      where: { id: req.user.id },
      select: { companyId: true }
    })

    if (!professional || !professional.companyId) {
      return res.status(400).json(createErrorResponse('Profissional não possui empresa associada', 400))
    }

    const { skip, take, page, pageSize } = parsePagination(req.query)
    
    // Filtrar usuários pela empresa do profissional
    const where = { companyId: professional.companyId }
    
    const [items, total] = await Promise.all([
      prisma.usuario.findMany({ 
        where,
        skip, 
        take, 
        orderBy: { id: 'desc' }, 
        include: { company: true } 
      }),
      prisma.usuario.count({ where })
    ])
    
    res.json(createSuccessResponse(items, { page, pageSize, total }))
  } catch (error: any) {
    console.error('[Usuarios] Erro ao buscar usuários:', error)
    res.status(500).json(createErrorResponse(error.message || 'Erro ao buscar usuários', 500))
  }
})

router.post('/', auth(), async (req, res) => {
  try {
    console.log('[Usuarios] Iniciando criação de usuário')
    console.log('[Usuarios] User autenticado:', req.user)
    
    // Verificar se é um profissional autenticado
    if (req.user?.type !== 'profissional') {
      console.log('[Usuarios] Erro: Tipo de usuário inválido:', req.user?.type)
      return res.status(403).json(createErrorResponse('Acesso negado', 403))
    }

    // Buscar o profissional e sua empresa
    const professional = await prisma.professional.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, companyId: true }
    })

    console.log('[Usuarios] Profissional encontrado:', professional)

    if (!professional) {
      console.log('[Usuarios] Erro: Profissional não encontrado')
      return res.status(404).json(createErrorResponse('Profissional não encontrado', 404))
    }

    if (!professional.companyId) {
      console.log('[Usuarios] Erro: Profissional sem empresa associada')
      return res.status(400).json(createErrorResponse('Profissional não possui empresa associada. Por favor, entre em contato com o suporte.', 400))
    }

    const { name, email, password, role, isActive } = req.body
    
    console.log('[Usuarios] Dados recebidos:', { name, email, role, isActive })
    
    // Validações
    if (!name || !email || !password) {
      return res.status(400).json(createErrorResponse('Nome, email e senha são obrigatórios', 400))
    }

    if (password.length < 6) {
      return res.status(400).json(createErrorResponse('A senha deve ter pelo menos 6 caracteres', 400))
    }

    // Verificar se email já existe
    const existingUser = await prisma.usuario.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json(createErrorResponse('Email já cadastrado', 400))
    }

    const passwordHash = await bcrypt.hash(password, 10)
    
    console.log('[Usuarios] Tentando criar usuário para empresa ID:', professional.companyId)
    
    // Usar o companyId do profissional logado
    const created = await prisma.usuario.create({ 
      data: { 
        companyId: professional.companyId,
        name, 
        email, 
        passwordHash, 
        role: role || 'atendente', 
        isActive: isActive !== undefined ? isActive : true 
      },
      include: { company: true }
    })
    
    console.log('[Usuarios] Usuário criado com sucesso:', created.id)
    res.status(201).json(createSuccessResponse(created))
  } catch (error: any) {
    console.error('[Usuarios] Erro ao criar usuário:', error)
    console.error('[Usuarios] Stack:', error.stack)
    res.status(500).json(createErrorResponse(error.message || 'Erro ao criar usuário', 500))
  }
})

router.put('/:id', auth(), async (req, res) => {
  try {
    const id = Number(req.params.id)
    
    // Verificar se é um profissional autenticado
    if (req.user?.type !== 'profissional') {
      return res.status(403).json(createErrorResponse('Acesso negado', 403))
    }

    // Buscar o profissional e sua empresa
    const professional = await prisma.professional.findUnique({
      where: { id: req.user.id },
      select: { companyId: true }
    })

    if (!professional || !professional.companyId) {
      return res.status(400).json(createErrorResponse('Profissional não possui empresa associada', 400))
    }

    // Verificar se o usuário pertence à empresa do profissional
    const usuario = await prisma.usuario.findUnique({ where: { id } })
    if (!usuario) {
      return res.status(404).json(createErrorResponse('Usuário não encontrado', 404))
    }

    if (usuario.companyId !== professional.companyId) {
      return res.status(403).json(createErrorResponse('Você não pode editar usuários de outra empresa', 403))
    }

    const { name, email, password, role, isActive } = req.body
    
    // Validações
    if (!name || !email) {
      return res.status(400).json(createErrorResponse('Nome e email são obrigatórios', 400))
    }

    if (password && password.length < 6) {
      return res.status(400).json(createErrorResponse('A senha deve ter pelo menos 6 caracteres', 400))
    }

    // Verificar se email já existe (exceto para o próprio usuário)
    if (email !== usuario.email) {
      const existingUser = await prisma.usuario.findUnique({ where: { email } })
      if (existingUser) {
        return res.status(400).json(createErrorResponse('Email já cadastrado', 400))
      }
    }

    const data: any = { name, email, role, isActive }
    if (password) data.passwordHash = await bcrypt.hash(password, 10)
    
    const updated = await prisma.usuario.update({ 
      where: { id }, 
      data,
      include: { company: true }
    })
    
    res.json(createSuccessResponse(updated))
  } catch (error: any) {
    console.error('[Usuarios] Erro ao atualizar usuário:', error)
    if (error.code === 'P2025') {
      return res.status(404).json(createErrorResponse('Usuário não encontrado', 404))
    }
    res.status(500).json(createErrorResponse(error.message || 'Erro ao atualizar usuário', 500))
  }
})

router.delete('/:id', auth(), async (req, res) => {
  try {
    const id = Number(req.params.id)
    
    // Verificar se é um profissional autenticado
    if (req.user?.type !== 'profissional') {
      return res.status(403).json(createErrorResponse('Acesso negado', 403))
    }

    // Buscar o profissional e sua empresa
    const professional = await prisma.professional.findUnique({
      where: { id: req.user.id },
      select: { companyId: true }
    })

    if (!professional || !professional.companyId) {
      return res.status(400).json(createErrorResponse('Profissional não possui empresa associada', 400))
    }

    // Verificar se o usuário pertence à empresa do profissional
    const usuario = await prisma.usuario.findUnique({ where: { id } })
    if (!usuario) {
      return res.status(404).json(createErrorResponse('Usuário não encontrado', 404))
    }

    if (usuario.companyId !== professional.companyId) {
      return res.status(403).json(createErrorResponse('Você não pode excluir usuários de outra empresa', 403))
    }

    await prisma.usuario.delete({ where: { id } })
    res.json(createSuccessResponse({ id }))
  } catch (error: any) {
    console.error('[Usuarios] Erro ao deletar usuário:', error)
    if (error.code === 'P2025') {
      return res.status(404).json(createErrorResponse('Usuário não encontrado', 404))
    }
    res.status(500).json(createErrorResponse(error.message || 'Erro ao deletar usuário', 500))
  }
})


