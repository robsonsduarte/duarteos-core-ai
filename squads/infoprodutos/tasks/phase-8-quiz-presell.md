# Task: Phase 8 — Quiz de Pre-sell

## Objetivo

Criar quiz de pre-sell 100% light (white hat) para trafego direto ao checkout. 5 perguntas que aquecem naturalmente o lead e direcionam para resultado personalizado com metodo ideal + CTA para checkout.

## Agentes Responsaveis

**CANVAS** (designer) — frontend do quiz (HTML/CSS/JS)
**COMPASS** (strategist) — logica de perguntas e perfis de resultado

Modelo: opus

## Pre-condicoes

- Phase 3 (Strategy) concluida com OMEGA >= 85
- Phase 4 (Architecture) concluida com OMEGA >= 85
- Avatar definido (fase 2)

## Depends On

- `phase-3-strategy`
- `phase-4-architecture`

## Regra Absoluta

**100% WHITE HAT** — zero dark patterns, zero urgencia falsa, zero contadores fake, zero manipulacao psicologica. O quiz e uma ferramenta de autodescoberta que ajuda a pessoa a entender qual metodo e ideal para ela.

## Logica das 5 Perguntas

Cada pergunta tem um proposito claro e declarado:

| # | Proposito | Objetivo Real |
|---|-----------|---------------|
| 1 | **Connection** (identificacao da dor) | Criar conexao: "eu entendo voce" |
| 2 | **Objection Removal** (tempo disponivel) | Eliminar objecao: "nao tenho tempo" |
| 3 | **Empathy** (experiencia previa) | Mostrar que qualquer nivel e bem-vindo |
| 4 | **Objection Removal** (recursos disponiveis) | Eliminar objecao: "nao tenho dinheiro" |
| 5 | **Personalization** (perfil/preferencia) | Direcionar para metodo ideal |

### Fluxo do Quiz

```
Pergunta 1 → Pergunta 2 → Pergunta 3 → Pergunta 4 → Pergunta 5
                                                          ↓
                                                   Resultado Personalizado
                                                   (metodo ideal + analise)
                                                          ↓
                                              ┌──────────────────────────┐
                                              │  CTA: Checkout do Ebook  │
                                              │  Link: "Prefiro comecar  │
                                              │  gratis" → Lead Magnet   │
                                              └──────────────────────────┘
```

## Input Esperado

```json
{
  "avatar": "object — output da fase 2 (perfil do avatar, dores, desejos)",
  "strategy": "object — output da fase 3 (posicionamento, metodos, big idea)",
  "outline": "object — output da fase 4 (capitulos e metodos mapeados)"
}
```

## Output Esperado

```json
{
  "questions": [
    {
      "number": "number",
      "text": "string",
      "purpose": "string — connection | qualification | empathy | objection_removal | personalization",
      "options": [
        {
          "label": "string",
          "value": "string",
          "profile_map": "string — qual perfil de resultado essa opcao favorece"
        }
      ]
    }
  ],
  "result_profiles": [
    {
      "name": "string — nome do perfil (ex: Iniciante Focado)",
      "description": "string — descricao personalizada do perfil",
      "recommended_method": "string — metodo ideal do ebook para esse perfil",
      "recommended_chapter": "number — capitulo do ebook que mais ajuda"
    }
  ],
  "dynamic_analysis_rules": {
    "scoring": "object — regras de pontuacao por resposta",
    "profile_assignment": "object — logica de atribuicao de perfil",
    "personalized_text_templates": "object — templates de texto por perfil"
  },
  "html_path": "string",
  "cta_checkout_url": "string — URL do checkout (Kiwify)",
  "cta_free_url": "string — URL da landing page do lead magnet"
}
```

Consumido por: **Pipeline final** (FORGE) e **campanha de trafego**

## Quality Gate OMEGA

- **Task type:** implementation
- **Threshold:** >= 90
- **Evidencias exigidas:**
  - 5 perguntas com proposito claro e declarado
  - Resultado personalizado baseado nas respostas (nao generico)
  - CTA natural para checkout (sem pressao, sem urgencia falsa)
  - Link para lead magnet gratuito visivel (para quem nao quer comprar)
  - 100% white hat (zero dark patterns)
  - HTML responsivo e funcional

## Checklist de Validacao

- [ ] Exatamente 5 perguntas, cada uma com proposito claro
- [ ] Pergunta 1: identifica dor/situacao atual (connection)
- [ ] Pergunta 2: elimina objecao de tempo
- [ ] Pergunta 3: acolhe qualquer nivel de experiencia (empathy)
- [ ] Pergunta 4: elimina objecao de investimento/recursos
- [ ] Pergunta 5: personaliza recomendacao (preferencia de metodo)
- [ ] Opcoes de resposta naturais (nao tendenciosas)
- [ ] Perfis de resultado definidos (minimo 3)
- [ ] Cada perfil tem metodo recomendado e capitulo do ebook
- [ ] Texto do resultado e personalizado (nao copy-paste entre perfis)
- [ ] CTA para checkout presente e claro
- [ ] Link "Prefiro comecar gratis" visivel e funcional
- [ ] ZERO dark patterns: sem contadores fake, sem urgencia falsa, sem escassez artificial
- [ ] HTML/CSS/JS standalone (funciona sem servidor)
- [ ] Responsivo (mobile-first)
- [ ] Artefatos salvos: quiz-presell-spec.json + quiz.html

## API Contract

```yaml
# Gerar quiz pre-sell
endpoint: "/infoprodutos/quiz/generate"
method: "POST"
input_schema:
  type: "object"
  properties:
    avatar: { type: "object" }
    strategy: { type: "object" }
    outline: { type: "object" }
  required: ["avatar", "strategy", "outline"]

# Status
status_endpoint: "/infoprodutos/quiz/status"
webhooks: ["on_start", "on_complete", "on_error"]
```

## Entregaveis

- `quiz-presell-spec.json` — especificacao completa do quiz (API-ready)
- `quiz.html` — quiz interativo standalone (HTML/CSS/JS)
- `quiz-results.json` — perfis de resultado e regras de analise

Diretorio: `squads/infoprodutos/output/{pipeline_id}/phase-8-quiz-presell/`

## Nota de Implementacao

O quiz DEVE funcionar como arquivo HTML standalone (sem backend). Toda a logica de scoring e atribuicao de perfil roda em JavaScript no client-side. As URLs de checkout e lead magnet sao configuradas como variaveis no topo do script.

## Timeout

10 minutos
