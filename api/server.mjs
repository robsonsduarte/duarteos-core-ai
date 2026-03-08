import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config.mjs'
import { MindLoader } from './services/mind-loader.mjs'
import { CouncilLoader } from './services/council-loader.mjs'
import { ClaudeClient } from './services/claude-client.mjs'
import { authMiddleware } from './middleware/auth.mjs'
import { errorHandler } from './middleware/error-handler.mjs'
import healthRouter from './routes/health.mjs'
import mindsRouter from './routes/minds.mjs'
import councilsRouter from './routes/councils.mjs'

const app = express()

// ---- Security & parsing ----
app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '2mb' }))

// ---- Services (shared via app.locals) ----
const mindLoader = new MindLoader(config.basePath)
const councilLoader = new CouncilLoader(config.basePath)

let claudeClient = null
if (config.anthropicApiKey) {
  try {
    claudeClient = new ClaudeClient(config.anthropicApiKey)
    console.log('[DuarteOS API] Anthropic SDK inicializado.')
  } catch (err) {
    console.warn('[DuarteOS API] AVISO: Falha ao inicializar Anthropic SDK:', err.message)
  }
} else {
  console.warn('[DuarteOS API] AVISO: ANTHROPIC_API_KEY nao configurado. Endpoints /chat e /discuss estarao indisponiveis.')
}

app.locals.mindLoader = mindLoader
app.locals.councilLoader = councilLoader
app.locals.claudeClient = claudeClient

// ---- Routes ----
// Health e publico (sem auth)
app.use('/api/health', healthRouter)
// Demais rotas protegidas por auth
app.use('/api', authMiddleware)
app.use('/api/minds', mindsRouter)
app.use('/api/councils', councilsRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Rota ${req.method} ${req.path} nao encontrada.`,
    },
  })
})

// Global error handler
app.use(errorHandler)

// ---- Startup ----
app.listen(config.port, () => {
  let mindsCount = 0
  try {
    mindsCount = mindLoader.listSlugs().length
  } catch {
    // silencioso
  }

  console.log(`
╔══════════════════════════════════════════╗
║         DuarteOS API v1.0.0              ║
╠══════════════════════════════════════════╣
║  Port:    ${String(config.port).padEnd(30)} ║
║  Minds:   ${String(mindsCount).padEnd(30)} ║
║  Model:   ${config.defaultModel.padEnd(30)} ║
║  Auth:    ${(config.duarteosApiKey ? 'Bearer token ativo' : 'Aberto (local only)').padEnd(30)} ║
╚══════════════════════════════════════════╝
`)
})

export default app
