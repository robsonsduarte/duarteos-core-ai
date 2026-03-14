# Lead Magnet Pratico — {{pipeline_id}}

**Data:** {{date}}
**Agentes:** SCRIBE + CANVAS
**Nicho:** {{niche}}

---

## Resumo

- **Titulo:** {{title}}
- **Metodo Featured:** {{method_featured}}
- **Plataforma Featured:** {{platform_featured}}
- **Resultado Esperado:** {{expected_result}}
- **Tempo para Resultado:** {{time_to_result}}

---

## Metodo Selecionado

| Campo | Valor |
|-------|-------|
| **Metodo** | {{method_featured}} |
| **Plataforma/Ferramenta** | {{platform_featured}} |
| **Capitulo de Origem** | Cap. {{source_chapter_number}} — {{source_chapter_title}} |
| **Por que este metodo** | {{selection_rationale}} |
| **Investimento Inicial** | {{initial_investment}} |
| **Nivel de Dificuldade** | {{difficulty_level}} |

---

## Resultado Esperado

- **O que a pessoa vai conseguir:** {{expected_result}}
- **Em quanto tempo:** {{time_to_result}}
- **Mensuravel?** {{is_measurable}}
- **Exemplo concreto:** {{concrete_example}}

---

## Estrutura de Paginas

| # | Secao | Paginas | Descricao |
|---|-------|---------|-----------|
| 1 | Capa | 1 | Titulo + subtitulo com resultado prometido |
| 2 | Introducao | 1 | "O que voce vai conseguir neste guia" |
| 3 | O Metodo | 1-2 | Contexto e por que funciona |
{{#each steps}}
| {{@index_plus_4}} | Passo {{@index_1}}: {{name}} | {{pages}} | {{description}} |
{{/each}}
| {{final_index}} | Resultado Esperado | 1 | O que deve acontecer |
| {{final_index_plus_1}} | Proximos Passos (CTA) | 1 | Direcionamento para ebook |

**Total de Paginas:** {{total_pages}}

---

## Passo a Passo Detalhado

{{#each steps}}
### Passo {{@index_1}}: {{name}}

**Objetivo:** {{objective}}
**Tempo estimado:** {{estimated_time}}

{{instructions}}

{{/each}}

---

## CTA para Ebook

- **Texto:** {{cta_text}}
- **Target:** {{cta_target}}
- **Tom:** Natural, sem pressao — convite genuino para aprofundamento

---

## Artefatos

| Arquivo | Formato | Path |
|---------|---------|------|
| Especificacao | JSON | `lead-magnet-spec.json` |
| Conteudo | Markdown | `lead-magnet.md` |
| Formatado | HTML | `lead-magnet.html` |
| Final | PDF | `lead-magnet.pdf` |

---

**OMEGA Score:** {{omega_score}}/100
**Status:** {{status}}
