import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { StatusCodes } from 'http-status-codes'
import { simulationRouter } from '@routes/simulation-routes'
import { errorHandler } from '@middlewares/error-handler'
import { notFoundHandler } from '@middlewares/not-found-handler'
import { env } from '@config/env'
import { openapiSpec } from '@docs/openapi-spec'
import { buildDocsHtml } from '@docs/docs-page'

export function createApp(): express.Express {
  const app = express()

  // Rotas públicas — sem helmet para não bloquear CDN do Scalar
  app.get('/', (_req, res) => {
    res.status(StatusCodes.OK).json({ status: 'ok' })
  })

  app.get('/openapi.json', (_req, res) => {
    res.json(openapiSpec)
  })

  app.get('/docs', (_req, res) => {
    res.type('text/html').send(buildDocsHtml())
  })

  // Rotas de API — helmet + CORS + rate limit + body parser
  app.use(
    '/api',
    helmet({ contentSecurityPolicy: false }),
    cors({ origin: env.corsOrigin }),
    rateLimit({
      windowMs: env.rateLimitWindowMs,
      max: env.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Muitas requisições. Tente novamente em alguns instantes.' },
    }),
    express.json({ limit: '16kb' }),
  )

  app.use('/api/simulate', simulationRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
