import { Router } from 'express'

const router = Router()
const startedAt = Date.now()

/**
 * GET /api/health
 * Retorna status basico da API.
 */
router.get('/', (req, res) => {
  const mindLoader = req.app.locals.mindLoader

  let mindsCount = 0
  try {
    mindsCount = mindLoader.listSlugs().length
  } catch {
    // nao quebrar o health check se o loader falhar
  }

  res.json({
    status: 'ok',
    version: '1.0.0',
    minds_count: mindsCount,
    uptime_seconds: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
  })
})

export default router
