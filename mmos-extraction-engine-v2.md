# MMOS EXTRACTION ENGINE v2.0 — EDIÇÃO DEFINITIVA
## Motor de Extração de Alta Fidelidade para Clones Mentais
### Corrigido com base nos diagramas e estrutura de pastas reais do MMOS

> **Versão:** 2.0 — Reconstruída a partir de screenshots do sistema real
> **Meta de fidelidade:** ≥ 95%
> **Diferença da v1.0:** Fases corrigidas (6 fases, não 7), entidades de banco de dados reais mapeadas,
> estrutura de pastas real do squad `copy/` como referência, e Fase 6 (Recomendação) revelada.

---

## PARTE 0 — MAPA REAL DAS 6 FASES DO PIPELINE

Os diagramas revelam que o pipeline real tem **6 fases** (não 7), com entidades de dados específicas em cada uma. As cores indicam o tipo de armazenamento: **vermelho/coral = tabela quente (computação intensiva)**, **roxo = tabela de evidências**, **teal/ciano = tabela de entidade principal**, **azul = catálogo externo**, **branco/cinza = tabela relacional/auxiliar**.

```
═══════════════════════════════════════════════════════════════════════════
                        PIPELINE REAL — 6 FASES
═══════════════════════════════════════════════════════════════════════════

FASE 1 — COLETA
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐
  │ Podcasts │  │ Artigos  │  │  Tweets  │  │ Entrevistas │
  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘
       │             │             │                │
       └─────────────┴──────┬──────┴────────────────┘
                            │
                     ┌──────▼──────┐
                     │ ETL Pipeline│
                     └──────┬──────┘
                            │
                       ┌────▼────┐
                       │contents │  ← DB: tabela de conteúdos coletados
                       └────┬────┘
                            │
════════════════════════════╪═══════════════════════════════════════════

FASE 2 — EXTRAÇÃO
                            │
                  ┌─────────▼─────────┐
                  │Extração Linguística│
                  └───┬───────────┬───┘
                      │           │
                ┌─────▼─────┐ ┌───▼──────┐
                │   mius    │ │fragments │  ← DB: micro-unidades + fragmentos
                │  (coral)  │ │          │
                └─────┬─────┘ └──────────┘
                      │
                ┌─────▼─────┐
                │ Validação │  ← Decisão: válido ou rejeitado
                └──┬─────┬──┘
                   │     │
            ┌──────▼┐  ┌─▼────────┐
            │MIUs OK│  │Rejeitados│
            └──┬────┘  └──────────┘
               │
═══════════════╪═══════════════════════════════════════════════════════

FASE 3 — INFERÊNCIA
               │
       ┌───────▼────────┐
       │Motor de Inferên.│
       └───┬─────────┬──┘
           │         │
     ┌─────▼──────┐ ┌▼──────────────────┐
     │mind_drivers│ │miu_driver_evidence│  ← DB: drivers + evidências MIU↔driver
     │  (coral)   │ │     (roxo)        │
     └──┬──────┬──┘ └───────────────────┘
        │      │
  ┌─────▼──────────────┐  ┌──────▼──┐
  │driver_relationships│  │ drivers │  ← DB: relações entre drivers + catálogo
  └────────────────────┘  │ (teal)  │
                          └─────────┘
                               │
═══════════════════════════════╪════════════════════════════════════════

FASE 4 — MAPEAMENTO
                               │
       ┌───────────────────────▼──┐
       │    mapping_systems       │  ← DB: sistemas de mapeamento disponíveis
       └──────────┬───────────────┘
                  │
       ┌──────────▼───────────────┐
       │    system_components     │  ← DB: componentes do sistema (CORBS, arch, etc.)
       └──────────┬───────────────┘
                  │
       ┌──────────▼───────────────┐
       │   component_driver_map   │  ← DB: mapa componente ↔ driver
       └──────────┬───────────────┘
                  │
       ┌──────────▼───────────────┐
       │      Mapeamento          │  ← Processo: cruza tudo
       └─────┬──────────────┬─────┘
             │              │
  ┌──────────▼──────────┐ ┌─▼────────────────────┐
  │mind_component_scores│ │mind_system_mappings   │
  │      (coral)        │ │                       │
  └──────────┬──────────┘ └──────────┬────────────┘
             │                       │
═════════════╪═══════════════════════╪═════════════════════════════════

FASE 5 — PERFIL
             │                       │
             └───────────┬───────────┘
                         │
              ┌──────────▼───────────┐
              │   Perfil Agregado    │  ← Processo: agrega tudo
              └──────────┬───────────┘
                         │
                    ┌────▼────┐
                    │  minds  │  ← DB: a mente final (teal = entidade principal)
                    │ (teal)  │
                    └────┬────┘
                         │
                    ┌────▼──────┐
                    │mind_tools │  ← DB: ferramentas cognitivas da mente
                    └───────────┘
                         │
═════════════════════════╪═════════════════════════════════════════════

FASE 6 — RECOMENDAÇÃO
                         │
           ┌─────────────┼──────────────────┐
           │             │                  │
      ┌────▼────┐  ┌─────▼──────────────┐  │
      │  tools  │  │tool_driver_affinit.│  │
      │ (azul)  │  │     (coral)        │  │
      └────┬────┘  └─────────┬──────────┘  │
           │                 │              │
           │    ┌────────────▼───┐          │
           │    │ tool_relations │          │
           │    └────────┬───────┘          │
           │             │                  │
           └──────┬──────┘                  │
                  │                         │
           ┌──────▼──────┐                  │
           │ Match Engine │◄────────────────┘
           └──┬────────┬──┘
              │        │
    ┌─────────▼──┐  ┌──▼──────────────┐
    │Recommended │  │Development Gaps │
    │   Tools    │  │                 │
    └────────────┘  └─────────────────┘

═══════════════════════════════════════════════════════════════════════
```

---

## PARTE 1 — ENTIDADES DE BANCO DE DADOS DO PIPELINE

Os diagramas revelam **15 entidades de dados** organizadas por fase:

```yaml
database_schema:

  # ═══ FASE 1: COLETA ═══
  contents:
    description: "Conteúdos brutos coletados de todas as fontes"
    type: "storage"
    fields_inferidos:
      - id
      - mind_id
      - source_type       # podcast, artigo, tweet, entrevista, livro, blog, thread
      - source_url
      - raw_content
      - language
      - collected_at
      - collector_agent    # qual agente ETL coletou

  # ═══ FASE 2: EXTRAÇÃO ═══
  mius:
    description: "Micro-Unidades Interpretativas Neurais — fragmentos semânticos atômicos"
    type: "hot_compute"    # coral = computação intensiva
    fields_inferidos:
      - id
      - content_id         # FK → contents
      - mind_id
      - text
      - semantic_type      # comportamental, linguístico, narrativo, decisório
      - timestamp_start    # para vídeo/áudio
      - timestamp_end
      - validation_status  # pending, validated, rejected
      - layer              # 1=raw, 2=fragment, 3=essence, 4=actionable (Forte)

  fragments:
    description: "Fragmentos processados e indexados"
    type: "storage"
    fields_inferidos:
      - id
      - miu_id            # FK → mius
      - content_id
      - fragment_text
      - context
      - tags

  # ═══ FASE 3: INFERÊNCIA ═══
  drivers:
    description: "Catálogo mestre de drivers/motivadores"
    type: "entity"         # teal = entidade principal
    fields_inferidos:
      - id
      - name
      - description
      - category           # cognitivo, emocional, comportamental, social
      - base_rate          # frequência na população geral (Kahneman)

  mind_drivers:
    description: "Drivers específicos atribuídos a uma mente"
    type: "hot_compute"    # coral
    fields_inferidos:
      - id
      - mind_id
      - driver_id          # FK → drivers
      - strength           # força calculada (fórmula proprietária)
      - confidence         # confiança na inferência
      - performance_tier   # gold, silver, bronze

  miu_driver_evidence:
    description: "Evidências que ligam MIUs a drivers — rastreabilidade completa"
    type: "evidence"       # roxo = tabela de evidências
    fields_inferidos:
      - id
      - miu_id            # FK → mius
      - driver_id         # FK → drivers
      - mind_id
      - evidence_text
      - evidence_strength  # quão forte é esta evidência
      - source_reference   # citação exata

  driver_relationships:
    description: "Correlações e relações entre drivers"
    type: "relational"
    fields_inferidos:
      - id
      - driver_a_id       # FK → drivers
      - driver_b_id       # FK → drivers
      - correlation        # -1.0 a 1.0
      - relationship_type  # causal, correlacional, antagônico
      - mind_id           # pode ser global ou per-mind

  # ═══ FASE 4: MAPEAMENTO ═══
  mapping_systems:
    description: "Sistemas de mapeamento disponíveis (Eneagrama, MBTI, Big Five, etc.)"
    type: "catalog"
    fields_inferidos:
      - id
      - name               # Big Five, MBTI, Eneagrama, etc.
      - version
      - components         # lista de componentes do sistema

  system_components:
    description: "Componentes individuais de cada sistema de mapeamento"
    type: "storage"
    fields_inferidos:
      - id
      - mapping_system_id  # FK → mapping_systems
      - name               # ex: "Openness to Experience", "INTJ", "Tipo 5"
      - description
      - scale_min
      - scale_max

  component_driver_map:
    description: "Mapa que liga componentes de sistemas a drivers"
    type: "relational"
    fields_inferidos:
      - id
      - component_id      # FK → system_components
      - driver_id         # FK → drivers
      - affinity_score    # quão forte é a relação
      - direction         # positivo, negativo

  mind_component_scores:
    description: "Scores da mente em cada componente de cada sistema"
    type: "hot_compute"    # coral
    fields_inferidos:
      - id
      - mind_id
      - component_id      # FK → system_components
      - score              # valor no sistema (ex: 0.85 em Openness)
      - confidence
      - evidence_count     # quantas evidências suportam

  mind_system_mappings:
    description: "Mapeamentos completos da mente por sistema"
    type: "storage"
    fields_inferidos:
      - id
      - mind_id
      - mapping_system_id  # FK → mapping_systems
      - profile_summary    # perfil textual completo
      - calculated_at

  # ═══ FASE 5: PERFIL ═══
  minds:
    description: "A mente finalizada — entidade principal do sistema"
    type: "entity"         # teal = entidade principal
    fields_inferidos:
      - id
      - name
      - status             # draft, active, premium, archived
      - score_apex
      - archetype
      - complexity_level
      - version
      - created_at
      - profile_aggregated # perfil completo agregado

  mind_tools:
    description: "Ferramentas cognitivas que a mente utiliza"
    type: "relational"
    fields_inferidos:
      - id
      - mind_id
      - tool_id            # FK → tools
      - proficiency         # quão bem a mente usa esta ferramenta
      - evidence_count
      - source              # como foi identificado: inferido, declarado, observado

  # ═══ FASE 6: RECOMENDAÇÃO ═══
  tools:
    description: "Catálogo mestre de ferramentas cognitivas (artefatos cognitivos)"
    type: "catalog"        # azul = catálogo externo
    fields_inferidos:
      - id
      - name               # ex: "First Principles", "Inversão", "Analogia"
      - category           # framework, heurística, modelo mental
      - description
      - difficulty_level
      - prerequisites       # ferramentas que deve dominar antes

  tool_driver_affinities:
    description: "Afinidade entre ferramentas e drivers — qual ferramenta serve qual driver"
    type: "hot_compute"    # coral
    fields_inferidos:
      - id
      - tool_id            # FK → tools
      - driver_id          # FK → drivers
      - affinity_score     # quão útil é esta ferramenta para este driver
      - context             # em qual contexto a afinidade é válida

  tool_relations:
    description: "Relações entre ferramentas (pré-requisitos, complementares, etc.)"
    type: "relational"
    fields_inferidos:
      - id
      - tool_a_id          # FK → tools
      - tool_b_id          # FK → tools
      - relation_type       # prerequisite, complementary, alternative, synergistic
```

---

## PARTE 2 — ESTRUTURA REAL DE PASTAS (Squad `copy/` como referência)

Os screenshots revelam a estrutura EXATA de um squad em produção:

```
mmos/
└── squads/
    └── copy/                              ← Squad de copywriting
        ├── agents/                        ← Agentes ativos (1 arquivo .md por mente)
        │   ├── john-carlton.md
        │   ├── jon-benson.md
        │   ├── parris-lampropoulos.md
        │   ├── robert-collier.md
        │   ├── ry-schwartz.md
        │   ├── stefan-georgi.md
        │   └── todd-brown.md
        │
        ├── archive/                       ← Agentes aposentados e versões anteriores
        │   ├── agents/
        │   └── README.md
        │
        ├── authority/                     ← Material de autoridade e provas sociais
        │
        ├── checklists/                    ← Gates de qualidade por técnica/mente
        │   ├── avatar-research-checklist.md
        │   ├── bullet-quality-checklist.md
        │   ├── carlton-simplicity-checklist.md
        │   ├── cold-vs-warm-webinar-checklist.md
        │   ├── collier-letter-checklist.md
        │   ├── copy-quality-checklist.md
        │   ├── copysearch-checklist.md
        │   ├── copywriter-agent-creation-checklist.md
        │   ├── copywriter-quality-checklist.md
        │   ├── email-infotainment-checklist.md
        │   ├── hopkins-audit-checklist.md
        │   ├── magalog-checklist.md
        │   ├── pre-call-email-validation.md
        │   ├── rmbc-checklist.md
        │   ├── schwartz-diagnosis-checklist.md
        │   ├── soap-opera-checklist.md
        │   └── sugarman-30-triggers.md
        │
        ├── data/                          ← Base de conhecimento estática (DNAs, KBs, extrações)
        │   ├── boron-letters-collier-dna.yaml
        │   ├── copywriting-kb.md
        │   └── jeff-walker-plf-extraction.md
        │
        ├── docs/                          ← Documentação do squad
        │
        ├── frameworks/                    ← Frameworks POR MENTE (diretório por copywriter)
        │   ├── bencivenga/
        │   │   ├── 7x-research.yaml
        │   │   ├── 12-marketing-maxims.yaml
        │   │   ├── 29-marketing-bullets.yaml
        │   │   ├── 80-20-rule.yaml
        │   │   ├── ad-a-day.yaml
        │   │   ├── credo-technique.yaml
        │   │   ├── fascinations.yaml
        │   │   ├── gifted-product.yaml
        │   │   ├── persuasion-equation.yaml
        │   │   └── proof-elements.yaml
        │   ├── halbert/
        │   ├── kennedy/
        │   ├── makepeace/
        │   ├── schwartz/
        │   └── sugarman/
        │
        ├── lib/                           ← Biblioteca de carregamento
        │   └── loader.md
        │
        ├── phrases/                       ← Frases-assinatura extraídas por mente
        │
        ├── projects/                      ← Projetos ativos do squad
        │
        ├── reference/                     ← Material de referência
        │
        ├── scripts/                       ← Scripts de automação (hooks, validação)
        │
        ├── swipe/                         ← Swipe files (exemplos reais de copy)
        │
        ├── swipe-sources/                 ← Fontes dos swipes (metadados, links, contexto)
        │
        ├── tasks/                         ← Tarefas executáveis (prompts de ação)
        │   ├── analyze-mental-conversation.md
        │   ├── apply-sugarman-triggers.md
        │   ├── audit-copy-hopkins.md
        │   ├── audit-landing-page.md
        │   ├── avatar-research.md
        │   ├── blend.md
        │   ├── build-authority-arsenal.md
        │   ├── copy-debate.md
        │   ├── copysearch.md
        │   ├── create-abandoned-cart.md
        │   ├── create-ad-copy.md
        │   ├── create-ad-script.md
        │   ├── create-big-idea.md
        │   ├── create-bullets.md
        │   ├── create-call-script.md
        │   └── ... (20+ tasks)
        │
        ├── templates/                     ← Templates reutilizáveis
        │
        └── voice/                         ← Tom de voz por persona
```

---

## PARTE 3 — AS 6 FASES COM AS 5 AUTORIDADES INTEGRADAS

### FASE 1: COLETA

```yaml
fase_1_coleta:
  objetivo: "Captar todo material bruto da mente-alvo via ETL Pipeline"
  
  inputs:
    - Podcasts
    - Artigos
    - Tweets
    - Entrevistas
    - Livros
    - Blog posts
    - Twitter threads
    - News sites
  
  processo: "ETL Pipeline"
  
  output_db: "contents"
  output_fs: "data/"
  
  # ═══ ALLEN (GTD) ═══
  allen_application:
    capture: >
      Cada fonte é uma inbox. Todos os analistas ETL despejam material bruto
      no sistema sem filtrar. A captura é exaustiva e agnóstica.
    clarify: >
      Para cada peça coletada:
      ❶ É fonte primária (produzida pela pessoa)? → Aceita
      ❷ É fonte secundária (sobre a pessoa)? → REJEITA com log
      ❸ Está completo (sem truncamento)? → Se não, recoletar
      ❹ Idioma correto? → Se não, traduzir e preservar original
    organize: >
      Cada conteúdo recebe classificação por tipo (source_type)
      e é vinculado à entidade contents no DB com metadados completos.
    reflect: "Weekly review: gaps de cobertura? Fontes novas disponíveis?"
    engage: "Próxima ação clara: seguir para Fase 2 ou ampliar coleta"

  # ═══ FORTE (CODE) ═══
  forte_application:
    capture: "Tudo entra como Layer 1 (Captured Notes) — sem edição"
    organize: "Classificação por source_type, não por tema"
    rule: "NUNCA editar o material bruto. Preservar integridade total."

  # ═══ DEMING (PDSA) ═══
  deming_cycle:
    plan:
      hypothesis: "Fontes selecionadas cobrem ≥90% do corpus disponível"
      metrics:
        coverage_score: "% fontes coletadas vs total existente"
        source_diversity: "≥4 tipos diferentes"
        temporal_span: "≥50% período atividade pública"
    do: "Squad ETL executa coleta com todos os analistas"
    study: "Calcular coverage, identificar gaps"
    act: "Se abaixo → ativar analistas adicionais. Se acima → Gate Gawande"

  # ═══ KAHNEMAN ═══
  kahneman_protocol:
    - "Viés de disponibilidade: NÃO priorizar fontes mais acessíveis (ex: YouTube) sobre menos acessíveis (ex: livros)"
    - "Ancoragem: NÃO começar pela fonte mais famosa da pessoa"
    - "Viés de confirmação: documentar pré-concepções do operador e isolá-las do processo"

  # ═══ GAWANDE (Gate 1→2) ═══
  gate_checklist:
    type: "DO-CONFIRM"
    kill_items: [1, 3]
    items:
      - id: 1
        critical: true
        check: "Coverage score ≥ 90%?"
      - id: 2
        critical: false
        check: "Mínimo 4 tipos diferentes de fonte?"
      - id: 3
        critical: true
        check: "ZERO fontes secundárias/interpretativas na base?"
      - id: 4
        critical: false
        check: "Material bruto preservado intacto?"
      - id: 5
        critical: false
        check: "Span temporal documentado?"
```

### FASE 2: EXTRAÇÃO

```yaml
fase_2_extracao:
  objetivo: "Extrair micro-unidades interpretativas neurais e fragmentos semânticos"
  
  input_db: "contents"
  
  processo: "Extração Linguística"
  
  outputs_db:
    - "mius"           # Micro-Unidades Interpretativas Neurais
    - "fragments"      # Fragmentos processados
  
  sub_processo: "Validação"
  
  outputs_validacao:
    validated: "MIUs OK"     # Avança para Fase 3
    rejected: "Rejeitados"   # Logado e arquivado
  
  # ═══ ALLEN (GTD) ═══
  allen_application:
    clarify: >
      Para cada MIU extraída, decisão binária:
      ❶ Tem significado autônomo? (pode ser entendida sem contexto)
         → SIM: validated → MIUs OK
         → NÃO: rejected → Rejeitados (com log de razão)
      ❷ Classificação por tipo semântico:
         → comportamental / linguístico / narrativo / decisório / framework
    organize: >
      MIUs validadas são organizadas por tipo semântico.
      Contextos GTD atribuídos: @validar, @inferir, @incubar

  # ═══ FORTE (Progressive Summarization) ═══
  forte_application:
    layer_1: "Texto bruto integral do conteúdo → data/raw/"
    layer_2: "MIUs extraídas — trechos relevantes → DB mius (validation_status=validated)"
    layer_3: "Essência destilada de cada MIU → campo essence em mius"
    layer_4: "Insight acionável → gerado na Fase 4 após inferência"
    rule: "Cortes são SEMÂNTICOS, não por tamanho. Cada MIU = 1 unidade de ensino completa."
    intermediate_packets:
      - "Cada MIU validada é um Intermediate Packet reutilizável"
      - "MIUs podem alimentar múltiplos drivers, frameworks e componentes"

  # ═══ DEMING (PDSA) ═══
  deming_cycle:
    plan:
      hypothesis: "Fragmentos extraídos representam micro-unidades semânticas reais"
      metrics:
        fragmentation_quality: "≥95% dos MIUs têm significado autônomo"
        semantic_ratio: "≥90% cortes semânticos vs arbitrários"
        rejection_rate: "Taxa de rejeição documentada e analisada"
    do: "Extração linguística de todo contents"
    study: "Amostragem de 50 MIUs — validar qualidade manualmente"
    act: "Se abaixo → recalibrar critérios de corte → re-executar"

  # ═══ KAHNEMAN ═══
  kahneman_protocol:
    - "Fragmentação de julgamento: agente de extração NÃO julga importância — apenas corta"
    - "Agente de validação é DIFERENTE do agente de extração (avaliação independente)"
    - "Viés de saliência: MIUs 'boring' são tão importantes quanto MIUs 'dramatic'"

  # ═══ GAWANDE (Gate 2→3) ═══
  gate_checklist:
    type: "DO-CONFIRM"
    kill_items: [1, 2]
    items:
      - id: 1
        critical: true
        check: "Fragmentation quality ≥ 95%?"
      - id: 2
        critical: true
        check: "Progressive Summarization completa (layers 1-3)?"
      - id: 3
        critical: false
        check: "Hook de validação YAML executou sem erros?"
      - id: 4
        critical: false
        check: "Taxa de rejeição documentada e justificada?"
      - id: 5
        critical: false
        check: "Assinatura de agente em cada MIU?"
```

### FASE 3: INFERÊNCIA

```yaml
fase_3_inferencia:
  objetivo: "Inferir drivers/motivadores e criar evidências MIU↔Driver"
  
  input_db: "mius (validated)"
  
  processo: "Motor de Inferência"
  
  outputs_db:
    - "mind_drivers"          # Drivers específicos da mente (coral)
    - "miu_driver_evidence"   # Evidências MIU↔Driver (roxo)
    - "driver_relationships"  # Correlações entre drivers
    - "drivers"               # Catálogo atualizado (teal)
  
  # ═══ O QUE O MOTOR DE INFERÊNCIA FAZ ═══
  inference_engine:
    step_1: >
      Para cada MIU validada, o motor pergunta:
      "Que motivador/driver explica este comportamento/declaração/decisão?"
    step_2: >
      Gera registros em miu_driver_evidence vinculando MIU ↔ Driver
      com strength de evidência e referência exata à fonte.
    step_3: >
      Agrega evidências por driver → calcula força (strength) e
      confiança (confidence) → gera mind_drivers.
    step_4: >
      Calcula correlações entre drivers da mente →
      gera driver_relationships.
    step_5: >
      Classifica drivers em tiers de performance (gold/silver/bronze)
      baseado em força + confiança + frequência.

  # ═══ ALLEN (GTD) ═══
  allen_application:
    clarify: >
      Cada driver inferido é uma "next action" para o sistema:
      "Este driver tem evidência suficiente para ser confirmado?"
      → SIM (≥2 MIUs): Confirmar
      → NÃO (1 MIU): Incubar (@incubar) — pode ser confirmado com mais dados
    reflect: "Review: drivers incubados podem ser confirmados com novas MIUs?"

  # ═══ FORTE ═══
  forte_application:
    layer_4_generation: >
      Aqui nasce a Layer 4 (Insight Acionável) do Forte.
      Cada mind_driver com tier gold ou silver gera uma regra operacional
      que o clone vai usar para agir.
    para_mapping:
      projects: "Drivers sendo ativamente investigados"
      areas: "Drivers confirmados que definem a mente"
      resources: "Evidências e correlações de referência"
      archives: "Drivers descartados (com log)"

  # ═══ DEMING (PDSA) ═══
  deming_cycle:
    plan:
      hypothesis: "Drivers inferidos predizem ≥90% dos comportamentos observados"
      metrics:
        predictive_accuracy: "≥90%"
        false_positive_rate: "<5% — drivers sem evidência comportamental"
        evidence_density: "≥2.0 MIUs por driver"
    do: "Motor de inferência processa todas as MIUs validadas"
    study: >
      Teste retroativo: para cada padrão comportamental mapeado,
      existe um driver que o explica? Se não → gap.
      Para cada driver inferido, existe comportamento observável? Se não → falso positivo.
    act: "Se abaixo → recalibrar motor ou retornar à Fase 1 para mais dados"

  # ═══ KAHNEMAN ═══
  kahneman_protocol:
    protocol_base_rate: >
      Antes de atribuir um driver a uma mente, verificar:
      qual é a base rate deste driver na população geral?
      Se 80% das pessoas têm "busca por significado", isso não é diferenciador.
      O campo base_rate na tabela drivers fornece esta informação.
    protocol_independent_eval: >
      3 agentes independentes executam inferência sobre as mesmas MIUs.
      Suas atribuições MIU→Driver são comparadas ANTES de mediação.
      Coeficiente de concordância inter-agente ≥ 0.85.
    protocol_premortem: >
      "Se este driver estiver errado, o que acontece com o clone?"
      Mapear impacto de cada falso positivo e falso negativo.

  # ═══ GAWANDE (Gate 3→4) ═══
  gate_checklist:
    type: "DO-CONFIRM"
    kill_items: [1, 2, 4]
    items:
      - id: 1
        critical: true
        check: "Predictive accuracy ≥ 90%?"
      - id: 2
        critical: true
        check: "Cada mind_driver tem ≥2 evidências em miu_driver_evidence?"
      - id: 3
        critical: false
        check: "False positive rate < 5%?"
      - id: 4
        critical: true
        check: "3 agentes independentes concordam (≥ 0.85)?"
      - id: 5
        critical: false
        check: "driver_relationships calculados e documentados?"
      - id: 6
        critical: false
        check: "Drivers classificados em tiers (gold/silver/bronze)?"
```

### FASE 4: MAPEAMENTO

```yaml
fase_4_mapeamento:
  objetivo: "Mapear a mente contra sistemas de classificação e gerar scores por componente"
  
  inputs_db:
    - "mind_drivers"
    - "driver_relationships"
    - "mapping_systems"        # Catálogo: Big Five, MBTI, Eneagrama, etc.
    - "system_components"      # Componentes de cada sistema
    - "component_driver_map"   # Relações componente↔driver
  
  processo: "Mapeamento"
  
  outputs_db:
    - "mind_component_scores"  # Scores em cada componente (coral)
    - "mind_system_mappings"   # Perfis completos por sistema

  # ═══ O QUE O MAPEAMENTO FAZ ═══
  mapping_process:
    step_1: >
      Carrega mapping_systems disponíveis (Big Five, MBTI, Eneagrama, 
      e sistemas proprietários como o catálogo de 1000+ artefatos cognitivos).
    step_2: >
      Para cada system_component, usa component_driver_map para
      calcular o score da mente baseado nos mind_drivers identificados.
    step_3: >
      Gera mind_component_scores: a pontuação da mente em cada dimensão
      de cada sistema (ex: Openness = 0.92, Conscientiousness = 0.78).
    step_4: >
      Agrega scores em mind_system_mappings: o perfil completo
      da mente em cada sistema de mapeamento.

  # ═══ FORTE ═══
  forte_application:
    distillation: >
      Este é o ponto onde toda a informação dispersa é DESTILADA
      em perfis concretos. O mapeamento é a Layer 3→4 do Forte
      aplicada em escala: de milhares de MIUs → dezenas de scores.
    para_mapping:
      areas: "Scores que definem permanentemente a mente"
      resources: "Sistemas de mapeamento como referência"

  # ═══ DEMING (PDSA) ═══
  deming_cycle:
    plan:
      hypothesis: "Scores calculados são internamente consistentes (≥95%)"
      metrics:
        internal_consistency: "Scores não se contradizem entre sistemas"
        component_coverage: "100% dos componentes relevantes têm score"
    do: "Executar mapeamento completo"
    study: "Verificar consistência entre sistemas — um INTJ com Openness baixo faz sentido?"
    act: "Se inconsistente → investigar drivers conflitantes → recalibrar"

  # ═══ KAHNEMAN ═══
  kahneman_protocol:
    - "Halo effect: score alto em um componente NÃO deve influenciar outros componentes"
    - "Fragmentação: cada componente é calculado INDEPENDENTEMENTE dos outros"
    - "Ancoragem: não começar pelo sistema mais familiar do operador"

  # ═══ GAWANDE (Gate 4→5) ═══
  gate_checklist:
    type: "DO-CONFIRM"
    kill_items: [1, 2]
    items:
      - id: 1
        critical: true
        check: "Todos os componentes relevantes têm score?"
      - id: 2
        critical: true
        check: "Consistência interna entre sistemas ≥ 95%?"
      - id: 3
        critical: false
        check: "Cruzamento com catálogo de artefatos cognitivos completo?"
      - id: 4
        critical: false
        check: "mind_system_mappings gerados para todos os sistemas?"
```

### FASE 5: PERFIL

```yaml
fase_5_perfil:
  objetivo: "Agregar tudo em um Perfil Agregado e gerar a entidade minds final"
  
  inputs_db:
    - "mind_component_scores"
    - "mind_system_mappings"
    - "mind_drivers"
    - "driver_relationships"
  
  processo: "Perfil Agregado"
  
  outputs_db:
    - "minds"                  # A mente final (teal = entidade principal)
    - "mind_tools"             # Ferramentas cognitivas da mente

  # ═══ O QUE O PERFIL AGREGADO FAZ ═══
  aggregation_process:
    step_1: >
      Cruza mind_component_scores + mind_system_mappings + mind_drivers
      para gerar um perfil unificado da mente.
    step_2: >
      Calcula score_apex (relevância para público), archetype,
      complexity_level e status.
    step_3: >
      Gera a entidade em minds — a "mente" está NASCIDA no sistema.
    step_4: >
      Identifica mind_tools: quais ferramentas cognitivas do catálogo
      de 1000+ artefatos esta mente utiliza? Com que proficiência?
      Vincula via mind_tools.

  # ═══ FORTE ═══
  forte_application:
    express: >
      Este é o E de CODE (Express). Todo o conhecimento destilado
      agora se materializa em uma entidade acionável: a mente que
      pode operar em squads, debates, e produção de conteúdo.

  # ═══ DEMING (PDSA) ═══
  deming_cycle:
    plan:
      hypothesis: "Perfil agregado representa a mente com fidelity_score ≥ 95%"
      metrics:
        fidelity_score:
          formula: "(L×0.20) + (B×0.30) + (C×0.15) + (K×0.20) + (V×0.15)"
          L: "linguistic_fidelity"
          B: "behavioral_fidelity"
          C: "contradiction_handling"
          K: "framework_application"
          V: "voice_authenticity"
        minimum_per_component: 85
        minimum_composite: 95
    do: "Gerar perfil agregado + entidade minds + mind_tools"
    study: >
      Blind test com material não visto:
      Dado cenário novo, o clone responde como a pessoa responderia?
    act: "Se abaixo → identificar dimensão fraca → retornar à fase responsável"

  # ═══ KAHNEMAN ═══
  kahneman_protocol:
    blind_test: >
      Apresentar ao clone material que NUNCA viu. Se não generaliza
      corretamente → o perfil é superficial (overfitting aos dados).
    noise_audit: >
      Re-executar o perfil com os mesmos inputs. Se varia
      significativamente → há ruído no processo (reprodutibilidade ≥ 0.90).
    premortem_final: >
      "É outubro de 2026. Descobrimos que este clone é uma caricatura.
      O que deu errado?" → Documentar cenários de falha.

  # ═══ GAWANDE (Gate 5→6) ═══
  gate_checklist:
    type: "DO-CONFIRM"
    kill_items: [1, 2, 3]
    items:
      - id: 1
        critical: true
        check: "Fidelity score composto ≥ 95%?"
      - id: 2
        critical: true
        check: "Blind test passou?"
      - id: 3
        critical: true
        check: "Pré-mortem executado e documentado?"
      - id: 4
        critical: false
        check: "mind_tools populado com proficiency scores?"
      - id: 5
        critical: false
        check: "config.yaml atualizado com status 'active'?"
```

### FASE 6: RECOMENDAÇÃO

```yaml
fase_6_recomendacao:
  objetivo: >
    Dado uma mente ativa, recomendar ferramentas cognitivas para desenvolvimento
    e identificar gaps de capacidade. Esta fase transforma o clone de um
    'retrato estático' em um 'sistema de crescimento'.
  
  inputs_db:
    - "minds"
    - "mind_tools"
    - "tools"                    # Catálogo mestre de 1000+ artefatos (azul)
    - "tool_driver_affinities"   # Afinidade ferramenta↔driver (coral)
    - "tool_relations"           # Relações entre ferramentas
  
  processo: "Match Engine"
  
  outputs:
    - "Recommended Tools"        # Ferramentas que a mente deveria desenvolver
    - "Development Gaps"         # Lacunas identificadas no perfil cognitivo

  # ═══ O QUE O MATCH ENGINE FAZ ═══
  match_engine:
    step_1: >
      Carrega mind_drivers e mind_tools da mente.
    step_2: >
      Cruza drivers da mente com tool_driver_affinities:
      "Quais ferramentas do catálogo têm alta afinidade com os
      drivers desta mente mas que ela AINDA NÃO utiliza?"
    step_3: >
      Verifica tool_relations para sequenciamento:
      "Esta ferramenta recomendada tem pré-requisitos?
      A mente já domina os pré-requisitos?"
    step_4: >
      Gera Recommended Tools: ferramentas ordenadas por
      relevância × afinidade × viabilidade (pré-reqs atendidos).
    step_5: >
      Gera Development Gaps: áreas onde a mente tem drivers fortes
      mas ferramentas fracas ou ausentes.

  # ═══ APLICAÇÕES PRÁTICAS ═══
  use_cases:
    for_clone_operation: >
      Clone de copywriter com driver forte em "persuasão emocional"
      mas sem framework de "fascinations" → Recomenda frameworks/bencivenga/fascinations.yaml
    for_development: >
      Mente com gap em "pensamento analítico" → Recomenda ferramentas
      de First Principles, Inversão, e Steel Manning.
    for_squad_composition: >
      Se uma mente tem gap X, buscar outra mente no catálogo
      que tem força X → Formar squad complementar.

  # ═══ DEMING (PDSA) ═══
  deming_cycle:
    plan:
      hypothesis: "Recomendações são relevantes e os gaps são reais"
      metrics:
        recommendation_relevance: "Ferramenta recomendada realmente serve o driver?"
        gap_accuracy: "O gap identificado é real ou artefato do mapeamento?"
    do: "Match Engine executa cruzamento completo"
    study: "Validar com blind test: dar o gap ao clone e ver se ele tropeça nele"
    act: "Se recomendações irrelevantes → recalibrar affinities"
```

---

## PARTE 4 — ESTRUTURA GENÉRICA DE PASTAS PARA QUALQUER MENTE

Baseado no padrão real do squad `copy/`, a estrutura genérica para criação de QUALQUER mente:

```
squads/{squad-name}/
├── agents/                          ← 1 arquivo .md por mente ativa
│   ├── {mind-name-1}.md
│   ├── {mind-name-2}.md
│   └── {mind-name-n}.md
│
├── archive/                         ← Versões anteriores (PARA do Forte)
│   ├── agents/
│   └── README.md
│
├── authority/                       ← Provas sociais, credenciais, validações
│
├── checklists/                      ← Gates Gawande (READ-DO e DO-CONFIRM)
│   ├── {technique}-checklist.md     ← Checklists por técnica/método
│   ├── {mind-name}-checklist.md     ← Checklists específicos por mente
│   ├── quality-checklist.md         ← Checklist geral de qualidade
│   └── agent-creation-checklist.md  ← Checklist para criação de novos agentes
│
├── data/                            ← Base de conhecimento estática
│   ├── {source}-dna.yaml            ← DNAs extraídos (ex: boron-letters-collier-dna.yaml)
│   ├── {domain}-kb.md               ← Knowledge bases do domínio
│   └── {extraction}-extraction.md   ← Extrações de metodologias
│
├── docs/                            ← Documentação do squad
│
├── frameworks/                      ← Frameworks POR MENTE (1 diretório cada)
│   └── {mind-name}/
│       ├── {framework-1}.yaml
│       ├── {framework-2}.yaml
│       └── {framework-n}.yaml
│
├── lib/                             ← Biblioteca de carregamento e helpers
│   └── loader.md
│
├── phrases/                         ← Frases-assinatura extraídas
│
├── projects/                        ← Projetos ativos
│
├── reference/                       ← Material de referência
│
├── scripts/                         ← Hooks e automações
│
├── swipe/                           ← Exemplos reais (swipe files)
│
├── swipe-sources/                   ← Fontes e metadados dos swipes
│
├── tasks/                           ← Tarefas executáveis (prompts de ação)
│   ├── analyze-mental-conversation.md
│   ├── audit-{technique}.md
│   ├── create-{deliverable}.md
│   ├── {blend/debate/research}.md
│   └── ... (20+ tasks por squad)
│
├── templates/                       ← Templates reutilizáveis
│
├── voice/                           ← Tom de voz por persona
│
└── workflows/                       ← Pipelines multi-step
    ├── wf-{workflow-name}.yaml
    └── ...
```

---

## PARTE 5 — INTEGRAÇÃO FINAL: 5 AUTORIDADES × 6 FASES × 15 ENTIDADES

```
                    COLETA    EXTRAÇÃO   INFERÊNCIA   MAPEAMENTO   PERFIL    RECOMENDAÇÃO
                    Fase 1    Fase 2     Fase 3       Fase 4       Fase 5    Fase 6
                  ┌─────────┬──────────┬────────────┬────────────┬─────────┬─────────────┐
ALLEN (GTD)       │Captura  │Clarifica │Classifica  │    —       │   —     │    —        │
Workflow          │exaustiva│MIU↔tipo  │driver→conf │            │         │             │
                  │agnóstica│sem filtro │/incubar    │            │         │             │
                  ├─────────┼──────────┼────────────┼────────────┼─────────┼─────────────┤
FORTE (CODE)      │Layer 1  │Layer 2-3 │Layer 4     │Destilação  │EXPRESS  │   PARA      │
Memória Externa   │Capture  │Organize  │Distill     │Scores      │A mente  │   mapping   │
                  │         │+Distill  │Actionable  │            │nasce    │             │
                  ├─────────┼──────────┼────────────┼────────────┼─────────┼─────────────┤
DEMING (PDSA)     │Coverage │Fragment  │Predictive  │Consistency │Fidelity │Relevance    │
Loops             │≥90%     │quality   │accuracy    │≥95%        │score    │Match        │
                  │         │≥95%      │≥90%        │            │≥95%     │accuracy     │
                  ├─────────┼──────────┼────────────┼────────────┼─────────┼─────────────┤
GAWANDE           │Gate 1→2 │Gate 2→3  │Gate 3→4    │Gate 4→5    │Gate 5→6 │Gate Final   │
Checklists        │DO-CONF  │DO-CONF   │DO-CONF     │DO-CONF     │DO-CONF  │DO-CONF      │
                  │kill:1,3 │kill:1,2  │kill:1,2,4  │kill:1,2    │kill:1-3 │kill:1       │
                  ├─────────┼──────────┼────────────┼────────────┼─────────┼─────────────┤
KAHNEMAN          │Anti     │Fragment. │Base rate   │Halo effect │Blind    │Gap          │
Anti-Viés         │confirm. │de julg.  │Independent │Independ.   │test     │validation   │
                  │Anti     │Saliência │Pré-mortem  │            │Noise    │             │
                  │anchor   │Independ. │            │            │audit    │             │
                  └─────────┴──────────┴────────────┴────────────┴─────────┴─────────────┘

ENTIDADES DB:      contents  mius       mind_drivers  mapping_sys  minds     Recommended
                             fragments  miu_driver_ev sys_compnts  mind_tools  Tools
                                        driver_relat  comp_drv_map            Dev Gaps
                                        drivers       mind_comp_sc
                                                      mind_sys_map
                                                                    tools
                                                                    tool_drv_aff
                                                                    tool_relations
```

---

## PARTE 6 — FÓRMULA COMPOSTA DE FIDELIDADE

```yaml
fidelity_score:
  formula: "F = (L × 0.20) + (B × 0.30) + (C × 0.15) + (K × 0.20) + (V × 0.15)"
  
  L_linguistic: 0.20
  B_behavioral: 0.30
  C_contradiction: 0.15
  K_framework: 0.20
  V_voice: 0.15
  
  thresholds:
    minimum_per_component: 85
    minimum_composite: 95
    maximum_component_deviation: 10
  
  measurement_sources:
    L: "artifacts/linguistic/ + voice/ → mius por semantic_type=linguístico"
    B: "artifacts/behavioral/ + mind_drivers → mind_component_scores"
    C: "contradictions mapeadas → blind test com cenários contraditórios"
    K: "frameworks/ + mind_tools → test de aplicação em problema novo"
    V: "voice/ + phrases/ → blind test texto clone vs texto real"
```

---

## PARTE 7 — CHECKLISTS DE CRIAÇÃO DE AGENTE

O screenshot revela `copywriter-agent-creation-checklist.md`, indicando que existe um checklist específico para transformar uma mente em agente operacional. Estrutura inferida:

```yaml
agent_creation_checklist:
  type: "READ-DO"
  name: "Criação de Novo Agente a partir de Mente Clonada"
  
  pre_conditions:
    - "Mente existe em DB minds com status='active'"
    - "Fidelity score ≥ 95%"
    - "mind_tools populado"
  
  steps:
    - id: 1
      action: "Gerar arquivo agents/{mind-name}.md com system prompt completo"
      includes:
        - "Core beliefs (CORBS)"
        - "Behavioral patterns"
        - "Communication templates"
        - "Voice signature"
        - "Framework references"
        - "Contradiction handling instructions"
    
    - id: 2
      action: "Criar checklists específicos para a mente"
      examples: "hopkins-audit-checklist.md, schwartz-diagnosis-checklist.md"
    
    - id: 3
      action: "Popular frameworks/{mind-name}/ com todos os frameworks extraídos"
      format: "YAML — um arquivo por framework"
    
    - id: 4
      action: "Extrair e documentar phrases/ específicas"
      detail: "Assinaturas de frases, padrões linguísticos, expressões recorrentes"
    
    - id: 5
      action: "Definir voice/ com tom de voz calibrado"
    
    - id: 6
      action: "Criar tasks/ específicas onde esta mente excela"
      examples: "audit-copy-hopkins.md, apply-sugarman-triggers.md"
    
    - id: 7
      action: "Testar agente em cenários reais"
      test_protocol:
        - "Gerar output em tarefa conhecida → comparar com original"
        - "Gerar output em tarefa nova → avaliar consistência"
        - "Debate com outro agente → verificar que mantém posição fiel"
    
    - id: 8
      action: "Documentar em data/ qualquer DNA ou extração específica"
      examples: "boron-letters-collier-dna.yaml, jeff-walker-plf-extraction.md"
```

---

## PARTE 8 — O PAPEL DO loader.md

O `lib/loader.md` revelado nos screenshots é o mecanismo que instrui o Cloud Code/Claude Code sobre COMO carregar o squad em contexto. Estrutura funcional:

```yaml
loader_purpose:
  what: "Instrução de carregamento para o runtime"
  when: "Executado toda vez que o squad é invocado"
  how: >
    Define a ordem de carregamento dos arquivos do squad,
    quais agentes estão ativos, quais frameworks carregar
    por padrão, e quais checklists são obrigatórios.

loader_structure:
  load_order:
    1: "agents/{active-agents}.md"      # Personalidades disponíveis
    2: "data/{knowledge-bases}"          # Base de conhecimento
    3: "frameworks/{relevant}/"          # Frameworks por contexto
    4: "checklists/{task-specific}.md"   # Gates de qualidade
    5: "tasks/{current-task}.md"         # Tarefa sendo executada
    6: "voice/{relevant}.yaml"           # Tom de voz se necessário
    7: "templates/{if-needed}"           # Templates se necessário
  
  context_management:
    max_tokens: "Gerenciar janela de 200k tokens"
    priority: "Agente > Task > Checklist > Framework > Data"
    lazy_loading: "Frameworks e data só carregam quando task exige"
```

---

## PARTE 9 — MÉTRICAS CONSOLIDADAS DO ENGINE

```yaml
metrics_dashboard:
  fase_1_coleta:
    coverage_score: "≥ 90%"
    source_diversity: "≥ 4 tipos"
    temporal_span: "≥ 50% atividade pública"
    zero_secondary_sources: "true"

  fase_2_extracao:
    fragmentation_quality: "≥ 95%"
    semantic_ratio: "≥ 0.90"
    progressive_summarization: "layers 1-3 completas"
    rejection_rate: "documentada e justificada"

  fase_3_inferencia:
    predictive_accuracy: "≥ 90%"
    false_positive_rate: "< 5%"
    evidence_density: "≥ 2.0 MIUs por driver"
    inter_agent_agreement: "≥ 0.85"

  fase_4_mapeamento:
    component_coverage: "100%"
    internal_consistency: "≥ 95%"
    catalog_crossref: "completo"

  fase_5_perfil:
    fidelity_score_composite: "≥ 95%"
    no_component_below: "85%"
    blind_test: "passed"
    noise_audit_reproducibility: "≥ 0.90"
    premortem: "executed and documented"

  fase_6_recomendacao:
    recommendation_relevance: "validated"
    gap_accuracy: "confirmed via blind test"
    tool_sequencing: "prerequisites verified"
```

---

*MMOS Extraction Engine v2.0 — Edição Definitiva*
*6 fases reais × 15 entidades DB × 5 autoridades × métricas quantificáveis*
*Reconstruído com base em diagramas e screenshots do sistema em produção.*
