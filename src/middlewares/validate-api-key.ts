import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { env } from '@config/env'

export function validateApiKey(req: Request, res: Response, next: NextFunction): void {
  const provided = req.headers['x-api-key']

  if (!provided || provided !== env.apiKey) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Não autorizado.' })
    return
  }

  next()
}
