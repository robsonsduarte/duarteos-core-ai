# Task: Phase 5 — Production (Producao de Conteudo)

## Objetivo

Escrever todos os capitulos do ebook seguindo o outline, com copy persuasiva, exemplos praticos e estrutura HCER (Hook, Conteudo, Exercicio, Resumo). Compilar manuscrito completo.

## Agente Responsavel

**SCRIBE** (content-writer) — modelo opus

## Pre-condicoes

- Phase 4 (Architecture) concluida com OMEGA >= 85
- Outline completo disponivel com plano de implementacao

## Depends On

- `phase-4-architecture`

## Input Esperado

```json
{
  "outline": "object — output completo da fase 4",
  "strategy": "object — output da fase 3",
  "avatar": "object — avatar da fase 2"
}
```

Para escrita de capitulo individual:
```json
{
  "outline": "object — output completo da fase 4",
  "chapter_number": "number — capitulo a escrever",
  "strategy": "object — output da fase 3",
  "avatar": "object — avatar da fase 2",
  "previous_chapter_path": "string | null"
}
```

## Output Esperado

Por capitulo:
```json
{
  "chapter_number": "number",
  "title": "string",
  "content_md": "string",
  "word_count": "number",
  "pages_estimated": "number",
  "sections_written": "number",
  "has_hook": true,
  "has_exercise": true,
  "has_summary": true,
  "has_bridge": true,
  "chapter_path": "string",
  "quality_checks": {
    "word_count_ok": "boolean",
    "structure_complete": "boolean",
    "tone_consistent": "boolean",
    "examples_included": "boolean"
  }
}
```

Consolidado (write-all):
```json
{
  "total_chapters": "number",
  "chapters_written": "number",
  "total_word_count": "number",
  "total_pages_estimated": "number",
  "chapters": [
    {
      "number": "number",
      "title": "string",
      "word_count": "number",
      "path": "string"
    }
  ],
  "manuscript_path": "string",
  "quality_summary": {
    "all_chapters_complete": "boolean",
    "total_word_count_ok": "boolean",
    "all_structures_complete": "boolean",
    "tone_consistent": "boolean"
  }
}
```

Consumido por: **Phase 6 — Design & Delivery** (CANVAS)

## Quality Gate OMEGA

- **Task type:** implementation
- **Threshold:** >= 90
- **Evidencias exigidas:**
  - Todos os capitulos do outline escritos
  - Cada capitulo com estrutura HCER completa
  - Word count total >= 15.000 palavras
  - Word count por capitulo >= 2.000 palavras
  - Tom consistente ao longo de todos os capitulos
  - Exemplos praticos em cada capitulo (minimo 2)
  - Exercicios em cada capitulo
  - Bridges entre capitulos (exceto ultimo)

## Checklist de Validacao

- [ ] Todos os capitulos do outline escritos (nenhum faltando)
- [ ] Cada capitulo tem hook de abertura (pergunta, historia ou dado)
- [ ] Cada capitulo tem conteudo com secoes claras e subtitulos
- [ ] Cada capitulo tem minimo 2 exemplos praticos
- [ ] Cada capitulo tem exercicio/acao pratica
- [ ] Cada capitulo tem resumo com bullet points
- [ ] Cada capitulo (exceto ultimo) tem bridge para o proximo
- [ ] Word count total >= 15.000 palavras
- [ ] Word count por capitulo >= 2.000 palavras
- [ ] Tom consistente (profissional, acessivel, acionavel)
- [ ] Portugues BR natural (sem portugalismos, sem anglicismos desnecessarios)
- [ ] Nenhum dado ou estatistica inventado
- [ ] Manuscrito completo compilado (full-manuscript.md)
- [ ] Artefatos salvos: chapter-{NN}.md + full-manuscript.md

## API Contract

```yaml
# Escrita de capitulo individual
endpoint: "/infoprodutos/production/write-chapter"
method: "POST"
input_schema:
  type: "object"
  properties:
    outline: { type: "object" }
    chapter_number: { type: "number" }
    strategy: { type: "object" }
    avatar: { type: "object" }
    previous_chapter_path: { type: "string" }
  required: ["outline", "chapter_number", "strategy", "avatar"]

# Escrita de todos os capitulos
endpoint_all: "/infoprodutos/production/write-all"
method: "POST"
input_schema:
  type: "object"
  properties:
    outline: { type: "object" }
    strategy: { type: "object" }
    avatar: { type: "object" }
  required: ["outline", "strategy", "avatar"]

# Status da producao
status_endpoint: "/infoprodutos/production/status"
webhooks: ["on_start", "on_chapter_complete", "on_complete", "on_error"]
```

## Entregaveis

- `chapter-01.md` ... `chapter-{NN}.md` — capitulos individuais
- `full-manuscript.md` — manuscrito completo (todos concatenados)

Diretorio: `squads/infoprodutos/output/{pipeline_id}/phase-5-production/`

## Nota de Implementacao

O SCRIBE DEVE escrever um capitulo por vez para evitar estouro de contexto. A ordem de escrita segue o `implementation_plan.writing_order` do outline. Apos escrever cada capitulo, salva o arquivo e le o capitulo anterior para manter continuidade.

## Timeout

5 minutos por capitulo | 30 minutos total
