# Outline do Ebook — {{pipeline_id}}

**Data:** {{date}}
**Agente:** BLUEPRINT (Content Architect)

---

## Dados do Ebook

| Campo | Valor |
|-------|-------|
| **Titulo** | {{title}} |
| **Subtitulo** | {{subtitle}} |
| **Premissa** | {{premise}} |
| **Avatar-alvo** | {{target_avatar}} |
| **Total de Capitulos** | {{total_chapters}} |
| **Paginas Estimadas** | {{estimated_pages}} |
| **Palavras Estimadas** | {{estimated_word_count}} |

---

## Arco Narrativo

| Fase | Descricao |
|------|-----------|
| **Abertura** | {{narrative_arc_opening}} |
| **Desenvolvimento** | {{narrative_arc_rising_action}} |
| **Climax** | {{narrative_arc_climax}} |
| **Resolucao** | {{narrative_arc_resolution}} |

---

## Capitulos

{{#each chapters}}
### Capitulo {{number}}: {{title}}

**Foco:** {{focus}}
**Paginas Estimadas:** {{estimated_pages}} | **Palavras Estimadas:** {{estimated_words}}
**Key Takeaway:** {{key_takeaway}}

#### Secoes

{{#each sections}}
{{@index_1}}. **{{title}}** ({{type}})
   {{description}}

{{/each}}

#### Exercicio

**Tipo:** {{exercise_type}}
{{exercise_description}}

#### Bridge para Proximo Capitulo

{{bridge_to_next}}

---

{{/each}}

## Plano de Implementacao

### Ordem de Escrita

{{#each implementation_plan_writing_order}}
{{@index_1}}. Capitulo {{this}}
{{/each}}

### Capitulos Prioritarios

{{#each implementation_plan_priority_chapters}}
- Capitulo {{this}}
{{/each}}

### Tempo Estimado por Capitulo

{{implementation_plan_estimated_time}}

### Diretrizes de Estilo

{{implementation_plan_style_guidelines}}

### Materiais de Referencia

{{#each implementation_plan_reference_materials}}
- {{this}}
{{/each}}

---

## Sugestoes de Bonus Content

{{#each bonus_content_suggestions}}
### {{name}} ({{format}})
- **Complementa:** Capitulo {{complements_chapter}}
- **Descricao:** {{description}}

{{/each}}

---

## Insights dos Mind Clones

### Joseph Sugarman (Fluxo Narrativo)
{{joseph_sugarman_insight}}

### Luciana Papini (Estrutura Didatica)
{{luciana_papini_insight}}

### Gary Bencivenga (Headlines e Persuasao)
{{gary_bencivenga_insight}}

---

**OMEGA Score:** {{omega_score}}/100
**Status:** {{status}}
