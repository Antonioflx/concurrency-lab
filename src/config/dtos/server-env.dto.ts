export interface IServerEnvDto {
  nodeEnv: string
  port: number
  apiKey: string
  corsOrigin: string
  rateLimitWindowMs: number
  rateLimitMax: number
}
