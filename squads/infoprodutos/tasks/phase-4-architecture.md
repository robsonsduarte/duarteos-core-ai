# Task: Phase 4 — Architecture (Arquitetura de Conteudo)

## Objetivo

Criar outline completo do ebook com titulo, capitulos, secoes, exercicios, fluxo narrativo e plano de implementacao para o writer.

## Agente Responsavel

**BLUEPRINT** (content-architect) — modelo opus

## Pre-condicoes

- Phase 3 (Strategy) concluida com OMEGA >= 85
- Estrategia comercial definida

## Depends On

- `phase-3-strategy`

## Input Esperado

```json
{
  "strategy": "object — output completo da fase 3",
  "dossie": "object — output da fase 2",
  "avatar": "object — avatar da fase 2",
  "target_pages": "number — paginas estimadas (default: 40)"
}
```

## Output Esperado

```json
{
  "title": "string",
  "subtitle": "string",
  "premise": "string",
  "target_avatar": "string",
  "total_chapters": "number",
  "estimated_pages": "number",
  "estimated_word_count": "number",
  "chapters": [
    {
      "number": "number",
      "title": "string",
      "focus": "string",
      "sections": [
        {
          "title": "string",
          "description": "string",
          "type": "content | exercise | case_study | framework"
        }
      ],
      "estimated_pages": "number",
      "estimated_words": "number",
      "key_takeaway": "string",
      "exercise": {
        "type": "reflection | action | worksheet | checklist",
        "description": "string"
      },
      "bridge_to_next": "string"
    }
  ],
  "narrative_arc": {
    "opening": "string",
    "rising_action": "string",
    "climax": "string",
    "resolution": "string"
  },
  "implementation_plan": {
    "writing_order": ["number"],
    "priority_chapters": ["number"],
    "estimated_time_per_chapter": "string",
    "style_guidelines": "string",
    "reference_materials": ["string"]
  },
  "bonus_content_suggestions": [
    {
      "name": "string",
      "format": "string",
      "description": "string",
      "complements_chapter": "number"
    }
  ],
  "mind_clone_insights": {
    "joseph_sugarman": "string",
    "luciana_papini": "string",
    "gary_bencivenga": "string"
  },
  "outline_path": "string"
}
```

Consumido por: **Phase 5 — Production** (SCRIBE)

## Quality Gate OMEGA

- **Task type:** planning
- **Threshold:** >= 85
- **Evidencias exigidas:**
  - Titulo validado como headline eficaz (clareza + curiosidade)
  - Minimo 5 capitulos com progressao logica
  - Cada capitulo com key takeaway unico e acionavel
  - Arco narrativo coerente (abertura → desenvolvimento → resolucao)
  - Plano de implementacao suficiente para escrita sem ambiguidade
  - Estimativa de paginas >= target_pages

## Checklist de Validacao

- [ ] Titulo definido (claro + atrativo)
- [ ] Subtitulo explicativo definido
- [ ] Premissa central alinhada com posicionamento da estrategia
- [ ] 5+ capitulos planejados com progressao logica
- [ ] Cada capitulo tem: titulo, foco, secoes, key takeaway, exercicio
- [ ] Arco narrativo definido (opening, rising action, climax, resolution)
- [ ] Estimativa de paginas total >= target_pages (default: 40)
- [ ] Estimativa de palavras total >= 15.000
- [ ] Plano de implementacao com ordem de escrita e style guidelines
- [ ] Bridge entre capitulos planejada
- [ ] Mind clones consultados (Sugarman + Papini + Bencivenga)
- [ ] Artefatos salvos: ebook-outline.json + ebook-outline.md

## API Contract

```yaml
endpoint: "/infoprodutos/architecture/plan"
method: "POST"
input_schema:
  type: "object"
  properties:
    strategy: { type: "object" }
    dossie: { type: "object" }
    avatar: { type: "object" }
    target_pages: { type: "number", default: 40 }
  required: ["strategy", "dossie", "avatar"]
output_schema:
  type: "object"
  properties:
    title: { type: "string" }
    subtitle: { type: "string" }
    premise: { type: "string" }
    total_chapters: { type: "number" }
    estimated_pages: { type: "number" }
    chapters: { type: "array" }
    narrative_arc: { type: "object" }
    implementation_plan: { type: "object" }
    mind_clone_insights: { type: "object" }
    outline_path: { type: "string" }
status_endpoint: "/infoprodutos/architecture/plan/status"
webhooks: ["on_start", "on_complete", "on_error"]
```

## Entregaveis

- `ebook-outline.json` — outline estruturado (API-ready)
- `ebook-outline.md` — outline formatado (leitura humana)

Diretorio: `squads/infoprodutos/output/{pipeline_id}/phase-4-architecture/`

## Timeout

10 minutos
