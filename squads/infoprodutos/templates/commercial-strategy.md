# Estrategia Comercial — {{pipeline_id}}

**Data:** {{date}}
**Agente:** COMPASS (Strategist)
**Nicho:** {{niche}}

---

## Resumo Executivo

- **Produto:** {{product_name}}
- **Ticket:** R$ {{ticket_value}}
- **Posicionamento:** {{positioning_statement}}
- **Big Idea:** {{big_idea}}
- **Tagline:** {{tagline}}

---

## Ticket (Precificacao)

| Campo | Valor |
|-------|-------|
| **Valor** | R$ {{ticket_value}} |
| **Moeda** | BRL |
| **Ancora** | {{anchoring}} |
| **Formas de Pagamento** | PIX, Cartao, Boleto |

**Justificativa:** {{ticket_justification}}

---

## Posicionamento

**Declaracao:** {{positioning_statement}}

**Angulo Unico:** {{unique_angle}}

**Big Idea (Ogilvy):** {{big_idea}}

**Tagline:** {{tagline}}

---

## Funil de Venda (Kiwify)

| Stage | Tipo | Conversao Esperada |
|-------|------|-------------------|
{{#each funnel_stages}}
| {{name}} | {{type}} | {{expected_conversion}} |
{{/each}}

**CAC Estimado:** R$ {{estimated_cac}}
**LTV Estimado:** R$ {{estimated_ltv}}
**ROI Estimado:** {{estimated_roi}}x

### Detalhamento por Stage

{{#each funnel_stages}}
#### {{name}} ({{type}})
{{description}}

{{/each}}

---

## Bonus

{{#each bonuses}}
### {{@index_1}}. {{name}}
- **Formato:** {{format}}
- **Valor Percebido:** R$ {{perceived_value}}
- **Esforco de Producao:** {{production_effort}}
- **Descricao:** {{description}}

{{/each}}

---

## Garantia

- **Tipo:** {{guarantee_type}}
- **Prazo:** {{guarantee_days}} dias
- **Descricao:** {{guarantee_description}}

---

## Upsells e Order Bumps

{{#each upsells}}
### {{name}} ({{type}})
- **Preco:** R$ {{price}}
- **Take Rate Esperado:** {{expected_take_rate}}
- **Descricao:** {{description}}

{{/each}}

---

## Configuracao Kiwify

```json
{
  "product_type": "{{kiwify_product_type}}",
  "delivery_method": "{{kiwify_delivery_method}}",
  "refund_policy_days": {{kiwify_refund_days}},
  "affiliate_commission_percent": {{kiwify_affiliate_percent}},
  "checkout_type": "{{kiwify_checkout_type}}",
  "upsell_enabled": {{kiwify_upsell_enabled}},
  "order_bump_enabled": {{kiwify_order_bump_enabled}}
}
```

---

## Metricas Esperadas

| Metrica | Valor |
|---------|-------|
| Receita Mensal Estimada | R$ {{monthly_revenue}} |
| Taxa de Conversao | {{conversion_rate}} |
| Ticket Medio (com bumps) | R$ {{avg_ticket_with_bumps}} |
| Break-even (vendas) | {{break_even_sales}} |

---

## Insights dos Conselhos

### Conselho Business
{{conselho_business_insight}}

### Conselho Marketing
{{conselho_marketing_insight}}

---

**OMEGA Score:** {{omega_score}}/100
**Status:** {{status}}
