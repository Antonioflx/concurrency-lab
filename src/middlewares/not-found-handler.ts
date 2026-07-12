import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export function notFoundHandler(req: Request, res: Response): void {
  res.status(StatusCodes.NOT_FOUND).json({
    error: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  })
}
