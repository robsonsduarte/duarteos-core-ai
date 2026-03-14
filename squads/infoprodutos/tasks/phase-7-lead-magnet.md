# Task: Phase 7 — Lead Magnet Pratico

## Objetivo

Produzir lead magnet pratico que entrega RESULTADO REAL ao lead. Nao e checklist generica — e um guia standalone com 1 metodo/plataforma do ebook que permite a pessoa obter resultado concreto (ex: ganhar R$ 5-10, criar primeiro conteudo, conseguir primeiro cliente).

## Agentes Responsaveis

**SCRIBE** (content-writer) — redacao do conteudo
**CANVAS** (designer) — design e formatacao HTML

Modelo: opus

## Pre-condicoes

- Phase 5 (Production) concluida com OMEGA >= 90
- Capitulos individuais disponiveis
- Outline disponivel (fase 4) com metodos mapeados
- Strategy disponivel (fase 3) com posicionamento

## Depends On

- `phase-5-production` (precisa do conteudo dos capitulos)

## Logica de Selecao do Metodo

1. Pegar o outline (fase 4) e identificar todos os metodos/estrategias ensinados
2. Selecionar o metodo mais simples e rapido — aquele que:
   - Requer MENOR investimento inicial (idealmente R$ 0)
   - Entrega resultado em MENOR tempo (idealmente < 1 hora)
   - Usa 1 unica plataforma/ferramenta
   - Tem barreira de entrada mais baixa
3. Criar guia standalone com passo a passo completo desse metodo
4. CTA natural no final: "Gostou do resultado? No ebook completo voce encontra mais X metodos..."

## Input Esperado

```json
{
  "outline": "object — output da fase 4 (lista de capitulos e metodos)",
  "strategy": "object — output da fase 3 (posicionamento, avatar, big idea)",
  "chapters": "array — output da fase 5 (capitulos escritos com paths)"
}
```

## Output Esperado

```json
{
  "title": "string",
  "method_featured": "string — qual metodo do ebook e usado",
  "platform_featured": "string — qual plataforma/ferramenta especifica",
  "expected_result": "string — o que a pessoa vai conseguir (ex: R$ 5-10)",
  "time_to_result": "string — tempo para primeiro resultado (ex: 30-60 minutos)",
  "pages": "number",
  "html_path": "string",
  "cta_target": "string — para onde o CTA direciona"
}
```

Consumido por: **Phase 6 — Design & Delivery** (landing page congruente) e **Pipeline final** (FORGE)

## Quality Gate OMEGA

- **Task type:** implementation
- **Threshold:** >= 90
- **Evidencias exigidas:**
  - Resultado real entregue (a pessoa consegue algo concreto ao seguir o guia)
  - Passo a passo completo e acionavel (nao generico)
  - 1 unico metodo/plataforma (foco, sem dispersao)
  - CTA natural para ebook no final (sem ser agressivo)
  - Design profissional e legivel

## Checklist de Validacao

- [ ] Metodo selecionado e o mais simples/rapido do ebook
- [ ] Plataforma/ferramenta especifica nomeada (nao generica)
- [ ] Resultado esperado e concreto e mensuravel (R$ X, Y seguidores, Z clientes)
- [ ] Passo a passo completo — pessoa consegue executar sem conhecimento previo
- [ ] Screenshots/descricoes visuais das telas/interfaces necessarias
- [ ] Tempo para resultado declarado e realista
- [ ] Investimento inicial declarado (idealmente R$ 0)
- [ ] CTA para ebook no final — natural, nao agressivo
- [ ] Titulo atrativo e congruente com resultado prometido
- [ ] HTML formatado e responsivo
- [ ] Artefatos salvos: lead-magnet-spec.json + lead-magnet.html

## API Contract

```yaml
# Gerar lead magnet
endpoint: "/infoprodutos/lead-magnet/generate"
method: "POST"
input_schema:
  type: "object"
  properties:
    outline: { type: "object" }
    strategy: { type: "object" }
    chapters: { type: "array" }
  required: ["outline", "strategy", "chapters"]

# Status
status_endpoint: "/infoprodutos/lead-magnet/status"
webhooks: ["on_start", "on_complete", "on_error"]
```

## Entregaveis

- `lead-magnet-spec.json` — especificacao do lead magnet (API-ready)
- `lead-magnet.md` — conteudo em markdown
- `lead-magnet.html` — HTML formatado e responsivo
- `lead-magnet.pdf` — PDF final (se Typst disponivel)

Diretorio: `squads/infoprodutos/output/{pipeline_id}/phase-7-lead-magnet/`

## Estrutura do Lead Magnet

```
1. Capa (titulo + subtitulo com resultado prometido)
2. Introducao curta (1 pagina): "O que voce vai conseguir neste guia"
3. O Metodo (nome e contexto): por que funciona
4. Passo a Passo Completo:
   - Passo 1: Criar conta na [plataforma] (com link direto)
   - Passo 2: Configurar [X] (com detalhes exatos)
   - Passo 3: Executar [Y] (com exemplos reais)
   - Passo N: Receber/medir resultado
5. Resultado Esperado: o que deve acontecer apos seguir os passos
6. Proximos Passos: "Gostou? No [ebook] voce encontra mais X metodos..." (CTA)
```

## Timeout

15 minutos
