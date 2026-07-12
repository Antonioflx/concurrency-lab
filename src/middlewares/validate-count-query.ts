import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { CountQueryDto } from '@dtos/count-query.dto'

export function validateCountQuery(req: Request, res: Response, next: NextFunction): void {
  const result = CountQueryDto.parse(req.query.count)

  if (result.error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: result.error })
    return
  }

  req.query.count = String(result.data!.count)
  next()
}
