// backend/src/middleware/identify.ts (استبدله كامل)
import type { NextFunction, Request, Response } from 'express'
import { verifySupabaseToken } from '../config/supabaseAuth.js'
import { prisma } from '../config/prisma.js'
import { AppError } from './errorHandler.js'
import type { User } from '@prisma/client'

export interface IdentifiedRequest extends Request {
  currentUser?: User
}

export async function identifyUser(req: IdentifiedRequest, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization
    if (header?.startsWith('Bearer ')) {
      const claims = await verifySupabaseToken(header.slice('Bearer '.length))
      const user = await prisma.user.findUnique({ where: { supabaseUserId: claims.sub } })
      if (!user) return next(new AppError('User not found — call /api/auth/register first', 404))
      req.currentUser = user
    if (user.isSuspended) return next(new AppError('This account has been suspended.', 403))
      return next()
    }
    const guestId = req.headers['x-guest-id']
    if (typeof guestId === 'string' && guestId.length > 0) {
      req.currentUser = await prisma.user.upsert({ where: { guestId }, update: {}, create: { guestId, isGuest: true, displayName: 'Guest' } })
      return next()
    }
    next(new AppError('Provide either a Bearer token or an X-Guest-Id header', 401))
  } catch {
    next(new AppError('Invalid or expired token', 401))
  }
}