import 'dotenv/config'
import { connectDatabase } from '@config/database'
import { ensureParticipants } from '../container'
import { env } from '@config/env'
import { Logger } from '@utils/logger'
import mongoose from 'mongoose'

const logger = new Logger('seed')

async function main(): Promise<void> {
  await connectDatabase()

  const count = env.seedCount
  logger.info(`Garantindo ${count} participantes no banco...`)

  await ensureParticipants.execute(count)

  logger.info('Concluído.')
  await mongoose.disconnect()
}

main().catch((err) => {
  logger.error('Falha ao executar seed', err)
  process.exit(1)
})
