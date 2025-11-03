import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createErrorResponse } from '../utils/response'

export type AuthUser = {
  id: number
  role?: string | null
  companyId?: number | null
  type: 'usuario' | 'profissional' | 'cliente'
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser
  }
}

export function auth(required = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    const token = header?.startsWith('Bearer ') ? header.substring(7) : undefined

    if (!token) {
      if (required) return res.status(401).json(createErrorResponse('Não autenticado', 401))
      return next()
    }

    try {
      const secret = process.env.JWT_SECRET || 'dev-secret'
      const payload = jwt.verify(token, secret) as AuthUser
      req.user = payload
      return next()
    } catch {
      return res.status(401).json(createErrorResponse('Token inválido', 401))
    }
  }
}

export function requireCompany(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.companyId) return res.status(400).json(createErrorResponse('Empresa não definida', 400))
  return next()
}

export function requireRoles(roles: Array<string>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).json(createErrorResponse('Sem permissão', 403))
    }
    return next()
  }
}


