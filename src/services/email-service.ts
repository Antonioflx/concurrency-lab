import nodemailer from 'nodemailer'
import path from 'path'
import { EmailConfig } from '@domain/email-config'
import { SimulationMode } from '@domain/simulation-mode'
import { Logger } from '@utils/logger'

export class EmailService {
  private readonly logger = new Logger('email-service')

  constructor(private readonly config: EmailConfig) {}

  async send(filePath: string, mode: SimulationMode): Promise<boolean> {
    if (!this.config.isConfigured()) {
      this.logger.warn('SMTP não configurado — envio de e-mail ignorado')
      return false
    }

    const to = this.config.getTo()
    const transportOptions = this.config.getTransportOptions()

    this.logger.info(`Tentando enviar e-mail para ${to} via ${transportOptions.host}:${transportOptions.port}`)

    try {
      const transporter = nodemailer.createTransport(transportOptions)

      const message = this.config.buildMessage(
        `Planilha Consolidada (modo: ${mode.toString()})`,
        `Segue em anexo a planilha consolidada gerada pelo modo ${mode.toString()}.`,
      )

      const result = await transporter.sendMail({
        ...message,
        attachments: [{ filename: path.basename(filePath), path: filePath }],
      })

      this.logger.info(`E-mail aceito pelo servidor — messageId: ${result.messageId}, accepted: [${result.accepted.join(', ')}]`)
      return true
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      this.logger.error(`Falha ao enviar e-mail para ${to} — ${reason}`, err)
      return false
    }
  }
}
