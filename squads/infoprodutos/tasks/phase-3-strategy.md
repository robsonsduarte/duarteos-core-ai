# Task: Phase 3 — Strategy (Estrategia Comercial)

## Objetivo

Definir estrategia comercial completa do infoproduto: ticket, posicionamento, funil Kiwify, bonus, garantia e upsells, baseados nos dados de mercado coletados.

## Agente Responsavel

**COMPASS** (strategist) — modelo opus

## Pre-condicoes

- Phase 2 (Research) concluida com OMEGA >= 80
- Dossie de mercado e avatar disponiveis

## Depends On

- `phase-2-research`

## Input Esperado

```json
{
  "dossie": "object — output completo da fase 2",
  "avatar": "object — avatar da fase 2",
  "competitors": "array — concorrentes da fase 2"
}
```

## Output Esperado

```json
{
  "ticket": {
    "value": "number",
    "currency": "BRL",
    "justification": "string",
    "anchoring": "string",
    "payment_options": ["pix", "credit_card", "boleto"]
  },
  "positioning": {
    "statement": "string",
    "unique_angle": "string",
    "big_idea": "string",
    "tagline": "string"
  },
  "funnel": {
    "stages": [
      {
        "name": "string",
        "type": "string",
        "description": "string",
        "metrics": { "expected_conversion": "string" }
      }
    ],
    "estimated_cac": "number",
    "estimated_ltv": "number",
    "estimated_roi": "number"
  },
  "bonuses": [
    {
      "name": "string",
      "description": "string",
      "perceived_value": "number",
      "format": "pdf | video | template | checklist",
      "production_effort": "low | medium | high"
    }
  ],
  "guarantee": {
    "type": "unconditional | conditional",
    "days": "number",
    "description": "string"
  },
  "upsells": [
    {
      "name": "string",
      "type": "order_bump | upsell | downsell",
      "price": "number",
      "description": "string",
      "expected_take_rate": "string"
    }
  ],
  "kiwify_config": {
    "product_type": "ebook",
    "delivery_method": "download",
    "refund_policy_days": "number",
    "affiliate_commission_percent": "number",
    "checkout_type": "one_step",
    "upsell_enabled": "boolean",
    "order_bump_enabled": "boolean",
    "order_bump_product": "string | null",
    "order_bump_price": "number | null"
  },
  "expected_metrics": {
    "monthly_revenue_estimate": "number",
    "conversion_rate_estimate": "string",
    "avg_ticket_with_bumps": "number",
    "break_even_sales": "number"
  },
  "mind_clone_insights": {
    "conselho_business": "string",
    "conselho_marketing": "string"
  },
  "strategy_path": "string"
}
```

Consumido por: **Phase 4 — Architecture** (BLUEPRINT)

## Quality Gate OMEGA

- **Task type:** planning
- **Threshold:** >= 85
- **Evidencias exigidas:**
  - Ticket justificado com dados de benchmarks e valor percebido
  - Posicionamento unico (diferente da concorrencia)
  - Funil implementavel no Kiwify (features reais da plataforma)
  - Bonus realisticamente produziveis
  - Garantia em conformidade legal (minimo 7 dias)

## Checklist de Validacao

- [ ] Ticket definido com valor numerico e justificativa baseada em dados
- [ ] Posicionamento claro e diferenciado dos concorrentes
- [ ] Big idea definida (conceito central Ogilvy)
- [ ] Funil de venda desenhado com 3+ stages
- [ ] Metricas esperadas por stage (conversao)
- [ ] Bonus definidos (minimo 2) com perceived value
- [ ] Garantia definida (minimo 7 dias)
- [ ] Upsells/order bumps planejados
- [ ] Config Kiwify especificada e implementavel
- [ ] Conselhos Business e Marketing consultados
- [ ] Artefatos salvos: commercial-strategy.json + commercial-strategy.md

## API Contract

```yaml
endpoint: "/infoprodutos/strategy/define"
method: "POST"
input_schema:
  type: "object"
  properties:
    dossie: { type: "object" }
    avatar: { type: "object" }
    competitors: { type: "array" }
  required: ["dossie", "avatar", "competitors"]
output_schema:
  type: "object"
  properties:
    ticket: { type: "object" }
    positioning: { type: "object" }
    funnel: { type: "object" }
    bonuses: { type: "array" }
    guarantee: { type: "object" }
    upsells: { type: "array" }
    kiwify_config: { type: "object" }
    expected_metrics: { type: "object" }
    mind_clone_insights: { type: "object" }
    strategy_path: { type: "string" }
status_endpoint: "/infoprodutos/strategy/define/status"
webhooks: ["on_start", "on_complete", "on_error"]
```

## Entregaveis

- `commercial-strategy.json` — estrategia estruturada (API-ready)
- `commercial-strategy.md` — estrategia formatada (leitura humana)

Diretorio: `squads/infoprodutos/output/{pipeline_id}/phase-3-strategy/`

## Timeout

10 minutos
