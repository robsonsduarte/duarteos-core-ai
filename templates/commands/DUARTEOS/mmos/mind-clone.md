# MMOS Mind Clone — Pipeline de Clonagem Mental de Alta Fidelidade

Crie um agente baseado na mente de um especialista real usando o pipeline MMOS v2 de 6 fases.

**Modo:** Pipeline sequencial — cada fase gera artefato antes de avancar
**Nivel:** Avancado — requer WebSearch, WebFetch
**DNA:** 6 Camadas Cognitivas (Filosofia, Frameworks, Heuristicas, Metodologias, Dilemas, Paradoxos Produtivos)
**Fidelidade-alvo:** >= 95% (formula: F = L*0.20 + B*0.30 + C*0.15 + K*0.20 + V*0.15)
**Autoridades:** Allen (GTD), Forte (CODE), Deming (PDSA), Kahneman (Anti-Vies), Gawande (Gates)
**OMEGA:** Cada fase roda como task OMEGA com loop de refinamento (ver `.claude/protocols/OMEGA.md` Secao 20)
**Protocolo:** `.claude/protocols/MMOS-PIPELINE.md`

## Argumentos

$ARGUMENTS — nome do especialista a clonar (obrigatorio)

Se $ARGUMENTS estiver vazio, pergunte: "Qual especialista voce quer clonar? (nome completo)"

## Descricao

Este e o pipeline MMOS v2 de clonagem mental do DuarteOS. Ele combina:

- **6 fases** reais (Coleta, Extracao, Inferencia, Mapeamento, Perfil, Recomendacao)
- **15 entidades de dados** distribuidas pelas fases
- **5 autoridades** integradas em cada fase
- **Gates Gawande DO-CONFIRM** entre cada transicao de fase
- **6a camada cognitiva:** Paradoxos Produtivos — contradicoes internas que tornam o clone humano
- **Formula de fidelidade composta** com 5 componentes (L, B, C, K, V)
- **Synapse v3** para persistencia de DNA e indices
- **OMEGA v2** para loop de qualidade e circuit breaker

## Canonicalizacao de Entidades

1. **Normalizar nome:** remover acentos, lowercase, hifens entre palavras
   - "Alex Hormozi" -> `alex-hormozi`
   - "Naval Ravikant" -> `naval-ravikant`
2. **Resolver variacoes:** diferentes formas -> mesmo slug
   - "Hormozi", "Alex Hormozi", "Alex H." -> `alex-hormozi`
3. **Deteccao por contexto:** verificar `synapse/minds/*.yaml`
4. **Aliases:** "MrBeast" = "Jimmy Donaldson" -> `mrbeast`
5. **Nome canonico = slug do arquivo:** `.claude/synapse/minds/{slug}.yaml`
6. **Se ambiguo:** perguntar ao usuario

## As 6 Camadas do DNA Mental

| Camada | O que captura | Pergunta-chave |
|--------|-------------|----------------|
| **Filosofia** | Crencas fundamentais, visao de mundo, principios inegociaveis | "O que esta pessoa acredita ser verdade?" |
| **Frameworks** | Passos-a-passo, modelos de pensamento estruturados | "Como esta pessoa organiza e estrutura problemas?" |
| **Heuristicas** | Atalhos mentais, regras de bolso, padroes de decisao rapida | "Que atalhos mentais usa para decidir rapido?" |
| **Metodologias** | Processos repetiveis, sistemas formais, ferramentas | "Que sistemas formais segue consistentemente?" |
| **Dilemas** | Trade-offs, tensoes reconhecidas, zonas cinza, evolucao de posicoes | "Como lida com contradicoes e decisoes impossiveis?" |
| **Paradoxos Produtivos** | Contradicoes que coexistem e geram valor (CAMADA OURO — 35% do score) | "Que verdades aparentemente contraditorias ela sustenta simultaneamente?" |
| **Associações Conceituais** | Pontes entre conceitos aparentemente não relacionados | "Como conecta ideias de domínios diferentes?" |
| **Comunicação Avançada** | Estrutura retórica + estilometria quantitativa | "Como argumenta e qual seu estilo mensurável?" |

**Subcamadas v2.1 (dentro das camadas existentes):**
- **Filosofia:** hierarquia_valores (valores rankeados), conflitos_de_valor, motivacao_profunda (impulsores/medos)
- **Heurísticas:** modelo_social (teoria da mente simulada — confiança default, interpretação de crítica/elogio)

---

## Pipeline: 6 Fases + Fase 0 (Pre-Pipeline)

---

### FASE 0: APEX/ICP GATE (Pre-Pipeline)

**Objetivo:** Verificar viabilidade ANTES de gastar tokens no pipeline completo.
**OMEGA:** NAO e task OMEGA — e pre-condicao de entrada.

#### Procedimento

1. **Canonicalizar nome -> slug**
   - Aplicar regras de canonicalizacao
   - Verificar se clone ja existe em `.claude/synapse/minds/{slug}.yaml`
   - Se JA EXISTE: avisar e sugerir `/DUARTEOS:mmos:mind-update` em vez de mind-clone

2. **Determinar categoria do squad**
   - Categorias validas (kebab-case): copy, marketing, ux-design, ai, tech, business, content, product, saude, juridico
   - Se a categoria nao for clara, perguntar ao usuario

3. **Avaliar APEX Score (Material Disponivel)**
   - Usar WebSearch para avaliar disponibilidade de material primario
   - Pontuar cada tipo de fonte:

   | Fonte | Pontos | Criterio |
   |-------|--------|----------|
   | Livros autorais | 10 | >= 1 livro disponivel |
   | Videos/Podcasts longos (>30min) | 10 | >= 3 videos/podcasts |
   | Entrevistas em profundidade | 10 | >= 2 entrevistas |
   | Artigos/Blog posts autorais | 10 | >= 5 artigos |
   | Tweets/Threads substanciais | 10 | >= 10 threads |
   | Material variado adicional | 10 | Outras fontes primarias |

   **APEX Score = soma dos pontos (max 60)**
   **Threshold: >= 40/60 para prosseguir**

4. **Avaliar ICP Fit**
   - "Este clone serve um proposito especifico ao ICP do DuarteOS?"
   - Score de 1 a 10
   - **Threshold: >= 6/10 para prosseguir**

5. **Decisao**
   - Se APEX >= 40 E ICP >= 6: PROSSEGUIR para Fase 1
   - Se APEX < 40: ABORTAR — "Material insuficiente para clone de alta fidelidade. Score APEX: {X}/60."
   - Se ICP < 6: ABORTAR — "Clone nao serve ao ICP. Score ICP: {X}/10."

6. **Registrar scores no DNA**
   - Criar `.claude/synapse/minds/{slug}.yaml` (skeleton) com apex_score e icp_score

**NAO avance para Fase 1 sem APEX >= 40 e ICP >= 6.**

---

### FASE 1: COLETA

**Objetivo:** Captar todo material bruto da mente-alvo via ETL Pipeline.
**Entidade DB:** `contents`
**OMEGA:** task_type=research, threshold=80, max_iterations=3

#### Procedimento

1. **Pesquisar fontes primarias** usando WebSearch:
   - Livros autorais (titulos, ISBN, links)
   - Videos e podcasts (YouTube, Spotify)
   - Artigos e blog posts (Medium, blog pessoal)
   - Entrevistas em profundidade
   - Tweets e threads (Twitter/X)
   - Palestras e apresentacoes

2. **Para CADA fonte encontrada:**
   - Verificar que e fonte PRIMARIA (produzida pela propria pessoa)
   - REJEITAR fontes secundarias/interpretativas com log
   - Usar WebFetch para extrair conteudo textual
   - Preservar conteudo bruto intacto (Forte Layer 1)
   - Classificar por source_type
   - Registrar em `data/raw/{tipo}/`

3. **Aplicar autoridades:**
   - **Allen:** Captura exaustiva agnostica — tudo entra sem filtro
   - **Forte:** Layer 1 — NUNCA editar material bruto
   - **Deming:** Coverage >= 90%? Diversity >= 4 tipos? Temporal span >= 50%?
   - **Kahneman:** Anti-disponibilidade (nao priorizar YouTube), anti-ancoragem (nao comecar pela fonte mais famosa)

4. **Calcular metricas:**
   - `coverage_score`: % fontes coletadas vs total existente
   - `source_diversity`: quantos tipos diferentes
   - `temporal_span`: % do periodo de atividade publica coberto

#### Gate Gawande 1->2

| # | Critico? | Check |
|---|----------|-------|
| 1 | **SIM** | Coverage score >= 90%? |
| 2 | nao | Minimo 4 tipos diferentes de fonte? |
| 3 | **SIM** | ZERO fontes secundarias/interpretativas? |
| 4 | nao | Material bruto preservado intacto? |
| 5 | nao | Span temporal documentado? |

**Se kill items (1, 3) falharem:** Task OMEGA fica blocked. Ampliar coleta.
**NAO avance para Fase 2 sem gate aprovado.**

---

### FASE 2: EXTRACAO

**Objetivo:** Extrair MIUs (Micro-Unidades Interpretativas Neurais) e fragmentos semanticos.
**Entidades DB:** `mius`, `fragments`
**OMEGA:** task_type=research, threshold=80, max_iterations=3

#### Procedimento

1. **Para cada conteudo coletado (contents):**
   - Extrair MIUs — fragmentos semanticos minimos com significado autonomo
   - Cortes sao SEMANTICOS, nao por tamanho
   - Cada MIU = 1 unidade de ensino completa

2. **Classificar cada MIU** por tipo semantico:
   - Comportamental / Linguistico / Narrativo / Decisorio / Framework
   - **Novos tipos v2.1:**
     - `interacao_social` — MIUs que revelam como interpreta intencoes dos outros, reage a critica/elogio, nivel de confianca default
     - `argumentativo` — MIUs que revelam estrutura retorica, sequencia argumentativa, preferencia de persuasao
     - `associativo` — MIUs que conectam conceitos de dominios aparentemente nao relacionados (pontes conceituais)

3. **Calculo de Estilometria (v2.1):**
   - Sobre o corpus completo de MIUs, calcular metricas quantitativas:
     - Comprimento medio de frase (palavras)
     - Ratio de vocabulario tecnico vs coloquial
     - Frequencia de perguntas retoricas e imperativos
     - Frequencia de palavroes e expressoes coloquiais
     - Code-switching (alternancia de idiomas — portugues/ingles/etc.)
     - Marcadores discursivos recorrentes (ex: "olha", "tipo", "basicamente")
     - Cadencia geral (curta-rapida, longa-reflexiva, mista)
     - Pontuacao expressiva (uso de "!", "...", "—")
   - Registrar em `estilometria` no DNA YAML

4. **Validacao independente** (agente diferente do de extracao):
   - MIU tem significado autonomo? SIM -> validated | NAO -> rejected
   - Registrar razao de rejeicao
   - MIUs "boring" sao tao importantes quanto "dramatic" (Kahneman anti-saliencia)

5. **Progressive Summarization (Forte):**
   - Layer 1: texto bruto em `data/raw/`
   - Layer 2: MIUs extraidas (validated)
   - Layer 3: essencia destilada de cada MIU

6. **Calcular metricas:**
   - `fragmentation_quality`: % MIUs com significado autonomo (>= 95%)
   - `semantic_ratio`: % cortes semanticos vs arbitrarios (>= 90%)
   - `rejection_rate`: taxa documentada

#### Gate Gawande 2->3

| # | Critico? | Check |
|---|----------|-------|
| 1 | **SIM** | Fragmentation quality >= 95%? |
| 2 | **SIM** | Progressive Summarization completa (layers 1-3)? |
| 3 | nao | Hook de validacao YAML executou sem erros? |
| 4 | nao | Taxa de rejeicao documentada e justificada? |
| 5 | nao | Assinatura de agente em cada MIU? |

**NAO avance para Fase 3 sem gate aprovado.**

---

### FASE 3: INFERENCIA

**Objetivo:** Inferir drivers/motivadores e criar evidencias MIU<->Driver. Calcular correlacoes. Classificar em tiers.
**Entidades DB:** `mind_drivers`, `miu_driver_evidence`, `driver_relationships`, `drivers`
**OMEGA:** task_type=mind_clone, threshold=95, max_iterations=3, model=Opus

#### Procedimento

1. **Motor de Inferencia:** Para cada MIU validada:
   - "Que motivador/driver explica este comportamento/declaracao/decisao?"
   - Gerar evidencia MIU<->Driver com strength e referencia exata

2. **Agregar evidencias por driver:**
   - Calcular forca (strength) e confianca (confidence)
   - Gerar mind_drivers

3. **Calcular correlacoes entre drivers:**
   - Gerar driver_relationships (correlacao -1.0 a 1.0)
   - Tipos: causal, correlacional, antagonico

4. **Classificar em tiers:**
   - Gold: alta forca + alta confianca + alta frequencia
   - Silver: media forca ou confianca
   - Bronze: evidencia presente mas limitada

5. **Kahneman — Base rate:**
   - Verificar frequencia na populacao geral antes de atribuir
   - Driver com 80% de prevalencia nao e diferenciador

6. **Kahneman — 3 agentes independentes:**
   - 3 inferencias independentes sobre mesmas MIUs
   - Comparar ANTES de mediacao
   - Concordancia >= 0.85

7. **Separar drivers em positivos e negativos (v2.1):**
   - **Impulsores:** drivers que movem para frente (legado, reconhecimento, provar algo, curiosidade)
   - **Medos:** drivers negativos que paralisam ou motivam por evitacao (fracasso, irrelevancia, mediocridade, perda de controle)
   - Registrar em `filosofia.motivacao_profunda` com intensidade e evidencia
   - Definir `recompensa_ideal`: como a pessoa define "sucesso" pessoal

8. **Rankear valores por evidencia de sacrificio/escolha (v2.1):**
   - Para cada valor/principio identificado, buscar evidencias de "quando colidiu com outro valor, qual venceu?"
   - Gerar `filosofia.hierarquia_valores` com rank numerico (1 = mais importante)
   - Registrar `conflitos_de_valor` com contexto e evidencia de cada resolucao

9. **Inferir associacoes conceituais por co-ocorrencia em MIUs (v2.1):**
   - Identificar pares de conceitos de dominios diferentes que co-ocorrem nas MIUs
   - Gerar `associacoes_conceituais.pontes` com frequencia e exemplos
   - Inferir `padrao_associativo` geral (analogico, metaforico, sistemico, interdisciplinar)

10. **Inferir modelo social (v2.1):**
    - A partir de MIUs tipo `interacao_social`, inferir:
      - `confianca_default`: nivel geral de confianca em outros (alta/media/baixa)
      - `como_interpreta_critica`: padrao de reacao a criticas (duvida legitima vs ataque vs feedback util)
      - `como_interpreta_elogio`: aceita vs desconfia vs redireciona
      - `padrao_atribuicao`: internaliza causas (merito/culpa propria) vs externaliza (ambiente/sorte)
    - Registrar interacoes observadas com situacao, interpretacao, reacao e evidencia

11. **Extrair DNA (6 camadas + subcamadas v2.1):**

   Nesta fase, popular o DNA em `.claude/synapse/minds/{slug}.yaml`:

   **Camada 1 — Filosofia:** Crencas core, visao de mundo, principios inegociaveis + hierarquia_valores, conflitos_de_valor, motivacao_profunda
   **Camada 2 — Frameworks:** Frameworks primarios, modelo de decisao
   **Camada 3 — Heuristicas:** Regras rapidas, vieses conhecidos, red flags + modelo_social
   **Camada 4 — Metodologias:** Processos, ferramentas preferidas
   **Camada 5 — Dilemas:** Trade-offs, zonas cinza, evolucoes de posicao
   **Camada 6 — Paradoxos Produtivos:** Contradicoes internas que coexistem
   **Associacoes Conceituais:** Pontes entre conceitos, padrao associativo
   **Comunicacao Avancada:** Estrutura retorica (formula argumentativa, sequencias) + estilometria (metricas quantitativas)

   Para cada entrada, incluir `source_path` e `evidencia`.
   **Paradoxos:** minimo 2, cada um com >= 3 fontes independentes.

12. **Pre-mortem (Kahneman):**
    - "Se este driver estiver errado, o que acontece com o clone?"
    - Mapear impacto de cada falso positivo e falso negativo

#### Gate Gawande 3->4

| # | Critico? | Check |
|---|----------|-------|
| 1 | **SIM** | Predictive accuracy >= 90%? |
| 2 | **SIM** | Cada mind_driver tem >= 2 evidencias? |
| 3 | nao | False positive rate < 5%? |
| 4 | **SIM** | 3 agentes independentes concordam (>= 0.85)? |
| 5 | nao | driver_relationships calculados? |
| 6 | nao | Drivers classificados em tiers? |

**NAO avance para Fase 4 sem gate aprovado.**

---

### FASE 4: MAPEAMENTO

**Objetivo:** Mapear a mente contra sistemas de classificacao e gerar scores por componente.
**Entidades DB:** `mapping_systems`, `system_components`, `component_driver_map`, `mind_component_scores`, `mind_system_mappings`
**OMEGA:** task_type=mind_clone, threshold=95, max_iterations=3

#### Procedimento

1. **Carregar sistemas de mapeamento:**
   - Big Five (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)
   - MBTI (16 tipos)
   - Eneagrama (9 tipos + asas)
   - Catalogo de 1000+ artefatos cognitivos

2. **Para cada componente de cada sistema:**
   - Usar drivers da mente (mind_drivers) + component_driver_map
   - Calcular score da mente neste componente
   - Registrar confidence e evidence_count

3. **Gerar mind_system_mappings:**
   - Perfil textual completo por sistema
   - Verificar consistencia cruzada (ex: INTJ com Openness baixo faz sentido?)

4. **Kahneman — Anti-halo:**
   - Score alto em um componente NAO influencia outros
   - Cada componente calculado INDEPENDENTEMENTE

5. **Gerar artefatos:**
   - `system-components/{mind-name}-system.yaml`
   - `artifacts/cognitive/` (cognitive-architecture, core-beliefs, artefatos-cognitivos)
   - `artifacts/behavioral/` (behavioral-patterns, compassion-triggers, contradictions)
   - `artifacts/linguistic/` (micro-units, signature-phrases, communication-templates)
   - `artifacts/narrative/` (storytelling-validation, self-told-story)

#### Gate Gawande 4->5

| # | Critico? | Check |
|---|----------|-------|
| 1 | **SIM** | Todos componentes relevantes tem score? |
| 2 | **SIM** | Consistencia interna >= 95%? |
| 3 | nao | Crossref com catalogo de artefatos completo? |
| 4 | nao | mind_system_mappings gerados para todos sistemas? |

**NAO avance para Fase 5 sem gate aprovado.**

---

### FASE 5: PERFIL

**Objetivo:** Agregar tudo no Perfil Final. A mente NASCE. Calcular fidelidade.
**Entidades DB:** `minds`, `mind_tools`
**OMEGA:** task_type=mind_clone, threshold=95, max_iterations=3

#### Procedimento

1. **Gerar Perfil Agregado:**
   - Cruzar mind_component_scores + mind_system_mappings + mind_drivers
   - Gerar perfil unificado

2. **Calcular APEX score e metadados:**
   - score_apex, archetype, complexity_level, status

3. **Identificar mind_tools:**
   - Quais ferramentas cognitivas do catalogo a mente utiliza?
   - Com que proficiencia?
   - Vinculacao: inferido, declarado, observado

4. **Calcular Formula de Fidelidade:**
   ```
   F = (L x 0.20) + (B x 0.30) + (C x 0.15) + (K x 0.20) + (V x 0.15)

   L = Linguistic Accuracy   (0-100) — MIUs linguisticos + voice
   B = Behavioral Fidelity   (0-100) — drivers + scores (MAIOR PESO)
   C = Contradiction Handling (0-100) — paradoxos produtivos
   K = Knowledge/Framework    (0-100) — frameworks + mind_tools
   V = Voice Authenticity     (0-100) — voice + phrases + blind test

   Minimum per component: 85
   Minimum composite: 95
   ```

5. **Blind test (Kahneman):**
   - Apresentar material que o clone NUNCA viu
   - O clone generaliza corretamente? Se nao -> overfitting

   **Cenarios adicionais de blind test (v2.1):**

   | # | Tipo | O que testa | Como avaliar |
   |---|------|-------------|--------------|
   | A | **Provocacao/Critica** | Modelo social — como reage a critica direta | Resposta consistente com `modelo_social.como_interpreta_critica`? Tom preservado? |
   | B | **Argumento Complexo** | Estrutura retorica — como constroi argumentos | Sequencia retorica compativel com `estrutura_retorica.formula_padrao`? |
   | C | **Associacao Inesperada** | Pontes conceituais — conecta dominios diferentes | Tipo de ponte conceitual consistente com `associacoes_conceituais.padrao_associativo`? |

   **Estilometria no blind test:** Avaliar se a resposta gerada mantem metricas compativeis com o perfil estilometrico (comprimento de frase, cadencia, code-switching, marcadores discursivos).

6. **Noise audit (Kahneman):**
   - Re-executar perfil com mesmos inputs
   - Reprodutibilidade >= 0.90

7. **Pre-mortem final:**
   - "E 2027. Descobrimos que o clone e caricatura. O que deu errado?"
   - Documentar cenarios de falha

8. **Se fidelidade < 95%:**
   - NOTIFICAR usuario:
   ```
   FIDELIDADE ABAIXO DO THRESHOLD

   Clone: {Nome do Especialista}
   Fidelidade: {F}%
   Componentes: L={L}% B={B}% C={C}% K={K}% V={V}%
   Threshold minimo: 95%

   Opcoes:
   1. Aceitar como draft (nao produtivo)
   2. Fornecer mais fontes para enriquecer
   3. Revisar manualmente

   Qual opcao voce prefere? (1/2/3)
   ```

#### Gate Gawande 5->6

| # | Critico? | Check |
|---|----------|-------|
| 1 | **SIM** | Fidelity score composto >= 95%? |
| 2 | **SIM** | Blind test passou? |
| 3 | **SIM** | Pre-mortem executado e documentado? |
| 4 | nao | mind_tools populado com proficiency scores? |
| 5 | nao | config.yaml atualizado com status? |

**NAO avance para Fase 6 sem gate aprovado.**

---

### FASE 6: RECOMENDACAO

**Objetivo:** Recomendar ferramentas cognitivas e identificar gaps. Transformar clone de retrato em sistema de crescimento.
**Entidades DB:** `tools`, `tool_driver_affinities`, `tool_relations`
**OMEGA:** task_type=mind_clone, threshold=95, max_iterations=3

#### Procedimento

1. **Match Engine:**
   - Cruzar mind_drivers com catalogo de ferramentas (tools)
   - Identificar ferramentas com alta afinidade que a mente NAO usa
   - Verificar pre-requisitos (tool_relations)

2. **Gerar Recommended Tools:**
   - Ordenar por relevancia x afinidade x viabilidade
   - Documentar por que cada ferramenta e relevante

3. **Gerar Development Gaps:**
   - Areas com drivers fortes mas ferramentas fracas/ausentes
   - Priorizar por impacto no perfil

4. **Gerar Agente Operacional (.md):**
   - Criar `DUARTEOS/{Categoria}/{slug}.md` (comando slash acessivel)
   - System prompt completo com: CORBS, behavioral patterns, voice, frameworks, paradoxos
   - Seguir checklist de criacao de agente (ver MMOS-PIPELINE.md Secao 15)
   - **INCLUIR secao "Bootstrap — Carregamento de Mente Completa"** antes de "Regras Finais":

     ```markdown
     ## Bootstrap — Carregamento de Mente Completa

     **PROTOCOLO OBRIGATORIO:** Antes de responder a QUALQUER pergunta como {Nome}, carregue a mente completa:

     1. Use `Glob` para `.claude/commands/DUARTEOS/{Categoria}/squad/{slug}/**/*.yaml`
     2. Use `Read` em paralelo para **TODOS** os arquivos YAML encontrados
     3. Use `Glob` para `.claude/commands/DUARTEOS/{Categoria}/squad/{slug}/tasks/*.md` e leia todos
     4. Integre os dados carregados com a identidade core acima

     Isto carrega as 6 camadas profundas do squad:
     - **Behavioral** — padroes comportamentais + comportamento situacional
     - **Cognitive** — arquitetura cognitiva + crencas core
     - **Linguistic** — micro-units de linguagem + templates comunicativos
     - **Narrative** — padroes de storytelling + self-narrative
     - **Drivers** — motivadores hierarquizados (gold/silver/bronze)
     - **Frameworks** — frameworks detalhados com steps, exemplos e anti-patterns

     **NAO responda sem completar o bootstrap.** Este .md e um resumo comprimido. A mente completa esta nos artifacts do squad.
     ```

   - Copiar para `DUARTEOS/{Categoria}/squad/{slug}/agents/{slug}.md` (copia no squad dir)

5. **Popular TODOS os squad artifacts (9 tipos obrigatorios):**

   **Base path:** `DUARTEOS/{Categoria}/squad/{slug}/`
   **Fonte de verdade:** `.claude/synapse/minds/{slug}.yaml` (DNA)
   **OMEGA:** Cada sub-item roda sob task_type=mind_clone, threshold=95

   #### 5.1 — Frameworks (`frameworks/{slug}/`)
   Para CADA framework em `DNA.frameworks.primarios[]`, gerar 1 YAML:

   **Arquivo:** `frameworks/{slug}/{framework-slug}.yaml`
   **Schema:**
   ```yaml
   # {Nome do Framework} — {slug}
   # Derivado de: .claude/synapse/minds/{slug}.yaml
   # Pipeline: MMOS Engine v2 — Fase 6
   # Gerado em: {timestamp}

   framework_identity:
     name: "{nome do framework}"
     slug: "{framework-slug}"
     mind: "{slug}"
     category: "{categoria}"
     source_path: "{DNA.frameworks.primarios[N].source_path}"

   descricao: "{resumo do que o framework resolve}"

   steps:
     - step: 1
       acao: "{passo 1}"
       detalhe: "{expansao com contexto do DNA}"
     - step: 2
       acao: "{passo 2}"
       detalhe: "{expansao}"

   quando_usar: "{contexto de uso}"

   exemplos_aplicacao:
     - cenario: "{situacao concreta derivada das MIUs}"
       resultado: "{o que acontece quando aplicado}"
       fonte: "{source_path da MIU}"

   anti_patterns:
     - "{situacao onde NAO usar este framework}"

   frameworks_relacionados:
     - name: "{outro framework do mesmo DNA}"
       relacao: "{complementar | prerequisito | alternativo}"
   ```

   **Regra:** len(frameworks YAML gerados) == len(DNA.frameworks.primarios).

   #### 5.2 — Drivers (`drivers/{slug}-drivers.yaml`)
   Consolidar todos os mind_drivers da Fase 3 com tiers e evidencias.

   **Arquivo:** `drivers/{slug}-drivers.yaml`
   **Schema:**
   ```yaml
   # {Nome} — Mind Drivers
   # Derivado de: .claude/synapse/minds/{slug}.yaml
   # Pipeline: MMOS Engine v2 — Fase 6
   # Gerado em: {timestamp}

   driver_identity:
     mind: "{slug}"
     name: "{Nome}"
     category: "{categoria}"
     total_drivers: {N}
     tier_distribution:
       gold: {N}
       silver: {N}
       bronze: {N}

   drivers:
     - name: "{nome do driver}"
       tier: "{gold | silver | bronze}"
       strength: {0.0-1.0}
       confidence: {0.0-1.0}
       frequency: "{quantas MIUs suportam}"
       descricao: "{o que motiva/impulsiona}"
       evidencias:
         - miu: "{resumo da MIU}"
           source_path: "{caminho da fonte}"
           strength: {0.0-1.0}
       relationships:
         - target: "{outro driver}"
           type: "{causal | correlacional | antagonico}"
           correlation: {-1.0 a 1.0}
   ```

   **Fonte dos dados:** Entidades `mind_drivers`, `miu_driver_evidence`, `driver_relationships` da Fase 3.

   #### 5.3 — Checklist (`checklists/{slug}-checklist.yaml`)
   Gates DO-CONFIRM especificos para validar output gerado por este clone.

   **Arquivo:** `checklists/{slug}-checklist.yaml`
   **Schema:**
   ```yaml
   # {Nome} — Quality Checklist
   # Pipeline: MMOS Engine v2 — Fase 6
   # Gerado em: {timestamp}

   checklist_identity:
     mind: "{slug}"
     name: "{Nome}"
     category: "{categoria}"
     type: "DO-CONFIRM"

   gates:
     voice_fidelity:
       descricao: "Output soa como {Nome} falaria?"
       kill_item: true
       checks:
         - "Tom descrito em voice.yaml presente?"
         - "Anti-patterns ausentes?"
         - "Frases-assinatura usadas quando contexto permite?"

     framework_usage:
       descricao: "Frameworks aplicados corretamente?"
       kill_item: false
       checks:
         - "Framework usado no contexto correto (quando_usar)?"
         - "Steps seguidos na ordem?"
         - "Nenhum framework inventado?"

     paradox_handling:
       descricao: "Paradoxos tratados com nuance?"
       kill_item: true
       checks:
         - "Lado A e lado B reconhecidos quando trigger ativado?"
         - "Resolucao emergente articulada?"
         - "Nenhum lado artificialmente eliminado?"

     behavioral_consistency:
       descricao: "Comportamento consistente com DNA?"
       kill_item: false
       checks:
         - "Heuristicas aplicadas nos triggers corretos?"
         - "Metodologias citadas com precisao?"

     knowledge_accuracy:
       descricao: "Conhecimento factual correto?"
       kill_item: true
       checks:
         - "Fatos sobre dominio de expertise corretos?"
         - "Nenhuma confabulacao?"

   scoring:
     threshold: 95
     weights:
       voice_fidelity: 25
       framework_usage: 20
       paradox_handling: 20
       behavioral_consistency: 20
       knowledge_accuracy: 15
   ```

   #### 5.4 — Tasks (`tasks/`)
   Criar 5+ tarefas onde esta mente excela, baseado em drivers gold + frameworks primarios.

   **Arquivo por task:** `tasks/{acao}-{slug}.md`
   **Schema por task:**
   ```markdown
   # {Acao} — {Nome}

   **Mind Clone:** {slug}
   **Dominio:** {DNA.identity.domain}
   **Dificuldade:** {basica | intermediaria | avancada}
   **Frameworks envolvidos:** {lista de frameworks relevantes}

   ## Descricao
   {O que esta task faz e por que {Nome} e a melhor mente para executa-la}

   ## Instrucoes para o Clone
   1. {Step 1 — baseado em frameworks e heuristicas do DNA}
   2. {Step 2}

   ## Exemplo de Input
   {Input hipotetico}

   ## Exemplo de Output Esperado
   {Output que {Nome} produziria, no tom e estilo corretos}

   ## Checklist de Qualidade
   - [ ] Voice fiel ao perfil?
   - [ ] Frameworks corretos aplicados?
   - [ ] Paradoxos tratados com nuance?
   ```

   **Regra:** Para cada driver tier=gold, 1 task. Para cada framework primario, 1 task. Minimo 5, maximo 15. Nomenclatura: `{verbo}-{objeto}-{slug}.md`

   #### 5.5 — Behavioral Artifacts (`artifacts/behavioral/`)

   **Arquivo 1:** `artifacts/behavioral/{slug}-behavioral-patterns.yaml`
   ```yaml
   behavioral_identity:
     mind: "{slug}"
     name: "{Nome}"

   patterns:
     - name: "{nome do padrao}"
       trigger: "{DNA.heuristicas.regras_rapidas[N].trigger}"
       response: "{DNA.heuristicas.regras_rapidas[N].acao}"
       intensity: "{alta | media | baixa}"
       frequency: "{sempre | frequente | situacional}"
       source_path: "{source_path}"

   under_pressure:
     descricao: "{como se comporta sob pressao}"
     patterns:
       - "{padrao 1}"
       - "{padrao 2}"

   blind_spots:
     - "{DNA.heuristicas.vieses_conhecidos[]}"
   ```

   **Arquivo 2:** `artifacts/behavioral/{slug}-situational-behavior.yaml`
   ```yaml
   situational_identity:
     mind: "{slug}"

   situations:
     - contexto: "{situacao especifica}"
       comportamento: "{como reage}"
       frameworks_ativados: ["{lista}"]
       heuristicas_ativadas: ["{lista}"]
       fonte: "{source_path}"
   ```

   #### 5.6 — Cognitive Artifacts (`artifacts/cognitive/`)

   **Arquivo 1:** `artifacts/cognitive/{slug}-cognitive-architecture.yaml`
   ```yaml
   cognitive_identity:
     mind: "{slug}"
     name: "{Nome}"

   architecture:
     primary_mode: "{como pensa — derivado de MBTI + Big Five}"
     decision_model: "{DNA.frameworks.modelo_decisao}"
     information_processing:
       intake: "{como absorve informacao}"
       filtering: "{como filtra/prioriza}"
       output: "{como externaliza decisoes}"

   mental_models:
     - name: "{framework ou heuristica}"
       usage_frequency: "{alta | media | baixa}"
       domain: "{onde aplica}"

   cognitive_biases:
     known:
       - bias: "{DNA.heuristicas.vieses_conhecidos[N]}"
         impact: "{como afeta output}"
     compensated:
       - bias: "{vieses compensados}"
         compensation: "{mecanismo}"
   ```

   **Arquivo 2:** `artifacts/cognitive/{slug}-core-beliefs.yaml`
   ```yaml
   core_beliefs_identity:
     mind: "{slug}"

   beliefs:
     - belief: "{DNA.filosofia.crencas_core[N].belief}"
       tier: "{tier}"
       evidencia: "{evidencia}"
       source_path: "{source_path}"
       implications:
         - "{como esta crenca afeta decisoes praticas}"

   worldview: "{DNA.filosofia.visao_de_mundo}"

   non_negotiables:
     - "{DNA.filosofia.principios_inegociaveis[]}"
   ```

   #### 5.7 — Linguistic Artifacts (`artifacts/linguistic/`)

   **Arquivo 1:** `artifacts/linguistic/{slug}-micro-units.yaml`
   ```yaml
   linguistic_identity:
     mind: "{slug}"
     name: "{Nome}"

   micro_units:
     - tipo: "{declaracao_absoluta | pergunta_retorica | analogia | reframe | metrica}"
       exemplo: "{frase ou construcao}"
       quando_usar: "{contexto de uso}"
       fonte: "{source_path}"

   vocabulary:
     preferred_terms:
       - term: "{palavra/expressao}"
         context: "{quando usa}"
     forbidden_terms:
       - term: "{palavra/expressao}"
         reason: "{por que evita}"
   ```

   **Arquivo 2:** `artifacts/linguistic/{slug}-communication-templates.yaml`
   ```yaml
   communication_templates_identity:
     mind: "{slug}"

   templates:
     - name: "{nome do template}"
       trigger: "{quando usar}"
       structure:
         - "{abertura}"
         - "{desenvolvimento}"
         - "{conclusao}"
       example: "{exemplo completo baseado em MIU real}"
       source_path: "{fonte}"
   ```

   #### 5.8 — Narrative Artifacts (`artifacts/narrative/`)

   **Arquivo 1:** `artifacts/narrative/{slug}-storytelling-patterns.yaml`
   ```yaml
   narrative_identity:
     mind: "{slug}"
     name: "{Nome}"

   patterns:
     - name: "{nome do padrao narrativo}"
       structure: "{como a historia e construida}"
       recurring_elements:
         - "{elemento recorrente}"
       example: "{exemplo extraido de MIU real}"
       quando_usar: "{contexto}"
       source_path: "{fonte}"

   recurring_narratives:
     - tema: "{tema recorrente}"
       versoes: {quantas vezes conta em fontes diferentes}
       variacao: "{como a narrativa varia}"
   ```

   **Arquivo 2:** `artifacts/narrative/{slug}-self-narrative.yaml`
   ```yaml
   self_narrative_identity:
     mind: "{slug}"

   origin_story: "{como a pessoa conta sua propria historia}"
   turning_points:
     - event: "{evento}"
       before: "{como era antes}"
       after: "{como ficou depois}"
       significance: "{por que importa}"
       source_path: "{fonte}"

   identity_anchors:
     - "{como se define}"

   legacy_narrative: "{como projeta seu legado}"
   ```

   #### 5.9 — Agent Copy (`agents/{slug}.md`)
   Copiar o agente `.md` gerado no item 4 para `agents/{slug}.md` dentro do squad dir.

6. **Persistir DNA no Synapse:**
   - Salvar `.claude/synapse/minds/{slug}.yaml` (versao final)
   - Atualizar `.claude/synapse/minds/_index.yaml`
   - Registrar em `.claude/synapse/ingestion/{YYYY-MM-DD}-{slug}.yaml`

7. **Atualizar config.yaml do squad:**
   ```yaml
   clone:
     name: "{Nome da Mente}"
     version: "1.0.0"
     pipeline_version: "2"
     created_at: "{timestamp}"
     score_apex: {apex_score}
     fidelity_score: {F}
     status: "active"  # ou "draft" se F < 95
     archetype: "{frase}"
     category: "{categoria}"
   ```

8. **Gate Gawande — Squad Completeness (DO-CONFIRM):**

   Verificar que TODOS os squad artifacts foram gerados antes de considerar o clone completo.

   | # | Critico? | Check | Verificacao |
   |---|----------|-------|-------------|
   | 1 | **SIM** | Agent .md existe em `agents/{slug}.md`? | Confirmar arquivo |
   | 2 | **SIM** | Frameworks: count == DNA.frameworks.primarios.length? | Contar YAMLs em `frameworks/{slug}/` |
   | 3 | **SIM** | Drivers YAML existe com todos os tiers? | Confirmar `drivers/{slug}-drivers.yaml` |
   | 4 | **SIM** | Checklist existe com gates voice + paradox? | Confirmar `checklists/{slug}-checklist.yaml` |
   | 5 | nao | Tasks >= 5 geradas? | Contar arquivos em `tasks/` |
   | 6 | **SIM** | Behavioral artifacts (2 arquivos)? | Confirmar `artifacts/behavioral/` |
   | 7 | **SIM** | Cognitive artifacts (2 arquivos)? | Confirmar `artifacts/cognitive/` |
   | 8 | nao | Linguistic artifacts (2 arquivos)? | Confirmar `artifacts/linguistic/` |
   | 9 | nao | Narrative artifacts (2 arquivos)? | Confirmar `artifacts/narrative/` |
   | 10 | **SIM** | config.yaml tem `artifacts_completeness`? | Ver abaixo |

   **Se kill items (1-4, 6-7, 10) falharem:** Task OMEGA fica blocked. Gerar artifacts faltantes.
   **NAO declare clone completo sem gate aprovado.**

9. **Atualizar config.yaml com `artifacts_completeness`:**

   Adicionar ao `config.yaml` do squad:

   ```yaml
   artifacts_completeness:
     agent_md: true
     frameworks: "{N}/{N}"
     drivers: true
     checklist: true
     tasks: {N}
     behavioral: true
     cognitive: true
     linguistic: true
     narrative: true
     voice: true
     phrases: true
     system_components: true
     completeness_score: "{N}%"
     completeness_gate: "{PASSED | FAILED}"
   ```

   **Regra:** `completeness_gate` = PASSED somente se `completeness_score >= 85%` E todos kill items do Gate Gawande passaram.

---

## Artefatos Gerados

| Fase | Artefato | Caminho | Obrigatorio |
|------|----------|---------|-------------|
| 0 | DNA skeleton com scores | `.claude/synapse/minds/{slug}.yaml` | SIM |
| 1 | Material bruto coletado | `squad/{slug}/data/raw/` | SIM |
| 2 | MIUs e fragmentos | `squad/{slug}/data/processed/` | SIM |
| 3 | Drivers e evidencias | `squad/{slug}/drivers/{slug}-drivers.yaml` | SIM |
| 3 | DNA completo (6 camadas) | `.claude/synapse/minds/{slug}.yaml` | SIM |
| 4 | System components | `squad/{slug}/system-components/{slug}-system.yaml` | SIM |
| 6 | Agente operacional | `squad/{slug}/agents/{slug}.md` | SIM |
| 6 | Frameworks (1 por fw) | `squad/{slug}/frameworks/{slug}/{fw}.yaml` | SIM |
| 6 | Voice | `squad/{slug}/voice/{slug}-voice.yaml` | SIM |
| 6 | Phrases | `squad/{slug}/phrases/{slug}-phrases.yaml` | SIM |
| 6 | Checklist | `squad/{slug}/checklists/{slug}-checklist.yaml` | SIM |
| 6 | Tasks (5+) | `squad/{slug}/tasks/{acao}-{slug}.md` | NAO (warning) |
| 6 | Behavioral (2) | `squad/{slug}/artifacts/behavioral/` | SIM |
| 6 | Cognitive (2) | `squad/{slug}/artifacts/cognitive/` | SIM |
| 6 | Linguistic (2) | `squad/{slug}/artifacts/linguistic/` | NAO (warning) |
| 6 | Narrative (2) | `squad/{slug}/artifacts/narrative/` | NAO (warning) |
| 6 | Config completo | `squad/{slug}/config.yaml` | SIM |
| 6 | Indice Synapse | `.claude/synapse/minds/_index.yaml` | SIM |

**Campos v2.1 no DNA YAML (gerados nas Fases 2-3):**

| Componente | Campo no DNA | Gerado na Fase |
|------------|-------------|----------------|
| Estilometria Computacional | `comunicacao_avancada.estilometria` | Fase 2 (Extracao) |
| Estrutura Retorica | `comunicacao_avancada.estrutura_retorica` | Fase 3 (Inferencia) |
| Associacoes Conceituais | `associacoes_conceituais` | Fase 3 (Inferencia) |
| Hierarquia de Valores | `filosofia.hierarquia_valores` + `filosofia.conflitos_de_valor` | Fase 3 (Inferencia) |
| Motivacao Profunda | `filosofia.motivacao_profunda` | Fase 3 (Inferencia) |
| Modelo Social | `heuristicas.modelo_social` | Fase 3 (Inferencia) |

## Regras Criticas

1. **FONTES PRIMARIAS APENAS** — ZERO fontes secundarias/interpretativas
2. **FIDELIDADE >= 95%** — meta inegociavel. Se abaixo, notificar usuario
3. **PARADOXOS = CAMADA OURO** — minimo 2, cada um com >= 3 fontes independentes
4. **GATES GAWANDE** — kill items bloqueiam avanco entre fases
5. **3 AGENTES INDEPENDENTES** — concordancia >= 0.85 na Fase 3
6. **BLIND TEST** — material nunca visto testa generalizacao na Fase 5
7. **SOURCE_PATH** — todo insight deve ter rastreabilidade ate a fonte
8. **OMEGA LOOP** — cada fase roda sob OMEGA com circuit breaker
9. **SYNAPSE DNA** — persistencia em `.claude/synapse/minds/{slug}.yaml`
10. **EDIT > WRITE** — sempre preferir Edit para arquivos existentes
