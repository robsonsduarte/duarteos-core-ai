# Avatar Profile — {{pipeline_id}}

**Data:** {{date}}
**Agente:** PRISM (Market Analyst)
**Nicho:** {{niche}}

---

## Perfil do Avatar

| Campo | Valor |
|-------|-------|
| **Nome Ficticio** | {{name}} |
| **Faixa Etaria** | {{age_range}} |
| **Genero** | {{gender}} |
| **Profissao** | {{occupation}} |
| **Renda** | {{income_range}} |
| **Escolaridade** | {{education_level}} |

---

## Dores (Pain Points)

{{#each pains}}
1. {{this}}
{{/each}}

---

## Desejos (Desires)

{{#each desires}}
1. {{this}}
{{/each}}

---

## Objecoes a Compra

{{#each objections}}
1. {{this}}
{{/each}}

---

## Nivel de Consciencia (Eugene Schwartz)

**Nivel:** {{awareness_level}}

{{awareness_description}}

| Nivel | Descricao | Status |
|-------|-----------|--------|
| Unaware | Nao sabe que tem o problema | {{#if_eq awareness_level "unaware"}}ATUAL{{/if_eq}} |
| Problem Aware | Sabe do problema, nao da solucao | {{#if_eq awareness_level "problem_aware"}}ATUAL{{/if_eq}} |
| Solution Aware | Conhece solucoes, nao o produto | {{#if_eq awareness_level "solution_aware"}}ATUAL{{/if_eq}} |
| Product Aware | Conhece o produto, nao decidiu | {{#if_eq awareness_level "product_aware"}}ATUAL{{/if_eq}} |
| Most Aware | Pronto para comprar | {{#if_eq awareness_level "most_aware"}}ATUAL{{/if_eq}} |

---

## Presenca Online

{{#each online_presence}}
- {{this}}
{{/each}}

---

## Comportamento de Busca

{{#each search_behavior}}
- {{this}}
{{/each}}

---

## Gatilhos de Compra

{{#each buying_triggers}}
- {{this}}
{{/each}}

---

## Preferencias de Conteudo

{{#each content_preferences}}
- {{this}}
{{/each}}

---

## Implicacoes para o Infoproduto

**Tom de comunicacao recomendado:** {{recommended_tone}}
**Nivel de profundidade:** {{recommended_depth}}
**Formato preferido:** {{preferred_format}}
**Angulo de copy principal:** {{primary_copy_angle}}

---

**OMEGA Score:** {{omega_score}}/100
**Status:** {{status}}
