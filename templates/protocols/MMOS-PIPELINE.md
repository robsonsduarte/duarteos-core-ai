# MMOS — System Core AI: Pipeline de Criação de Clones Mentais

> Documentação de engenharia reversa baseada no processo revelado por Alan Nicolas.
> Versão de referência do pipeline: ~v4-v5 (Alan reporta estar na v13-v14 atualmente).
> Este documento define a arquitetura, etapas, artefatos e estrutura de pastas para criação automatizada de clones mentais.

---

## 1. VISÃO GERAL DA ARQUITETURA

### 1.1 O Que É Um Clone Mental

Um clone mental não é um prompt. É um **sistema completo** composto por:

- **54+ prompts** organizados hierarquicamente
- **12+ agentes** especializados por função
- **80+ checklists** de validação de qualidade
- **Hooks de QA** (scripts Python/Node) para validação de dados
- **Protocolo de testes** onde o clone testa a si mesmo
- **PRD (Product Requirements Document)** gerado automaticamente
- **Todo/Checklist autônomo** baseado no modelo Manus

> "Eu não defini uma instrução. Nessa versão aqui eu tinha 54 prompts, 12 agentes, acho que eram 80 checklists. Então não é tipo assim, não tem como fazer isso aqui com um prompt, não existe."

### 1.2 Princípio Fundamental

Cada clone mental criado deve **servir um propósito específico** ao ICP (Ideal Customer Profile). O sistema gera automaticamente subtarefas que analisam os propósitos que o clone poderia servir ao público-alvo.

### 1.3 Infraestrutura de Squads

O sistema opera com **squads especializados** que se coordenam:

| Squad | Função no Pipeline |
|-------|-------------------|
| **Squad ETL** | Coleta e extração de dados brutos |
| **Squad de Análise** | Processamento linguístico e semântico |
| **Squad de Inferência** | Geração de drivers e frameworks |
| **Squad QA** | Validação de integridade e qualidade |
| **Squad de Testes** | Protocolo de auto-teste do clone |

---

## 2. ARQUITETURA DE PASTAS DO CLONE

```
squads/{mind-name}/
├── config.yaml                          ← Manifesto do clone (metadados, score apex, status)
├── prd/
│   └── {mind-name}-prd.md               ← PRD completo gerado pela IA
├── todo/
│   └── {mind-name}-todo.md              ← Todo list autônomo (modelo Manus)
├── archive/
│   ├── agents/                          ← Versões anteriores de agentes
│   ├── prompts/                         ← Prompts aposentados
│   └── README.md
├── artifacts/
│   ├── cognitive/
│   │   ├── cognitive-architecture.yaml  ← Arquitetura cognitiva completa
│   │   ├── core-beliefs.yaml            ← Crenças centrais (Core Beliefs/CORBS)
│   │   ├── core-elements.yaml           ← Obsessões e elementos centrais
│   │   ├── artefatos-cognitivos.yaml    ← Frameworks/heurísticas/modelos mentais usados
│   │   └── decision-behaviors.yaml      ← Padrões de tomada de decisão
│   ├── behavioral/
│   │   ├── behavioral-patterns.yaml     ← Padrões comportamentais completos (1000+ linhas)
│   │   ├── compassion-triggers.yaml     ← Gatilhos de compaixão com evidências
│   │   ├── indignation-scenarios.yaml   ← Cenários de indignação mapeados
│   │   └── contradictions.yaml          ← Contradições comportamentais com evidências A/B
│   ├── linguistic/
│   │   ├── micro-units.yaml             ← Micro-unidades interpretativas neurais
│   │   ├── signature-phrases.yaml       ← Assinatura de frases extraída
│   │   └── communication-templates.yaml ← Templates de comunicação
│   └── narrative/
│       ├── storytelling-validation.yaml ← Validação da narrativa pessoal
│       ├── history-analysis.yaml        ← Análise da história completa
│       └── self-told-story.yaml         ← A história que a pessoa conta de si mesma
├── checklists/
│   ├── data-collection-checklist.md     ← Gate de qualidade da coleta
│   ├── extraction-checklist.md          ← Gate de qualidade da extração
│   ├── inference-checklist.md           ← Gate de qualidade das inferências
│   ├── clone-test-protocol.md           ← Protocolo de auto-teste
│   └── integrity-checklist.md           ← Gate de integridade de dados
├── data/
│   ├── raw/                             ← Dados brutos coletados
│   │   ├── tweets/
│   │   ├── interviews/
│   │   ├── articles/
│   │   ├── books/
│   │   ├── podcasts/
│   │   ├── blog-posts/
│   │   ├── news-sites/
│   │   └── twitter-threads/
│   ├── processed/                       ← Dados processados
│   │   ├── transcriptions/
│   │   ├── normalized/
│   │   └── fragments/                   ← Fragmentos semânticos
│   └── contents/                        ← Conteúdos vinculados (livros, canais, etc.)
├── drivers/
│   ├── driver-map.yaml                  ← Mapeamento completo de drivers/motivadores
│   ├── driver-correlations.yaml         ← Correlações entre drivers (com cálculos)
│   ├── driver-strength.yaml             ← Força de cada driver (fórmula matemática)
│   └── driver-network.yaml              ← Rede de drivers correlacionados
├── frameworks/
│   └── {framework-name}/               ← Um diretório por framework extraído
│       ├── {framework-name}.yaml
│       └── examples.yaml
├── lib/
│   ├── loader.js                        ← Biblioteca de carregamento
│   └── hooks/
│       ├── validate-yaml.py             ← Hook QA: valida estrutura YAML
│       └── validate-integrity.py        ← Hook QA: valida integridade de dados
├── logs/
│   ├── creation-log.md                  ← Log completo de criação
│   ├── test-log.md                      ← Log de testes
│   └── qa-log.md                        ← Log de quality assurance
├── prompts/
│   ├── main/                            ← Prompt principal do clone
│   ├── sub-agents/                      ← Prompts dos subagentes especializados
│   └── tasks/                           ← Prompts de tarefas específicas
├── system-components/
│   └── {mind-name}-system.yaml          ← Mapeamento de como a mente pensa
├── tasks/
│   ├── extract-signature-phrases.md     ← Tarefa: extrair assinatura de frases (~1200 linhas)
│   └── ...                              ← Tarefas específicas do clone
├── templates/
│   └── communication/                   ← Templates de como o clone se comunica
├── tests/
│   ├── protocol.md                      ← Protocolo de testes
│   └── results/                         ← Resultados dos auto-testes
├── voices/
│   └── {mind-name}-voice.yaml           ← Tom de voz extraído
└── workflows/
    ├── wf-collection.yaml               ← Pipeline de coleta
    ├── wf-extraction.yaml               ← Pipeline de extração
    ├── wf-inference.yaml                 ← Pipeline de inferência
    ├── wf-validation.yaml               ← Pipeline de validação
    └── wf-test.yaml                     ← Pipeline de auto-teste
```

---

## 3. PIPELINE DE CRIAÇÃO — AS 7 FASES

### FASE 1: COLETA DE DADOS (Squad ETL)

**Objetivo:** Captar todo material bruto da mente-alvo.

**Fontes de coleta por analista especializado:**

| Analista do Squad ETL | Fonte | Output |
|----------------------|-------|--------|
| Analista de YouTube | Vídeos, transcrições | `data/raw/interviews/` |
| Analista de Medium | Artigos no Medium | `data/raw/articles/` |
| Analista de Livros | Livros autorais | `data/raw/books/` |
| Analista de Blog | Posts em blogs | `data/raw/blog-posts/` |
| Analista de Notícias | Sites de notícias | `data/raw/news-sites/` |
| Analista de Twitter | Threads do Twitter | `data/raw/twitter-threads/` |
| Analista de Podcasts | Entrevistas em áudio | `data/raw/podcasts/` |

**Regra crítica:** NÃO utilizar fontes que interpretem sobre a pessoa. Usar APENAS fontes primárias (material produzido pela própria pessoa ou, no caso histórico, o documento fonte original).

**Output:** Diretório `data/raw/` populado com todos os materiais brutos categorizados.

---

### FASE 2: SEPARAÇÃO E EXTRAÇÃO LINGUÍSTICA

**Objetivo:** Separar conteúdos e extrair fragmentos semânticos.

**Processo:**

1. **Separação de conteúdos por tipo** — Cada material bruto é classificado
2. **Vinculação a Contents** — Um livro é um content, um canal YouTube é um content
3. **Extração linguística** — Separação em **micro-unidades interpretativas neurais** (fragmentos semânticos mínimos com significado autônomo)

> "Esses chunks não são baseados em tamanho de conteúdo. Esses chunks são baseados no ensino semântico."

**Output:**
- `data/processed/fragments/` — Fragmentos semânticos indexados
- `data/processed/transcriptions/` — Transcrições normalizadas
- `data/contents/` — Mapeamento de conteúdos vinculados à mente

---

### FASE 3: VALIDAÇÃO COMPORTAMENTAL E NARRATIVA

**Objetivo:** Validar se os fragmentos representam comportamento real ou narrativa pessoal.

**Dois tipos de validação:**

1. **Validação de comportamento** — O fragmento evidencia um padrão comportamental real e observável?
2. **Validação de storytelling** — O fragmento faz parte da história que a pessoa conta de si mesma?

**Reconstrução narrativa:**
- Motor de inferência reconstrói a "história que a pessoa se conta"
- Identifica discrepâncias entre comportamento observado e narrativa declarada
- Mapeia contradições comportamentais com evidências A e B

**Output:**
- `artifacts/narrative/storytelling-validation.yaml`
- `artifacts/behavioral/contradictions.yaml`
- `artifacts/narrative/self-told-story.yaml`

---

### FASE 4: INFERÊNCIA DE DRIVERS E RECONSTRUÇÃO DE FRAMEWORKS

**Objetivo:** Gerar inferência dos motivadores e reconstruir os frameworks mentais.

**4.1 Inferência de Drivers**

Drivers são os motivadores profundos. O sistema calcula:
- **Correlação entre drivers** (ex: abertura para experiência ↔ curiosidade = 0.32)
- **Força de cada driver** (fórmula matemática)
- **Rede de drivers correlacionados**
- **Classificação de performance** (Gold, Silver, Bronze)

**4.2 Reconstrução de Frameworks (Artefatos Cognitivos)**

O sistema identifica e cataloga as ferramentas mentais:
- Frameworks, Heurísticas, Modelos mentais
- Cruzamento com catálogo de 1000+ artefatos cognitivos

**Output:**
- `drivers/` — Todos os arquivos de drivers
- `frameworks/{framework-name}/` — Frameworks individuais
- `artifacts/cognitive/artefatos-cognitivos.yaml`

---

### FASE 5: CRIAÇÃO DE SYSTEM COMPONENTS

**Objetivo:** Mapear COMO a mente pensa (não apenas O QUE pensa).

| Componente | Arquivo | Descrição |
|-----------|---------|-----------|
| Arquitetura cognitiva | `cognitive-architecture.yaml` | Como a mente processa informação |
| Crenças centrais (CORBS) | `core-beliefs.yaml` | Core Beliefs que governam decisões |
| Elementos centrais | `core-elements.yaml` | Obsessões e foco primário |
| Padrões comportamentais | `behavioral-patterns.yaml` | 1000+ linhas de padrões mapeados |
| Gatilhos emocionais | `compassion-triggers.yaml` | O que ativa cada emoção |
| Cenários de indignação | `indignation-scenarios.yaml` | 12+ cenários mapeados |
| Padrões de decisão | `decision-behaviors.yaml` | Como toma decisões |
| Templates de comunicação | `communication-templates.yaml` | Como se comunica |
| Assinatura de frases | `signature-phrases.yaml` | Padrão linguístico único |

**Output:**
- `system-components/{mind-name}-system.yaml`
- Todo o diretório `artifacts/` populado

---

### FASE 6: GERAÇÃO DO PRD E AUTO-ORGANIZAÇÃO

**Objetivo:** Criar documentação de projeto e auto-gestão do clone.

**6.1 PRD gerado automaticamente**
**6.2 Todo List autônomo (modelo Manus)**

**Output:**
- `prd/{mind-name}-prd.md`
- `todo/{mind-name}-todo.md`

---

### FASE 7: PROTOCOLO DE TESTES E QA

**Objetivo:** Validar qualidade e fidelidade do clone.

- **Auto-teste:** O clone testa a si mesmo iterativamente
- **Logging contínuo:** Cada ação gera log acompanhado pelo QA
- **Hooks de validação:** Script Python valida integridade YAML
- **Assinatura de agente:** Todo documento criado vai com assinatura de qual agente fez
- **Score mínimo:** 95/100 para aprovação

**Output:**
- `tests/protocol.md`
- `tests/results/`
- `logs/` — Todos os logs populados

---

## 4. FORMATO DE DADOS — YAML vs JSON

| Critério | YAML | JSON |
|---------|------|------|
| Legibilidade humana | Alta | Média |
| Consumo de tokens | Baixo | Alto |
| Garantia de escrita correta pela IA | Média (tab sensível) | Alta |
| Risco de quebra | Um tab errado quebra tudo | Mais resiliente |

**Mitigação do risco YAML:** Hook de QA (Python) valida toda estrutura YAML após criação.

---

## 5. SISTEMA DE LOOPING AUTÔNOMO (OMEGA)

Cada workflow de cada squad se torna um **sistema auto-imputável de tarefas e resoluções**, automatizado em loop até resolver o que foi determinado, seguindo o processo específico já desenhado.

- Cada fase é validada pelo OMEGA antes de avançar
- Se não atingir threshold → loop de refinamento (max 3x)
- Se não atingir após 3x → escala ao humano ou outro agente
- Routing horizontal (paralelo) ou vertical (sequencial)

---

## 6. config.yaml — MANIFESTO DO CLONE

```yaml
clone:
  name: "{Nome da Mente}"
  version: "1.0.0"
  pipeline_version: "1"
  created_at: "{timestamp}"
  score_apex: 0.0
  status: "draft"
  archetype: ""
  complexity_level: ""
  purpose:
    primary: ""
    icp_fit: ""
    use_cases: []
  sources:
    primary_only: true
    types: []
    language: ""
  agents:
    main: "{mind-name}"
    sub_agents: []
  components:
    cognitive_architecture: false
    core_beliefs: false
    behavioral_patterns: false
    drivers: false
    frameworks: false
    communication_templates: false
    voice: false
    contradictions: false
  qa:
    minimum_score: 95
    hooks_enabled: true
    auto_test: true
    logging: true
```

---

*Documento de referência do pipeline MMOS para o DuarteOS Core AI.*
*Baseado em extração semântica da transcrição de Alan Nicolas.*
