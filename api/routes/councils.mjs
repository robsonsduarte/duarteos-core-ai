import { Router } from 'express'
import { buildSystemPrompt } from '../services/prompt-builder.mjs'
import { createError } from '../middleware/error-handler.mjs'

const router = Router()

/**
 * GET /api/councils
 * Lista todos os conselhos com nome, dominio e membros.
 */
router.get('/', (req, res, next) => {
  try {
    const councilLoader = req.app.locals.councilLoader
    const councils = councilLoader.loadAll()

    res.json({
      councils: councils.map((c) => ({
        slug: c.slug,
        name: c.name,
        domain: c.domain,
        members: c.members.map((m) => m.slug),
        members_count: c.members.length,
      })),
      total: councils.length,
    })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/councils/:slug
 * Detalhes de um conselho especifico.
 */
router.get('/:slug', (req, res, next) => {
  try {
    const councilLoader = req.app.locals.councilLoader
    const mindLoader = req.app.locals.mindLoader

    const council = councilLoader.loadOne(req.params.slug)

    // Enriquece membros com dados do mind clone
    const membersEnriched = council.members
      .map((m) => {
        try {
          const mind = mindLoader.loadOne(m.slug)
          return {
            slug: m.slug,
            name: mind.name,
            category: mind.category,
            domain: mind.domain,
            fidelity_score: mind.fidelity_score,
          }
        } catch {
          return { slug: m.slug, name: m.name }
        }
      })

    res.json({
      council: {
        slug: council.slug,
        name: council.name,
        domain: council.domain,
        members: membersEnriched,
      },
    })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/councils/:slug/discuss
 * Sessao de discussao com todos os membros do conselho em paralelo.
 *
 * Body: { topic, model?, max_tokens_per_member? }
 * Response: contribuicoes individuais + sintese final
 */
router.post('/:slug/discuss', async (req, res, next) => {
  try {
    const councilLoader = req.app.locals.councilLoader
    const mindLoader = req.app.locals.mindLoader
    const claudeClient = req.app.locals.claudeClient

    if (!claudeClient) {
      return next(createError(503, 'SERVICE_UNAVAILABLE', 'ANTHROPIC_API_KEY nao configurado.'))
    }

    const { slug } = req.params
    const { topic, model, max_tokens_per_member = 2048 } = req.body

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return next(createError(400, 'VALIDATION_ERROR', 'Campo "topic" e obrigatorio e deve ser uma string nao vazia.'))
    }

    const council = councilLoader.loadOne(slug)

    if (council.members.length === 0) {
      return next(createError(422, 'NO_MEMBERS', `Conselho '${slug}' nao tem membros validos.`))
    }

    // Invoca cada membro em paralelo
    const memberPromises = council.members.map(async (member) => {
      try {
        const systemPrompt = buildSystemPrompt(member.slug, mindLoader)
        const mindConfig = mindLoader.loadOne(member.slug)

        const memberMessage = buildMemberPrompt(topic)

        const result = await claudeClient.chat(systemPrompt, [{ role: 'user', content: memberMessage }], {
          ...(model && { model }),
          max_tokens: max_tokens_per_member,
        })

        const parsed = parseMemberResponse(result.content)

        return {
          member: {
            slug: member.slug,
            name: mindConfig.name,
            category: mindConfig.category,
            fidelity_score: mindConfig.fidelity_score,
          },
          ...parsed,
          raw_response: result.content,
        }
      } catch (err) {
        return {
          member: { slug: member.slug, name: member.name },
          error: err.message,
          analysis: null,
          recommendations: [],
          risks: [],
          summary_phrase: null,
        }
      }
    })

    const contributions = await Promise.all(memberPromises)

    // Sintese final — uma chamada sem persona, pedindo consolidacao
    const synthesisPrompt = buildSynthesisPrompt(council.name, topic, contributions)
    const synthesisResult = await claudeClient.chat(
      'Voce e um facilitador neutro de conselhos estrategicos. Sintetize as contribuicoes dos especialistas de forma clara, objetiva e acionavel.',
      [{ role: 'user', content: synthesisPrompt }],
      { ...(model && { model }), max_tokens: 2048 }
    )

    const synthesis = parseSynthesis(synthesisResult.content)

    res.json({
      council: { slug: council.slug, name: council.name },
      topic,
      contributions,
      synthesis,
    })
  } catch (err) {
    next(err)
  }
})

// ---- helpers ----

function buildMemberPrompt(topic) {
  return `Analise a seguinte demanda sob SUA perspectiva unica e frameworks especificos:

DEMANDA: ${topic}

Responda EXATAMENTE neste formato:

**DIAGNOSTICO:**
[Seu diagnostico sob seu framework mental especifico]

**RECOMENDACOES:**
1. [Recomendacao concreta e acionavel]
2. [Recomendacao concreta e acionavel]
3. [Recomendacao concreta e acionavel]

**RISCOS QUE SO EU VEjo:**
- [Risco 1 — pela sua experiencia unica]
- [Risco 2]

**FRASE-SINTESE:**
[Uma frase que resume sua posicao]

Seja direto e especifico. NAO repita generalidades. Use seus frameworks mentais reais.`
}

function parseMemberResponse(content) {
  const sections = {
    analysis: '',
    recommendations: [],
    risks: [],
    summary_phrase: '',
  }

  const diagMatch = content.match(/\*\*DIAGNOSTICO:\*\*\s*([\s\S]*?)(?=\*\*RECOMENDACOES:|$)/)
  if (diagMatch) sections.analysis = diagMatch[1].trim()

  const recsMatch = content.match(/\*\*RECOMENDACOES:\*\*\s*([\s\S]*?)(?=\*\*RISCOS|$)/)
  if (recsMatch) {
    sections.recommendations = recsMatch[1]
      .split('\n')
      .filter((l) => /^\d+\./.test(l.trim()))
      .map((l) => l.replace(/^\d+\.\s*/, '').trim())
      .filter(Boolean)
  }

  const risksMatch = content.match(/\*\*RISCOS[^:]*:\*\*\s*([\s\S]*?)(?=\*\*FRASE|$)/)
  if (risksMatch) {
    sections.risks = risksMatch[1]
      .split('\n')
      .filter((l) => l.trim().startsWith('-'))
      .map((l) => l.replace(/^-\s*/, '').trim())
      .filter(Boolean)
  }

  const phraseMatch = content.match(/\*\*FRASE-S[ÍI]NTESE:\*\*\s*(.+)/)
  if (phraseMatch) sections.summary_phrase = phraseMatch[1].trim()

  return sections
}

function buildSynthesisPrompt(councilName, topic, contributions) {
  const contribText = contributions
    .filter((c) => !c.error)
    .map(
      (c) =>
        `### ${c.member.name}\n**Analise:** ${c.analysis || 'N/A'}\n**Recomendacoes:** ${c.recommendations?.join(' | ') || 'N/A'}\n**Frase-sintese:** ${c.summary_phrase || 'N/A'}`
    )
    .join('\n\n')

  return `Voce acaba de facilitar uma sessao do ${councilName} sobre o seguinte topico:

**TOPICO:** ${topic}

**CONTRIBUICOES DOS ESPECIALISTAS:**

${contribText}

Com base em todas as contribuicoes acima, produza uma sintese no seguinte formato JSON (responda APENAS o JSON, sem markdown):

{
  "consensus": ["ponto de consenso 1", "ponto de consenso 2"],
  "divergences": [{"topic": "tema", "position_a": "posicao A", "advocates_a": ["nome"], "position_b": "posicao B", "advocates_b": ["nome"]}],
  "final_recommendation": "recomendacao final consolidada em 2-3 frases com nivel de confianca (ALTA/MEDIA/BAIXA)"
}`
}

function parseSynthesis(content) {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // fallback graceful
  }

  return {
    consensus: [],
    divergences: [],
    final_recommendation: content.trim(),
  }
}

export default router
