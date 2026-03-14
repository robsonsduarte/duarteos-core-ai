# Task: Phase 1 — Discovery (Descoberta de Nicho)

## Objetivo

Identificar e ranquear os melhores nichos para criacao de um infoproduto digital (ebook), produzindo um scorecard estruturado com top 3 oportunidades.

## Agente Responsavel

**RADAR** (niche-scout) — modelo haiku (coleta) + sonnet (analise)

## Pre-condicoes

- Nenhuma (primeira fase do pipeline)
- Input inicial fornecido pelo usuario ou API

## Input Esperado

```json
{
  "criteria": "string — tema, area de interesse ou palavra-chave inicial",
  "market_segment": "string (optional) — segmento especifico de mercado",
  "min_demand_score": "number (optional, default: 7) — score minimo para considerar viavel"
}
```

## Output Esperado

```json
{
  "niches": [
    {
      "name": "string",
      "score": "number (1-10)",
      "demand_level": "high | medium | low",
      "demand_score": "number (1-10)",
      "competition_level": "high | medium | low",
      "competition_score": "number (1-10)",
      "gap_score": "number (1-10)",
      "monetization_potential": "high | medium | low",
      "monetization_score": "number (1-10)",
      "trend_score": "number (1-10)",
      "trend_direction": "up | stable | down",
      "estimated_audience_size": "string",
      "avg_ticket_range": { "min": "number", "max": "number" },
      "rationale": "string"
    }
  ],
  "recommended": "string",
  "recommendation_rationale": "string",
  "scorecard_path": "string",
  "sources_consulted": ["string"],
  "mind_clone_insights": {
    "thiago_finch": "string",
    "pedro_valerio": "string"
  }
}
```

Consumido por: **Phase 2 — Research** (PRISM)

## Quality Gate OMEGA

- **Task type:** research
- **Threshold:** >= 80
- **Evidencias exigidas:**
  - Volume de busca verificado com fonte (Google Trends, Ubersuggest, etc)
  - Concorrencia mapeada com dados reais de marketplace
  - Potencial de monetizacao estimado com base em precos existentes
  - Score calculado com formula definida (nao arbitrario)
  - Minimo 3 nichos avaliados

## Checklist de Validacao

- [ ] Minimo 3 nichos pesquisados e avaliados
- [ ] Volume de busca verificado para cada nicho
- [ ] Concorrencia mapeada (quantidade e qualidade de produtos existentes)
- [ ] Potencial de monetizacao estimado com benchmarks reais
- [ ] Score composto calculado com formula (DEMANDA * 0.30 + GAP * 0.25 + MONETIZACAO * 0.25 + TENDENCIA * 0.20)
- [ ] Fontes de pesquisa listadas no output
- [ ] Mind clones consultados (Finch + Valerio)
- [ ] Recomendacao clara com justificativa
- [ ] Artefatos salvos: niche-scorecard.json + niche-scorecard.md

## API Contract

```yaml
endpoint: "/infoprodutos/discovery/scan"
method: "POST"
input_schema:
  type: "object"
  properties:
    criteria: { type: "string" }
    market_segment: { type: "string" }
    min_demand_score: { type: "number", default: 7 }
  required: ["criteria"]
output_schema:
  type: "object"
  properties:
    niches: { type: "array" }
    recommended: { type: "string" }
    recommendation_rationale: { type: "string" }
    scorecard_path: { type: "string" }
    sources_consulted: { type: "array" }
    mind_clone_insights: { type: "object" }
status_endpoint: "/infoprodutos/discovery/scan/status"
webhooks: ["on_start", "on_complete", "on_error"]
```

## Entregaveis

- `niche-scorecard.json` — scorecard estruturado (API-ready)
- `niche-scorecard.md` — scorecard formatado (leitura humana)

Diretorio: `squads/infoprodutos/output/{pipeline_id}/phase-1-discovery/`

## Timeout

10 minutos
