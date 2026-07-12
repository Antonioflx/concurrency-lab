import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Logger } from '@utils/logger'

const GENERIC_ERROR_MESSAGE = 'Erro interno do servidor.'

const logger = new Logger('error-handler')

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  const internalMessage = err instanceof Error ? err.message : String(err)
  logger.error(internalMessage, err)

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: GENERIC_ERROR_MESSAGE })
}
