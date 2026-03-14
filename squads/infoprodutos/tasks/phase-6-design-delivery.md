# Task: Phase 6 — Design & Delivery (Design e Entrega)

## Objetivo

Criar design system, especificacao de capa, formatar o manuscrito com layout profissional e produzir o PDF final (ou HTML pronto para conversao).

## Agente Responsavel

**CANVAS** (designer) — modelo opus

## Pre-condicoes

- Phase 5 (Production) concluida com OMEGA >= 90
- Manuscrito completo disponivel (full-manuscript.md)
- Capitulos individuais disponiveis

## Depends On

- `phase-5-production`

## Input Esperado

```json
{
  "chapters": "array — lista de capitulos com paths e metadata",
  "manuscript_path": "string — caminho do full-manuscript.md",
  "strategy": "object — output da fase 3",
  "brand_guidelines": "object (optional) — diretrizes de marca"
}
```

## Output Esperado

```json
{
  "cover_spec": {
    "title": "string",
    "subtitle": "string",
    "author": "string",
    "layout": {
      "title_position": "string",
      "title_alignment": "string",
      "background_type": "string",
      "background_value": "string"
    },
    "visual_concept": "string",
    "ai_image_prompt": "string",
    "dimensions": { "width": "number", "height": "number", "dpi": 300 },
    "colors": {
      "background": "string",
      "title_color": "string",
      "subtitle_color": "string",
      "accent_color": "string"
    },
    "typography": {
      "title_font": "string",
      "title_size": "string",
      "subtitle_font": "string",
      "subtitle_size": "string"
    }
  },
  "design_system": {
    "colors": {
      "primary": "string",
      "primary_light": "string",
      "primary_dark": "string",
      "secondary": "string",
      "background": "string",
      "text": "string",
      "text_muted": "string",
      "heading": "string",
      "accent": "string",
      "border": "string"
    },
    "typography": {
      "heading_font": "string",
      "body_font": "string",
      "mono_font": "string",
      "base_size": "string",
      "line_height": "string",
      "heading_sizes": { "h1": "string", "h2": "string", "h3": "string" }
    },
    "spacing": {
      "page_margin_top": "string",
      "page_margin_bottom": "string",
      "page_margin_inner": "string",
      "page_margin_outer": "string",
      "paragraph_spacing": "string",
      "section_spacing": "string"
    },
    "layout": {
      "page_size": "string",
      "orientation": "portrait",
      "columns": 1,
      "header": { "enabled": "boolean", "content": "string" },
      "footer": { "enabled": "boolean", "content": "page_number" }
    }
  },
  "template_type": "typst | html_css",
  "template_path": "string",
  "html_path": "string | null",
  "pdf_ready": "boolean",
  "pdf_path": "string | null",
  "page_count": "number",
  "output_path": "string"
}
```

Consumido por: **Pipeline final** (FORGE para consolidacao)

## Quality Gate OMEGA

- **Task type:** implementation
- **Threshold:** >= 90
- **Evidencias exigidas:**
  - Design system completo e coerente com posicionamento
  - Capa profissional especificada com prompt AI detalhado
  - Template de formatacao criado (Typst ou HTML/CSS)
  - Layout de paginas definido com margens, tipografia e hierarquia
  - PDF gerado ou HTML pronto para conversao

## Checklist de Validacao

### Ebook
- [ ] Design system definido: cores, tipografia, spacing, layout
- [ ] Paleta de cores coerente com posicionamento e nicho
- [ ] Tipografia legivel (base >= 10pt, line-height >= 1.5)
- [ ] Capa especificada com conceito visual e prompt AI
- [ ] Dimensoes de capa definidas (recomendado: 1600x2560px, 300dpi)
- [ ] Template de formatacao criado (Typst preferido, HTML/CSS fallback)
- [ ] Header e footer definidos (titulo + numeracao de pagina)
- [ ] Margens adequadas para leitura digital e impressao
- [ ] Estilos para blockquotes, callouts, tabelas e listas definidos
- [ ] HTML formatado gerado OU PDF compilado via Typst
- [ ] Artefatos salvos: design-system.json + cover-spec.json + template + output

### Landing Page e Funil
- [ ] Landing page congruente com lead magnet pratico (nao checklist)
- [ ] Sales page com copy persuasiva e CTA claro
- [ ] Upsell page criada
- [ ] Downsell page criada
- [ ] Thank you page com instrucoes de acesso
- [ ] Email sequence de 5 emails (nurture) criada
- [ ] Todas as paginas responsivas e com design system consistente

## API Contract

```yaml
# Design specs
endpoint: "/infoprodutos/design/specs"
method: "POST"
input_schema:
  type: "object"
  properties:
    chapters: { type: "array" }
    strategy: { type: "object" }
    brand_guidelines: { type: "object" }
  required: ["chapters", "strategy"]

# Gerar PDF
endpoint_pdf: "/infoprodutos/design/generate-pdf"
method: "POST"
input_schema:
  type: "object"
  properties:
    manuscript_path: { type: "string" }
    design_system: { type: "object" }
    template_path: { type: "string" }
  required: ["manuscript_path", "design_system", "template_path"]

# Especificacao de capa
endpoint_cover: "/infoprodutos/design/cover"
method: "POST"
input_schema:
  type: "object"
  properties:
    title: { type: "string" }
    subtitle: { type: "string" }
    design_system: { type: "object" }
    positioning: { type: "object" }
  required: ["title", "subtitle", "design_system"]

status_endpoint: "/infoprodutos/design/status"
webhooks: ["on_start", "on_complete", "on_error"]
```

## Entregaveis

### Ebook
- `design-system.json` — design system completo (API-ready)
- `cover-spec.json` — especificacao de capa (API-ready)
- `ebook-template.typ` ou `ebook-template.html` + `ebook-styles.css` — template
- `ebook-final.html` — HTML formatado
- `ebook-final.pdf` — PDF final (se Typst disponivel)

### Landing Page (Lead Magnet)
- `landing-page.html` — landing page congruente com lead magnet pratico
- Landing page vende o lead magnet (guia pratico com resultado real), NAO uma checklist generica
- Copy alinhada com a promessa do lead magnet (resultado concreto em X minutos)

### Sales Page
- `sales-page.html` — pagina de vendas do ebook principal
- Copy persuasiva com headline, sub-headline, bullets, depoimentos, CTA
- Congruente com posicionamento e big idea da fase 3

### Paginas de Funil
- `upsell-page.html` — pagina de upsell pos-checkout
- `downsell-page.html` — pagina de downsell (alternativa ao upsell)
- `thank-you-page.html` — pagina de agradecimento com instrucoes de acesso

### Email Sequence
- `email-sequence.json` — sequencia de 5 emails de nurture (API-ready)
  - Email 1: Boas-vindas + entrega do lead magnet
  - Email 2: Historia/caso de uso + dica pratica
  - Email 3: Objecao principal eliminada + prova social
  - Email 4: Conteudo de valor + soft CTA
  - Email 5: Oferta direta + urgencia real (vagas, preco)

Diretorio: `squads/infoprodutos/output/{pipeline_id}/phase-6-design/`

## Timeout

15 minutos
