import { ISmtpEnvDto } from '@config/dtos/smtp-env.dto'

export interface ISmtpTransportOptions {
  host: string
  port: number
  secure: boolean
  auth?: { user: string; pass: string }
}

export interface IEmailMessage {
  from: string
  to: string
  subject: string
  text: string
}

export class EmailConfig {
  private constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly secure: boolean,
    private readonly user: string,
    private readonly pass: string,
    private readonly from: string,
    private readonly to: string,
  ) {}

  static fromEnv(smtp: ISmtpEnvDto): EmailConfig {
    return new EmailConfig(
      smtp.smtpHost,
      smtp.smtpPort,
      smtp.smtpSecure,
      smtp.smtpUser,
      smtp.smtpPass,
      smtp.mailFrom,
      smtp.mailTo,
    )
  }

  isConfigured(): boolean {
    return !!this.host
  }

  getTransportOptions(): ISmtpTransportOptions {
    return {
      host: this.host,
      port: this.port,
      secure: this.secure,
      auth: this.user ? { user: this.user, pass: this.pass } : undefined,
    }
  }

  buildMessage(subject: string, text: string): IEmailMessage {
    return {
      from: this.from,
      to: this.to,
      subject,
      text,
    }
  }

  getTo(): string {
    return this.to
  }
}
