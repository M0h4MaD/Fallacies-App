// backend/src/middleware/validate.ts (ملف جديد)
import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'
import { AppError } from './errorHandler.js'

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) return next(new AppError(result.error.issues[0].message, 400))
    req.body = result.data
    next()
  }
}