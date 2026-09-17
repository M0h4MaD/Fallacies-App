// backend/src/middleware/auth.ts (ملف جديد)
import type { NextFunction, Request, Response } from 'express'
import { getAuth } from 'firebase-admin/auth'
import User from '../models/User.js'
import { AppError } from './errorHandler.js'

export interface AuthedRequest extends Request {
  firebaseUser?: { uid: string; email?: string; name?: string }
}

export async function verifyFirebaseToken(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return next(new AppError('Missing or malformed Authorization header', 401))
  try {
    const decoded = await getAuth().verifyIdToken(header.slice('Bearer '.length))
    req.firebaseUser = { uid: decoded.uid, email: decoded.email, name: decoded.name }
    next()
  } catch {
    next(new AppError('Invalid or expired token', 401))
  }
}

export async function requireAdmin(req: AuthedRequest, _res: Response, next: NextFunction) {
  const user = await User.findOne({ firebaseUid: req.firebaseUser?.uid })
  if (user?.role !== 'admin') return next(new AppError('Admin access required', 403))
  next()
}