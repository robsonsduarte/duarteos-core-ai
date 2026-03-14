# Stack Tecnica — Squad Infoprodutos

## Plataforma de Venda

| Item | Tecnologia | Detalhes |
|------|-----------|----------|
| Marketplace | Kiwify | Plataforma principal de venda e entrega |
| Pagamento | Kiwify Checkout | Integrado, suporta PIX, cartao, boleto |
| Entrega | Kiwify Members | Area de membros para download |
| Afiliados | Kiwify Affiliates | Programa de afiliados nativo |

### Config Kiwify Esperada

```json
{
  "product_type": "ebook",
  "delivery_method": "download",
  "file_format": "pdf",
  "refund_policy_days": 7,
  "affiliate_commission_percent": 40,
  "checkout_type": "one_step",
  "upsell_enabled": true,
  "order_bump_enabled": true
}
```

## Pipeline de Conversao: Markdown para PDF

### Fluxo Principal

```
Markdown (capitulos) → Merge → Full Manuscript (.md)
                                      ↓
                               HTML + CSS (design system)
                                      ↓
                               PDF (wkhtmltopdf / Puppeteer)
```

### Alternativa Premium: Typst

```
Markdown (capitulos) → Typst Template (.typ)
                              ↓
                         PDF (typst compile)
```

### Ferramentas de Conversao

| Ferramenta | Uso | Prioridade |
|-----------|-----|-----------|
| Typst | Markdown → PDF com tipografia profissional | Primaria |
| Puppeteer/Playwright | HTML/CSS → PDF via headless browser | Secundaria |
| wkhtmltopdf | HTML → PDF (leve, sem headless browser) | Fallback |
| Pandoc | Markdown → HTML intermediario | Auxiliar |

### Typst — Detalhes

```bash
# Instalacao
brew install typst  # macOS
# ou
cargo install typst-cli

# Compilacao
typst compile ebook.typ ebook.pdf
```

Typst permite controle granular de tipografia, layout de paginas, cabecalhos/rodapes, numeracao, margens e estilos visuais — ideal para ebooks profissionais.

## Ferramentas de Pesquisa

| Ferramenta | Agente | Uso |
|-----------|--------|-----|
| WebSearch | RADAR, PRISM | Busca de tendencias, concorrencia, volume |
| WebFetch | RADAR, PRISM | Coleta de paginas de venda, reviews |
| Exa | RADAR | Busca semantica de nichos e trends |
| Apify | PRISM | Scraping de marketplaces (Kiwify, Hotmart) |

### Model Routing para Pesquisa

```
COLETA (haiku):   WebSearch, WebFetch, Exa, Apify
ANALISE (sonnet):  Interpretar dados, sintetizar, classificar
CRIACAO (opus):    Estrategia, outline, conteudo, design
```

## Integracao com API (duarteos-api)

### Endpoints do Squad

Todos os endpoints seguem o padrao REST definido no `squad.yaml`.

### Formato de Request/Response

```typescript
// Request padrao
interface PipelineRequest {
  pipeline_id?: string;  // auto-generated se nao fornecido
  phase: number;
  input: Record<string, unknown>;
  config?: {
    omega_threshold?: number;
    max_retries?: number;
    webhook_url?: string;
  };
}

// Response padrao
interface PipelineResponse {
  pipeline_id: string;
  phase: number;
  phase_name: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  omega_score: number | null;
  output: Record<string, unknown>;
  artifacts: Array<{
    path: string;
    type: "json" | "md" | "pdf" | "html";
    size_bytes: number;
  }>;
  started_at: string;
  completed_at: string | null;
  next_phase: number | null;
}
```

### Webhook Payload

```typescript
interface WebhookPayload {
  event: "on_pipeline_start" | "on_phase_start" | "on_phase_complete" | "on_phase_error" | "on_pipeline_complete" | "on_pipeline_error";
  pipeline_id: string;
  phase: number;
  phase_name: string;
  status: string;
  omega_score: number | null;
  timestamp: string;  // ISO 8601
  data: Record<string, unknown>;
}
```

## Requisitos de Ambiente

| Variavel | Descricao | Obrigatoria |
|---------|-----------|-------------|
| SUPABASE_URL | URL do projeto Supabase | Sim |
| SUPABASE_ANON_KEY | Chave anonima Supabase | Sim |
| KIWIFY_API_KEY | Chave de API Kiwify | Para publicacao |
| EXA_API_KEY | Chave de API Exa.ai | Para pesquisa |
| APIFY_TOKEN | Token Apify | Para scraping |

## Dependencias de Sistema

```bash
# Obrigatoria
typst          # Conversao Markdown/Typst → PDF

# Opcional
pandoc         # Conversao auxiliar
wkhtmltopdf    # Fallback PDF
```
