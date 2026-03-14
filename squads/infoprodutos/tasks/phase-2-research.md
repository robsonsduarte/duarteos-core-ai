# Task: Phase 2 — Research (Pesquisa de Mercado)

## Objetivo

Conduzir pesquisa profunda de mercado sobre o nicho selecionado, produzindo dossie completo com avatar ideal, analise de concorrencia, benchmarks de preco e gaps de conteudo.

## Agente Responsavel

**PRISM** (market-analyst) — modelo haiku (coleta) + sonnet (analise)

## Pre-condicoes

- Phase 1 (Discovery) concluida com OMEGA >= 80
- Nicho recomendado selecionado do scorecard

## Depends On

- `phase-1-discovery`

## Input Esperado

```json
{
  "niche": "string — nicho selecionado (recommended da fase 1)",
  "scorecard": "object — output completo da fase 1"
}
```

## Output Esperado

```json
{
  "avatar": {
    "name": "string",
    "age_range": "string",
    "gender": "string",
    "occupation": "string",
    "income_range": "string",
    "education_level": "string",
    "pains": ["string — minimo 5"],
    "desires": ["string — minimo 5"],
    "objections": ["string — minimo 3"],
    "awareness_level": "unaware | problem_aware | solution_aware | product_aware | most_aware",
    "awareness_description": "string",
    "online_presence": ["string"],
    "search_behavior": ["string"],
    "buying_triggers": ["string"],
    "content_preferences": ["string"]
  },
  "competitors": [
    {
      "name": "string",
      "platform": "string",
      "price": "number",
      "currency": "BRL",
      "rating": "number | null",
      "total_sales_estimate": "string",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "gap": "string",
      "page_url": "string"
    }
  ],
  "price_benchmarks": {
    "min": "number",
    "max": "number",
    "avg": "number",
    "median": "number",
    "recommended": "number",
    "recommended_rationale": "string"
  },
  "content_gaps": ["string"],
  "market_size_estimate": "string",
  "growth_trend": "growing | stable | declining",
  "mind_clone_insights": {
    "eugene_schwartz": "string",
    "david_ogilvy": "string",
    "brennan_dunn": "string"
  },
  "dossie_path": "string"
}
```

Consumido por: **Phase 3 — Strategy** (COMPASS)

## Quality Gate OMEGA

- **Task type:** research
- **Threshold:** >= 80
- **Evidencias exigidas:**
  - Avatar construido com dados reais (nao achismo)
  - Minimo 5 concorrentes analisados com dados de marketplace
  - Benchmarks de preco coletados de produtos reais
  - Gaps de conteudo identificados e justificados
  - Nivel de consciencia Schwartz aplicado com evidencia

## Checklist de Validacao

- [ ] Avatar definido com 5+ dores especificas baseadas em dados
- [ ] Avatar definido com 5+ desejos especificos baseados em dados
- [ ] Avatar definido com 3+ objecoes a compra baseadas em reviews/foruns
- [ ] Nivel de consciencia Schwartz definido com justificativa
- [ ] 5+ concorrentes analisados com dados reais (preco, rating, strengths, weaknesses)
- [ ] Benchmarks de preco coletados (min, max, avg, median)
- [ ] Gaps de conteudo identificados (oportunidades acionaveis)
- [ ] Mind clones consultados (Schwartz + Ogilvy + Dunn)
- [ ] Artefatos salvos: market-dossie.json + market-dossie.md + avatar-profile.json + avatar-profile.md

## API Contract

```yaml
endpoint: "/infoprodutos/research/analyze"
method: "POST"
input_schema:
  type: "object"
  properties:
    niche: { type: "string" }
    scorecard: { type: "object" }
  required: ["niche", "scorecard"]
output_schema:
  type: "object"
  properties:
    avatar: { type: "object" }
    competitors: { type: "array" }
    price_benchmarks: { type: "object" }
    content_gaps: { type: "array" }
    market_size_estimate: { type: "string" }
    growth_trend: { type: "string" }
    mind_clone_insights: { type: "object" }
    dossie_path: { type: "string" }
status_endpoint: "/infoprodutos/research/analyze/status"
webhooks: ["on_start", "on_complete", "on_error"]
```

## Entregaveis

- `market-dossie.json` — dossie estruturado completo (API-ready)
- `market-dossie.md` — dossie formatado (leitura humana)
- `avatar-profile.json` — avatar isolado (API-ready)
- `avatar-profile.md` — avatar formatado (leitura humana)

Diretorio: `squads/infoprodutos/output/{pipeline_id}/phase-2-research/`

## Timeout

15 minutos
