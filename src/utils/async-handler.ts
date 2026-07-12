import { Request, Response, NextFunction, RequestHandler } from 'express'

type TAsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

export function asyncHandler(fn: TAsyncFn): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}
