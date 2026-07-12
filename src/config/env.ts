import 'dotenv/config'
import { NumberEnvParser } from '@config/env-parsers/number-env-parser'
import { StringEnvParser } from '@config/env-parsers/string-env-parser'
import { BooleanEnvParser } from '@config/env-parsers/boolean-env-parser'
import { IServerEnvDto } from '@config/dtos/server-env.dto'
import { IDatabaseEnvDto } from '@config/dtos/database-env.dto'
import { ILatencyEnvDto } from '@config/dtos/latency-env.dto'
import { ISimulationEnvDto } from '@config/dtos/simulation-env.dto'
import { ISmtpEnvDto } from '@config/dtos/smtp-env.dto'

export interface IEnvConfig
  extends IServerEnvDto,
    IDatabaseEnvDto,
    ILatencyEnvDto,
    ISimulationEnvDto,
    ISmtpEnvDto {}

class EnvConfig implements IEnvConfig {
  private readonly str = new StringEnvParser()
  private readonly num = new NumberEnvParser()
  private readonly bool = new BooleanEnvParser()

  readonly nodeEnv = this.str.parse('NODE_ENV', 'development')
  readonly port = this.num.parse('PORT', 3000)
  readonly apiKey = this.str.parseRequired('API_KEY')
  readonly corsOrigin = this.str.parseRequired('CORS_ORIGIN')
  readonly rateLimitWindowMs = this.num.parseRequired('RATE_LIMIT_WINDOW_MS')
  readonly rateLimitMax = this.num.parseRequired('RATE_LIMIT_MAX')

  readonly mongoUri = this.str.parseRequired('MONGO_URI')

  readonly networkLatencyMinMs = this.num.parse('NETWORK_LATENCY_MIN_MS', 60)
  readonly networkLatencyMaxMs = this.num.parse('NETWORK_LATENCY_MAX_MS', 160)

  readonly optimizedConcurrencyLimit = this.num.parse('OPTIMIZED_CONCURRENCY_LIMIT', 5)
  readonly naiveBatchSize = this.num.parse('NAIVE_BATCH_SIZE', 5)
  readonly naiveBatchSleepMs = this.num.parse('NAIVE_BATCH_SLEEP_MS', 1000)
  readonly seedCount = this.num.parse('SEED_COUNT', 100)

  readonly smtpHost = this.str.parse('SMTP_HOST')
  readonly smtpPort = this.num.parse('SMTP_PORT', 1025)
  readonly smtpSecure = this.bool.parse('SMTP_SECURE')
  readonly smtpUser = this.str.parse('SMTP_USER')
  readonly smtpPass = this.str.parse('SMTP_PASS')
  readonly mailFrom = this.str.parse('MAIL_FROM', 'simulador@concurrency-lab.dev')
  readonly mailTo = this.str.parse('MAIL_TO', 'destinatario@exemplo.com')
}

export const env: IEnvConfig = new EnvConfig()
