# Quiz de Pre-sell — {{pipeline_id}}

**Data:** {{date}}
**Agentes:** CANVAS + COMPASS
**Nicho:** {{niche}}

---

## Resumo

- **Titulo do Quiz:** {{quiz_title}}
- **Total de Perguntas:** 5
- **Perfis de Resultado:** {{total_profiles}}
- **Abordagem:** 100% White Hat

---

## Perguntas

{{#each questions}}
### Pergunta {{number}}: {{text}}

| Campo | Valor |
|-------|-------|
| **Proposito** | {{purpose}} |
| **Objetivo Real** | {{purpose_description}} |

**Opcoes:**

| Label | Value | Perfil Favorecido |
|-------|-------|-------------------|
{{#each options}}
| {{label}} | {{value}} | {{profile_map}} |
{{/each}}

---

{{/each}}

## Perfis de Resultado

{{#each result_profiles}}
### {{name}}

- **Descricao:** {{description}}
- **Metodo Recomendado:** {{recommended_method}}
- **Capitulo do Ebook:** Cap. {{recommended_chapter}}
- **Texto Personalizado:** {{personalized_text}}

---

{{/each}}

## Regras de Analise Dinamica

### Scoring

```json
{{scoring_rules}}
```

### Atribuicao de Perfil

```json
{{profile_assignment_rules}}
```

### Templates de Texto Personalizado

```json
{{personalized_text_templates}}
```

---

## CTAs

| CTA | URL | Descricao |
|-----|-----|-----------|
| **Checkout** | {{cta_checkout_url}} | Direciona para compra do ebook |
| **Gratis** | {{cta_free_url}} | "Prefiro comecar gratis" → Landing page do lead magnet |

---

## Regras White Hat

- [ ] Zero contadores fake (sem "X pessoas compraram" inventado)
- [ ] Zero urgencia falsa (sem "oferta expira em 10 minutos")
- [ ] Zero escassez artificial (sem "restam apenas 3 vagas")
- [ ] Zero manipulacao de respostas (opcoes neutras e honestas)
- [ ] Resultado genuinamente personalizado (nao o mesmo texto para todos)
- [ ] Opcao gratuita sempre visivel e acessivel

---

## Artefatos

| Arquivo | Formato | Path |
|---------|---------|------|
| Especificacao | JSON | `quiz-presell-spec.json` |
| Quiz Interativo | HTML | `quiz.html` |
| Perfis de Resultado | JSON | `quiz-results.json` |

---

**OMEGA Score:** {{omega_score}}/100
**Status:** {{status}}
