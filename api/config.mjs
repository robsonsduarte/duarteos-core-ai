import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { config as loadDotenv } from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

loadDotenv({ path: resolve(__dirname, '.env') })

export const config = {
  port: parseInt(process.env.PORT || '3333'),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  duarteosApiKey: process.env.DUARTEOS_API_KEY || '',
  basePath: process.env.DUARTEOS_BASE_PATH || resolve(__dirname, '..'),
  defaultModel: process.env.DEFAULT_MODEL || 'claude-sonnet-4-20250514',
  defaultMaxTokens: parseInt(process.env.DEFAULT_MAX_TOKENS || '4096'),
  defaultTemperature: parseFloat(process.env.DEFAULT_TEMPERATURE || '0.7'),
}
