import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { RunNaiveSimulationUseCase } from '@use-cases/run-naive-simulation-use-case'
import { RunOptimizedSimulationUseCase } from '@use-cases/run-optimized-simulation-use-case'
import { CompareSimulationsUseCase } from '@use-cases/compare-simulations-use-case'
import { StreamCompareUseCase, TStreamEnvelope } from '@use-cases/stream-compare-use-case'
import { jsonUtil } from '@utils/json.util'

export class SimulationController {
  constructor(
    private readonly naiveUseCase: RunNaiveSimulationUseCase,
    private readonly optimizedUseCase: RunOptimizedSimulationUseCase,
    private readonly compareUseCase: CompareSimulationsUseCase,
    private readonly streamCompareUseCase: StreamCompareUseCase,
  ) {}

  naive = async (req: Request, res: Response): Promise<void> => {
    const count = parseInt(String(req.query.count), 10)
    const result = await this.naiveUseCase.execute(count)
    res.status(StatusCodes.OK).json(result)
  }

  optimized = async (req: Request, res: Response): Promise<void> => {
    const count = parseInt(String(req.query.count), 10)
    const result = await this.optimizedUseCase.execute(count)
    res.status(StatusCodes.OK).json(result)
  }

  compare = async (req: Request, res: Response): Promise<void> => {
    const count = parseInt(String(req.query.count), 10)
    const result = await this.compareUseCase.execute(count)
    res.status(StatusCodes.OK).json(result)
  }

  compareStream = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const count = parseInt(String(req.query.count), 10)

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    const send = (envelope: TStreamEnvelope): void => {
      res.write(`event: ${envelope.event}\n${jsonUtil.toSseData(envelope)}\n\n`)
    }

    try {
      await this.streamCompareUseCase.execute(count, send)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro interno do servidor.'
      send({ event: 'error', at: new Date().toISOString(), payload: { message } })
    } finally {
      res.end()
    }
  }
}
