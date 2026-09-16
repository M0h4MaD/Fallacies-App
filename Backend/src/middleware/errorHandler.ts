
import type { NextFunction, Request, Response } from 'express'

export class AppError extends Error {
  statusCode: number
  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const message = err instanceof Error ? err.message : 'خطأ غير متوقع'
  if (statusCode === 500) console.error(err)
  res.status(statusCode).json({ error: message })
}