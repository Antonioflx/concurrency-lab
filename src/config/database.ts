import mongoose from 'mongoose'
import { env } from '@config/env'
import { Logger } from '@utils/logger'

const logger = new Logger('database')

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.mongoUri)
  logger.info(`Connected to MongoDB: ${env.mongoUri}`)
}
