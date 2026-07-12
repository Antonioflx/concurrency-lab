export interface ISmtpEnvDto {
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  smtpUser: string
  smtpPass: string
  mailFrom: string
  mailTo: string
}
