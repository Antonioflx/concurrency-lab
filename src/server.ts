import 'dotenv/config'
import { createApp } from './app'
import { connectDatabase } from '@config/database'
import { env } from '@config/env'
import { Logger } from '@utils/logger'

const logger = new Logger('server')

async function bootstrap(): Promise<void> {
  await connectDatabase()

  const app = createApp()

  app.listen(env.port, () => {
    logger.info(`Rodando em http://localhost:${env.port}`)
    logger.info(`Documentação: http://localhost:${env.port}/docs`)
    logger.info(`OpenAPI JSON: http://localhost:${env.port}/openapi.json`)
  })
}

bootstrap().catch((err) => {
  logger.error('Falha ao inicializar', err)
  process.exit(1)
})
