import { Router } from 'express'
import { randomUUID } from 'crypto'
import { buildSystemPrompt } from '../services/prompt-builder.mjs'
import { createError } from '../middleware/error-handler.mjs'

const router = Router()

/**
 * GET /api/minds
 * Lista todos os clones com metadados basicos.
 * Query params: ?category=Copywriting, ?status=active, ?pipeline=3
 */
router.get('/', (req, res, next) => {
  try {
    const mindLoader = req.app.locals.mindLoader
    let minds = mindLoader.loadAll()

    const { category, status, pipeline } = req.query

    if (category) {
      minds = minds.filter((m) => m.category?.toLowerCase() === category.toLowerCase())
    }
    if (status) {
      minds = minds.filter((m) => m.status?.toLowerCase() === status.toLowerCase())
    }
    if (pipeline) {
      minds = minds.filter((m) => String(m.pipeline_version) === String(pipeline))
    }

    res.json({
      minds: minds.map((m) => ({
        name: m.name,
        slug: m.slug,
        category: m.category,
        domain: m.domain,
        archetype: m.archetype,
        fidelity_score: m.fidelity_score,
        fidelity_estimated: m.fidelity_estimated,
        pipeline_version: m.pipeline_version,
        status: m.status,
      })),
      total: minds.length,
    })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/minds/:slug
 * Detalhes completos de um clone incluindo artifacts disponveis.
 */
router.get('/:slug', (req, res, next) => {
  try {
    const mindLoader = req.app.locals.mindLoader
    const mind = mindLoader.loadOne(req.params.slug)
    res.json({ mind })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/minds/:slug/artifacts
 * Todos os artefatos YAML parseados do clone.
 */
router.get('/:slug/artifacts', (req, res, next) => {
  try {
    const mindLoader = req.app.locals.mindLoader
    // valida existencia primeiro
    mindLoader.loadOne(req.params.slug)
    const artifacts = mindLoader.loadArtifacts(req.params.slug)

    if (Object.keys(artifacts).length === 0) {
      return res.json({
        artifacts: {},
        note: 'Clone legacy — sem squad artifacts. Apenas agent.md disponvel.',
      })
    }

    res.json({ artifacts })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/minds/:slug/chat
 * Conversar com um mind clone. Retorna resposta completa.
 *
 * Body: { message, history?, model?, max_tokens?, temperature? }
 */
router.post('/:slug/chat', async (req, res, next) => {
  try {
    const mindLoader = req.app.locals.mindLoader
    const claudeClient = req.app.locals.claudeClient

    const { slug } = req.params
    const { message, history = [], model, max_tokens, temperature } = req.body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return next(createError(400, 'VALIDATION_ERROR', 'Campo "message" e obrigatorio e deve ser uma string nao vazia.'))
    }

    if (!claudeClient) {
      return next(createError(503, 'SERVICE_UNAVAILABLE', 'ANTHROPIC_API_KEY nao configurado.'))
    }

    const mind = mindLoader.loadOne(slug)
    const systemPrompt = buildSystemPrompt(slug, mindLoader)

    const messages = [
      ...history,
      { role: 'user', content: message },
    ]

    const result = await claudeClient.chat(systemPrompt, messages, {
      ...(model && { model }),
      ...(max_tokens && { max_tokens }),
      ...(temperature !== undefined && { temperature }),
    })

    res.json({
      id: randomUUID(),
      mind: {
        name: mind.name,
        slug: mind.slug,
        category: mind.category,
        fidelity_score: mind.fidelity_score,
      },
      response: result.content,
      model: result.model,
      usage: result.usage,
    })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/minds/:slug/chat/stream
 * Chat com SSE streaming.
 *
 * Body: { message, history?, model?, max_tokens?, temperature? }
 * Response: SSE stream com eventos text_delta e message_stop
 */
router.post('/:slug/chat/stream', async (req, res, next) => {
  try {
    const mindLoader = req.app.locals.mindLoader
    const claudeClient = req.app.locals.claudeClient

    const { slug } = req.params
    const { message, history = [], model, max_tokens, temperature } = req.body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return next(createError(400, 'VALIDATION_ERROR', 'Campo "message" e obrigatorio e deve ser uma string nao vazia.'))
    }

    if (!claudeClient) {
      return next(createError(503, 'SERVICE_UNAVAILABLE', 'ANTHROPIC_API_KEY nao configurado.'))
    }

    mindLoader.loadOne(slug) // valida existencia — lanca 404 se nao encontrar
    const systemPrompt = buildSystemPrompt(slug, mindLoader)

    const messages = [
      ...history,
      { role: 'user', content: message },
    ]

    // Configura SSE
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    res.flushHeaders()

    const stream = claudeClient.chatStream(systemPrompt, messages, {
      ...(model && { model }),
      ...(max_tokens && { max_tokens }),
      ...(temperature !== undefined && { temperature }),
    })

    for await (const event of stream) {
      res.write(`data: ${JSON.stringify(event)}\n\n`)
      if (event.type === 'message_stop') break
    }

    res.end()
  } catch (err) {
    // Se os headers ja foram enviados nao podemos mandar JSON de erro
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`)
      res.end()
    } else {
      next(err)
    }
  }
})

export default router
