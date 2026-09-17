// backend/src/middleware/asyncHandler.ts (ملف جديد)
// Express 4 doesn't auto-catch rejected promises from async handlers — without this,
// a thrown error in a controller becomes an unhandled rejection instead of hitting errorHandler.
import type { NextFunction, Request, Response } from 'express'

export function asyncHandler<T extends (req: Request, res: Response, next: NextFunction) => Promise<unknown>>(fn: T) {
  return (req: Request, res: Response, next: NextFunction) => { fn(req, res, next).catch(next) }
}