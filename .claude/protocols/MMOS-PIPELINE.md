# MMOS ENGINE v3.0.0 — Pipeline de Clonagem Mental de Alta Fidelidade

**Versao:** 3.0.0
**Status:** Ativo
**Autor:** NEXUS (Architect)
**Data:** 2026-03-03
**Substitui:** MMOS Engine v2.1 (7 fases 0-6, sem estimativa pre-clone, sem gate humano)
**Dependencias:** OMEGA.md (Secao 20-21), SYNAPSE.md (Secao 4)

---

## Definicao

MMOS Engine v3 e o **motor de extracao e clonagem de mentes** do DuarteOS, com fidelidade-alvo >= 95%.

- **Pipeline de 11 fases** (0-10): Intake, Pesquisa, Analise Rapida, Estimativa PCFE, Gate Humano, Scaffold, Extracao, Inferencia, Mapeamento, Perfil, Recomendacao
- **Estimativa de fidelidade PRE-CLONE** (PCFE) — evita gastar tokens em clones inviaveis
- **Gate humano** — usuario decide GO/ENRIQUECER/ABORTAR antes do pipeline pesado
- **Scaffold pos-aprovacao** — cria infraestrutura antes do pipeline pesado
- **15 entidades de dados** distribuidas pelas fases
- **5 autoridades** integradas em cada fase (Allen, Forte, Deming, Kahneman, Gawande)
- Roda **DENTRO do OMEGA v2** (cada fase = task OMEGA com loop de refinamento)
- Alimenta **Synapse v3** (DNA + indices)

```
MMOS v3 = 11 Fases (0-10) x 15 Entidades x 5 Autoridades x PCFE x Gate Humano x OMEGA Loop x Synapse DNA
```

---

## 1. Visao Geral do Pipeline

### 1.1 As 11 Fases (0-10)

```
+==========================================================================+
|                    MMOS ENGINE v3 — 11 FASES (0-10)                      |
+==========================================================================+

FASE 0 (Pre-Pipeline)
  INTAKE: Canonicalizacao + Dedup + Verificar clone existente
       |
       v
FASE 1: PESQUISA ──────────────────────────── [catalogo_fontes]
  WebSearch + WebFetch + Material fornecido
  Catalogo de fontes com metadados
       |
   Gate Gawande 1->2 (DO-CONFIRM)
       |
       v
FASE 2: ANALISE RAPIDA ────────────────────── [mius_sample]
  Extracao de MIUs sample (20-50 MIUs)
  Classificacao por camada DNA
  Metricas de cobertura
       |
       v
FASE 3: ESTIMATIVA PCFE ──────────────────── [fe_report]
  Pre-Clone Fidelity Estimation
  FE = VS*0.20 + DS*0.15 + CS*0.30 + PS*0.20 + QS*0.15
  Gap report por camada DNA
       |
       v
FASE 4: GATE DE APROVACAO HUMANA ─────────── [decisao]
  Apresenta FE + breakdown + gaps + recomendacao
  Opcoes: [1] APROVAR  [2] ENRIQUECER  [3] ABORTAR
  Se [2]: loop volta para Fase 1 (max 3 loops)
       |
    [1] APROVADO
       |
       v
FASE 5: SCAFFOLD ─────────────────────────── [infraestrutura]
  Criar diretorios squad (21+ dirs)
  config.yaml skeleton, DNA skeleton
  TASKS + Checklists personalizados
       |
       v
FASE 6: EXTRACAO ────────────────────────────── [mius, fragments]
  MIUs (Micro-Unidades Interpretativas Neurais)
  Progressive Summarization (Forte layers 1-3)
  Validacao: MIUs OK vs Rejeitados
  Estilometria computacional
       |
   Gate Gawande 6->7 (DO-CONFIRM)
       |
       v
FASE 7: INFERENCIA ──────── [mind_drivers, miu_driver_evidence,
  Motor de Inferencia              driver_relationships, drivers]
  MIUs -> Drivers/Motivadores
  Evidencias MIU<->Driver
  Correlacoes, Tiers (gold/silver/bronze)
  3 agentes independentes (concordancia >= 0.85)
  DNA 6 camadas + hierarquia valores + modelo social + associacoes
       |
   Gate Gawande 7->8 (DO-CONFIRM)
       |
       v
FASE 8: MAPEAMENTO ──────── [mapping_systems, system_components,
  Big Five, MBTI, Eneagrama      component_driver_map,
  Catalogo 1000+ artefatos       mind_component_scores,
  Scores por componente           mind_system_mappings]
       |
   Gate Gawande 8->9 (DO-CONFIRM)
       |
       v
FASE 9: PERFIL ───────────────────────────── [minds, mind_tools]
  Perfil Agregado — a mente NASCE
  Formula de fidelidade calculada
  Blind test + Noise audit + Pre-mortem
  Comparar FE (Fase 3) vs F real (calibracao)
       |
   Gate Gawande 9->10 (DO-CONFIRM)
       |
       v
FASE 10: RECOMENDACAO ──────── [tools, tool_driver_affinities,
  Match Engine                        tool_relations]
  Agente .md operacional
  Squad artifacts (9 tipos)
  Ferramentas recomendadas
  Development Gaps identificados
       |
       v
  CLONE COMPLETO (Fidelidade >= 95%)
```

### 1.2 As 15 Entidades de Dados

| # | Entidade | Fase | Tipo | Descricao |
|---|----------|------|------|-----------|
| 1 | `contents` | 6-Extracao | storage | Conteudos brutos coletados |
| 2 | `mius` | 6-Extracao | hot_compute | Micro-Unidades Interpretativas Neurais |
| 3 | `fragments` | 6-Extracao | storage | Fragmentos processados e indexados |
| 4 | `drivers` | 7-Inferencia | entity | Catalogo mestre de drivers/motivadores |
| 5 | `mind_drivers` | 7-Inferencia | hot_compute | Drivers atribuidos a uma mente |
| 6 | `miu_driver_evidence` | 7-Inferencia | evidence | Evidencias MIU<->Driver |
| 7 | `driver_relationships` | 7-Inferencia | relational | Correlacoes entre drivers |
| 8 | `mapping_systems` | 8-Mapeamento | catalog | Sistemas disponiveis (Big Five, MBTI, etc.) |
| 9 | `system_components` | 8-Mapeamento | storage | Componentes de cada sistema |
| 10 | `component_driver_map` | 8-Mapeamento | relational | Mapa componente<->driver |
| 11 | `mind_component_scores` | 8-Mapeamento | hot_compute | Scores da mente por componente |
| 12 | `mind_system_mappings` | 8-Mapeamento | storage | Perfis completos por sistema |
| 13 | `minds` | 9-Perfil | entity | A mente finalizada |
| 14 | `mind_tools` | 9-Perfil | relational | Ferramentas cognitivas da mente |
| 15 | `tools` | 10-Recomendacao | catalog | Catalogo de 1000+ artefatos cognitivos |
| — | `tool_driver_affinities` | 10-Recomendacao | hot_compute | Afinidade ferramenta<->driver |
| — | `tool_relations` | 10-Recomendacao | relational | Relacoes entre ferramentas |

> **Nota:** O spec original lista 15 entidades numeradas mais 2 auxiliares da Fase 10 (tool_driver_affinities e tool_relations), totalizando 17 tabelas no schema completo.

### 1.3 Mind-Create vs Mind-Update

| Aspecto | Mind-Create | Mind-Update |
|---------|------------|-------------|
| **Ponto de entrada** | Fase 0 (Intake + canonicalizacao) | Fase adequada ao novo material |
| **Pipeline** | Completo: Fase 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 | Parcial: entra na fase certa |
| **Fonte de dados** | WebSearch + WebFetch (pesquisa automatica) | Material fornecido (URL, arquivo, texto, inbox) |
| **DNA** | Criado do zero | Merge incremental (adiciona, nunca remove) |
| **Agente .md** | Gerado do zero | Editado cirurgicamente |
| **Protecao** | Validacao final >= 95% | Rollback automatico se fidelidade cai > 5% |
| **Prerequisito** | Nenhum | Clone deve existir |
| **Comando** | `/DUARTEOS:mmos:mind-clone` | `/DUARTEOS:mmos:mind-update` |

**Regra de ouro:** Se o slug existe em `.claude/synapse/minds/`, use `mind-update`. Se nao, use `mind-clone`.

---

## 2. As 5 Autoridades

O MMOS v3 integra 5 autoridades intelectuais cujos principios operam em CADA fase do pipeline. Cada autoridade resolve um problema diferente.

### 2.1 Allen (GTD) — Workflow

| Principio | Aplicacao no MMOS |
|-----------|-------------------|
| **Capture** | Captura exaustiva e agnostica na Fase 1 — todo material entra sem filtro |
| **Clarify** | Decisao binaria em cada item: MIU valida? Fonte primaria? Driver confirmado? |
| **Organize** | Classificacao por tipo semantico, contextos GTD (@validar, @inferir, @incubar) |
| **Reflect** | Weekly review: gaps de cobertura? Drivers incubados? Novas fontes? |
| **Engage** | Proxima acao clara: avancar para proxima fase ou ampliar fase atual |

**Papel por fase:**

| Fase | Aplicacao Allen |
|------|----------------|
| 1-Pesquisa | Captura exaustiva agnostica. Cada fonte = inbox. |
| 2-Analise Rapida | Clarificacao: MIU sample tem significado autonomo? |
| 6-Extracao | Clarificacao: MIU tem significado autonomo? SIM -> valida, NAO -> rejeitada |
| 7-Inferencia | Classificacao: driver confirmado (>= 2 MIUs) ou incubado (1 MIU) |
| 8-Mapeamento | — (nao aplica diretamente) |
| 9-Perfil | — (nao aplica diretamente) |
| 10-Recomendacao | — (nao aplica diretamente) |

### 2.2 Forte (CODE) — Memoria

| Principio | Aplicacao no MMOS |
|-----------|-------------------|
| **Capture** | Layer 1: texto bruto integral em `data/raw/` |
| **Organize** | Layer 2: MIUs extraidas — trechos relevantes |
| **Distill** | Layer 3: essencia destilada de cada MIU |
| **Express** | Layer 4: insight acionavel — a mente NASCE na Fase 9 |

**Papel por fase:**

| Fase | Layer Forte | Descricao |
|------|-------------|-----------|
| 1-Pesquisa | Layer 1 (Capture) | Material bruto coletado intacto |
| 2-Analise Rapida | Layer 1-2 (Sample) | Amostra para estimativa |
| 6-Extracao | Layer 2-3 (Organize + Distill) | MIUs + essencias destiladas |
| 7-Inferencia | Layer 4 (Distill -> Actionable) | Drivers geram regras operacionais |
| 8-Mapeamento | Destilacao | Milhares de MIUs -> dezenas de scores |
| 9-Perfil | Express | Conhecimento destilado vira entidade acionavel |
| 10-Recomendacao | PARA mapping | Areas, Recursos, Projetos, Arquivos |

**Intermediate Packets:** Cada MIU validada e um Intermediate Packet reutilizavel. MIUs alimentam multiplos drivers, frameworks e componentes.

**Regra critica:** NUNCA editar material bruto. Preservar integridade total na Layer 1.

### 2.3 Deming (PDSA) — Qualidade

O loop OMEGA e a implementacao direta do ciclo PDSA de Deming:

```
OMEGA LOOP          <->  DEMING PDSA
-----------------        ---------------
Config (threshold,       PLAN
  task_type, model)      (hipotese, metricas)

Execute (agente          DO
  implementa)            (executar plano)

Score (avaliar           STUDY
  evidencias, calcular   (medir resultado,
  score por checklist)   comparar com hipotese)

Feedback/Escalate        ACT
  (refinar, escalar,     (se abaixo: ajustar,
  ou finalizar)          se acima: padronizar)
```

**Hipoteses e metricas por fase:**

| Fase | Hipotese Deming | Metrica |
|------|----------------|---------|
| 1-Pesquisa | Fontes cobrem corpus da pessoa | catalogo completo |
| 2-Analise Rapida | Amostra representativa do material | cobertura por camada DNA |
| 3-Estimativa PCFE | Estimativa prediz fidelidade real | FE correlaciona com F |
| 6-Extracao | Fragmentos representam micro-unidades semanticas reais | fragmentation_quality >= 95% |
| 7-Inferencia | Drivers predizem >= 90% dos comportamentos | predictive_accuracy >= 90% |
| 8-Mapeamento | Scores internamente consistentes | internal_consistency >= 95% |
| 9-Perfil | Perfil representa a mente com fidelidade | fidelity_score >= 95% |
| 10-Recomendacao | Recomendacoes sao relevantes e gaps sao reais | recommendation_relevance validada |

### 2.4 Kahneman — Anti-Vies

Protocolos anti-vies por fase:

| Fase | Vies Combatido | Protocolo |
|------|---------------|-----------|
| 1-Pesquisa | Disponibilidade | NAO priorizar fontes mais acessiveis (ex: YouTube) sobre menos acessiveis (ex: livros) |
| 1-Pesquisa | Ancoragem | NAO comecar pela fonte mais famosa da pessoa |
| 1-Pesquisa | Confirmacao | Documentar pre-concepcoes do operador e isola-las |
| 2-Analise Rapida | Representatividade | Amostra deve cobrir TODOS os tipos de fonte, nao so os mais acessiveis |
| 3-Estimativa PCFE | Overconfidence | PCFE e estimativa, nao certeza — comunicar ranges, nao pontos |
| 6-Extracao | Fragmentacao de julgamento | Agente de extracao NAO julga importancia — apenas corta |
| 6-Extracao | Avaliacao independente | Agente de validacao e DIFERENTE do agente de extracao |
| 6-Extracao | Saliencia | MIUs "boring" sao tao importantes quanto MIUs "dramatic" |
| 7-Inferencia | Base rate | Antes de atribuir driver, verificar frequencia na populacao geral |
| 7-Inferencia | Avaliacao independente | 3 agentes independentes executam inferencia. Concordancia >= 0.85 |
| 7-Inferencia | Pre-mortem | "Se este driver estiver errado, o que acontece com o clone?" |
| 8-Mapeamento | Halo effect | Score alto em um componente NAO influencia outros |
| 8-Mapeamento | Fragmentacao | Cada componente calculado INDEPENDENTEMENTE |
| 8-Mapeamento | Ancoragem | NAO comecar pelo sistema mais familiar do operador |
| 9-Perfil | Blind test | Material NUNCA visto — o clone generaliza? |
| 9-Perfil | Noise audit | Re-executar com mesmos inputs — reprodutibilidade >= 0.90 |
| 9-Perfil | Pre-mortem final | "E 2027. Descobrimos que o clone e caricatura. O que deu errado?" |
| 10-Recomendacao | Gap validation | Gap identificado e real ou artefato do mapeamento? |

### 2.5 Gawande — Gates (Checklists DO-CONFIRM)

Os gates Gawande operam ENTRE fases. Cada gate tem items criticos (kill_items, bloqueantes) e nao-criticos (warnings).

**Resumo de gates:**

| Gate | Posicao | Kill Items (bloqueantes) | Non-Critical (warnings) |
|------|---------|--------------------------|------------------------|
| 1->2 | Apos Pesquisa | Zero fontes secundarias aceitas | Min 3 fontes encontradas, Material bruto preservado |
| 6->7 | Apos Extracao | Fragmentation quality >= 95%, Progressive Summarization completa (layers 1-3) | YAML valido, Rejeicao documentada, Assinatura agente |
| 7->8 | Apos Inferencia | Predictive accuracy >= 90%, >= 2 evidencias/driver, 3 agentes concordam (>= 0.85) | False positive < 5%, Correlacoes documentadas, Tiers classificados |
| 8->9 | Apos Mapeamento | Todos componentes tem score, Consistencia interna >= 95% | Crossref com catalogo, Mappings gerados |
| 9->10 | Apos Perfil | Fidelity >= 95%, Blind test passou, Pre-mortem executado | mind_tools populado, config.yaml atualizado, FE vs F comparado |

**Regras de interacao Gates Gawande <-> OMEGA:**

1. Kill items sao bloqueantes — se qualquer um falha, task OMEGA fica `blocked`
2. Warning items sao registrados em progress.log com tag `[GAWANDE_WARNING]`
3. Gates operam ENTRE fases — apos fase concluir e ANTES da proxima iniciar
4. Gate fallback — se nao pode ser verificado, tratado como WARNING. PM decide
5. Acumulacao — 3+ warnings no mesmo pipeline emitem alerta ao PM

Para detalhes de mapeamento Gates <-> OMEGA, ver `OMEGA.md` Secao 21.

---

## 3. Fase 0: INTAKE (Pre-Pipeline)

### Objetivo

Receber input, canonicalizar nome, verificar duplicidade de clone existente.

### Inputs

- Nome do especialista + dados opcionais (URLs, arquivos, texto)

### Processo

1. Canonicalizar nome -> slug (lowercase, sem acentos, hifens)
2. Verificar `synapse/minds/{slug}.yaml` — se existe, redirecionar para mind-update
3. Determinar categoria (copy, marketing, ux-design, ai, tech, business, content, product, saude, juridico)
4. Se categoria ambigua: perguntar ao usuario
5. Registrar dados opcionais fornecidos pelo usuario (URLs, paths, textos)

### Outputs

- slug canonico, categoria, flag de clone existente

### Criterios de Saida

- Slug definido, categoria definida, clone nao existe

### OMEGA Integration

| Campo | Valor |
|-------|-------|
| task_type | N/A |
| threshold | N/A |
| Nota | NAO e task OMEGA — pre-condicao de entrada |

**Mudanca vs v2.1:** Identico a Fase 0 anterior, EXCETO que o APEX/ICP Gate foi removido daqui e incorporado nas Fases 1-3. A avaliacao de viabilidade agora e mais sofisticada (nao binaria).

---

## 4. Fase 1: PESQUISA

### Objetivo

Pesquisar e catalogar todo material disponivel sobre a pessoa. Somente fontes primarias (produzidas pela propria pessoa).

### Inputs

- slug, categoria, dados opcionais do usuario

### Processo

1. Se usuario forneceu dados/URLs: processar como fontes prioritarias
2. WebSearch para fontes primarias:
   - Livros autorais
   - Videos/Podcasts longos (>30min)
   - Entrevistas em profundidade
   - Artigos/Blog posts autorais
   - Tweets/Threads substanciais
   - Palestras e apresentacoes
3. WebFetch para extrair conteudo textual de cada fonte encontrada
4. Catalogar cada fonte com metadados:
   ```yaml
   fonte:
     tipo: "{livro|video|podcast|entrevista|artigo|tweet|palestra}"
     titulo: "{titulo}"
     url: "{URL}"
     duracao_estimada: "{curta<15min|media15-60min|longa>60min}"
     profundidade: "{superficial|media|profunda}"
     primaria: true  # so fontes primarias entram
     idioma: "{pt|en|es|...}"
     data_publicacao: "{YYYY-MM-DD}"
   ```
5. Preservar material bruto intacto (Forte Layer 1)
6. Classificar e rejeitar fontes secundarias com log

### Outputs

- Catalogo de fontes com metadados
- Material bruto coletado

### Aplicacao das 5 Autoridades

- **Allen:** Captura exaustiva agnostica. Cada fonte e uma inbox.
- **Forte:** Layer 1 (Captured Notes) — tudo entra sem edicao. NUNCA editar material bruto.
- **Deming:** Hipotese: fontes cobrem corpus da pessoa. Metrica: catalogo completo.
- **Kahneman:** Anti-disponibilidade, anti-ancoragem, anti-confirmacao.
- **Gawande:** Gate 1->2 (ver abaixo).

### Gate Gawande 1->2

```yaml
gate_1_2:
  type: "DO-CONFIRM"
  kill_items: [1]
  items:
    - id: 1
      critical: true
      check: "ZERO fontes secundarias aceitas?"
    - id: 2
      critical: false
      check: "Minimo 3 fontes encontradas?"
    - id: 3
      critical: false
      check: "Material bruto preservado intacto?"
```

**Nota:** Coverage score >= 90% NAO e kill item aqui (como era no v2.1). A cobertura sera avaliada pela estimativa de fidelidade na Fase 3.

### OMEGA Integration

| Campo | Valor |
|-------|-------|
| task_type | research |
| threshold | 80 |
| max_iterations | 3 |
| OMEGA signals | `sources_validated`, `catalog_complete` |

---

## 5. Fase 2: ANALISE RAPIDA

### Objetivo

Extrair amostra representativa de MIUs para alimentar a estimativa de fidelidade pre-clone (PCFE).

### Inputs

- Material bruto coletado, catalogo de fontes

### Processo

1. Selecionar amostra representativa do material (nao exaustiva):
   - 1-2 fontes de CADA tipo disponivel
   - Priorizar fontes mais longas/profundas
   - Maximo 30% do material total (economia de tokens)
2. Extrair MIUs sample (20-50 MIUs) com classificacao semantica
3. Mapear cada MIU para a camada DNA que alimentaria:
   ```yaml
   miu_sample:
     texto: "{MIU}"
     tipo_semantico: "{comportamental|linguistico|narrativo|decisorio|framework|interacao_social|argumentativo|associativo}"
     camada_dna: "{filosofia|frameworks|heuristicas|metodologias|dilemas|paradoxos|associacoes|comunicacao}"
     profundidade: "{superficial|media|profunda}"
     fonte: "{source_path}"
   ```
4. Calcular metricas de cobertura:
   - Quantas camadas DNA tem pelo menos 1 MIU?
   - Qual a distribuicao por camada?
   - Quantas fontes unicas alimentam cada camada?

### Outputs

- MIUs sample (20-50 MIUs)
- Classificacao por camada DNA
- Metricas de cobertura

### Gate

Nao ha gate formal aqui — os dados fluem diretamente para a Fase 3.

### OMEGA Integration

| Campo | Valor |
|-------|-------|
| task_type | research |
| threshold | 80 |
| max_iterations | 3 |
| OMEGA signals | `mius_extracted`, `coverage_mapped` |

---

## 6. Fase 3: ESTIMATIVA DE FIDELIDADE (PCFE)

**ESTE E O SUB-WORKFLOW CENTRAL DO v3 — Pre-Clone Fidelity Estimation.**

### Objetivo

Calcular fidelidade estimada ANTES de rodar o pipeline completo.

### Inputs

- Catalogo de fontes, MIUs sample, metricas de cobertura

### 6.1 Formula de Estimativa de Fidelidade (PCFE)

```
FE = (VS * 0.20) + (DS * 0.15) + (CS * 0.30) + (PS * 0.20) + (QS * 0.15)

VS = Volume Score       (0-100) — quantidade de material
DS = Diversity Score     (0-100) — diversidade de tipos de fonte
CS = Coverage Score      (0-100) — cobertura das camadas DNA
PS = Profundidade Score  (0-100) — profundidade vs superficialidade
QS = Quality Score       (0-100) — qualidade das fontes
```

### 6.2 Calculo de Cada Componente

**VS (Volume Score) — Peso: 20%**

Avalia a quantidade bruta de material disponivel.

| Material disponivel | Score |
|---------------------|-------|
| >= 15 fontes primarias | 100 |
| 10-14 fontes | 85 |
| 7-9 fontes | 70 |
| 4-6 fontes | 55 |
| 2-3 fontes | 35 |
| 1 fonte | 15 |
| 0 fontes | 0 |

Bonus: +5 por cada livro autoral (max +15). +3 por cada entrevista >60min (max +9).

**DS (Diversity Score) — Peso: 15%**

Avalia a variedade de tipos de fonte. Fontes diversas capturam facetas diferentes da mente.

| Criterio | Pontos |
|----------|--------|
| Livros autorais presentes | 15 |
| Videos/Podcasts longos (>30min) presentes | 15 |
| Entrevistas em profundidade presentes | 15 |
| Artigos/Blog posts autorais presentes | 15 |
| Tweets/Threads substanciais presentes | 10 |
| Palestras/Apresentacoes presentes | 10 |
| Material em multiplos idiomas | 10 |
| Span temporal >= 5 anos | 10 |

DS = SUM(pontos) (cap em 100)

**CS (Coverage Score) — Peso: 30% — MAIOR PESO**

Avalia a cobertura das 8 camadas do DNA + 4 subcamadas baseado nas MIUs sample.

| Camada DNA | Peso relativo | Como estimar cobertura |
|------------|--------------|------------------------|
| Filosofia (core) | 15% | MIUs com crencas, principios, visao de mundo |
| Filosofia (hierarquia_valores, motivacao_profunda) | 10% | MIUs com escolhas entre valores, medos, impulsores |
| Frameworks | 15% | MIUs com passos-a-passo, modelos de decisao |
| Heuristicas (core) | 10% | MIUs com regras de bolso, atalhos |
| Heuristicas (modelo_social) | 5% | MIUs com interacoes sociais, reacao a critica |
| Metodologias | 10% | MIUs com processos, ferramentas |
| Dilemas | 10% | MIUs com trade-offs, evolucao de posicao |
| Paradoxos Produtivos | 15% | MIUs com contradicoes internas (CAMADA OURO) |
| Associacoes Conceituais | 5% | MIUs com pontes entre dominios |
| Comunicacao Avancada | 5% | MIUs com padroes retoricos, estilometria |

Para cada camada:
- 0 MIUs na amostra: 0%
- 1-2 MIUs: 40%
- 3-5 MIUs: 70%
- 6+ MIUs: 100%

CS = SUM(cobertura_camada * peso_camada)

**PS (Profundidade Score) — Peso: 20%**

Avalia se o material vai alem da superficie.

| Criterio | Pontos |
|----------|--------|
| >= 3 fontes com profundidade "profunda" | 30 |
| >= 1 fonte com profundidade "profunda" | 15 |
| >= 5 fontes com profundidade "media" | 25 |
| >= 3 fontes com profundidade "media" | 15 |
| Fontes cobrem decisoes reais (nao so teoria) | 15 |
| Fontes cobrem momentos de fracasso/vulnerabilidade | 15 |
| Material inclui contradicoes/evolucao de posicao | 15 |

PS = SUM(pontos) (cap em 100)

Bonus: Se existe material de entrevistas longas (>60min): +10
Penalidade: Se >70% das fontes sao tweets/posts curtos: -20

**QS (Quality Score) — Peso: 15%**

Avalia a confiabilidade e riqueza das fontes.

| Criterio | Pontos |
|----------|--------|
| 100% fontes primarias (nenhuma secundaria) | 25 |
| >= 90% fontes primarias | 15 |
| Fontes verificaveis (URL/ISBN rastreavel) | 20 |
| Transcricoes completas (nao resumos) | 20 |
| Material recente (ultimos 3 anos) incluso | 15 |
| Material historico (>5 anos atras) incluso | 10 |
| Nenhuma fonte com paywall inacessivel | 10 |

QS = SUM(pontos) (cap em 100)

### 6.3 Interpretacao da Fidelidade Estimada

| FE Range | Classificacao | Recomendacao |
|----------|--------------|--------------|
| >= 85 | EXCELENTE | GO — alta probabilidade de clone >= 95% |
| 70-84 | BOM | GO COM RESSALVAS — clone viavel, pode nao atingir 95% |
| 55-69 | MODERADO | ENRIQUECER — pedir mais fontes antes de continuar |
| 40-54 | FRACO | ENRIQUECER OBRIGATORIO — material insuficiente |
| < 40 | INSUFICIENTE | ABORTAR — material muito escasso para clone |

### 6.4 Mapeamento FE -> F (Correlacao Estimada)

A FE (Fidelidade Estimada) NAO e o mesmo que F (Fidelidade Real). A relacao e:

```
F_estimado_min = FE * 0.85   (pior caso — material nao rende tanto)
F_estimado_max = FE * 1.10   (melhor caso — material rende mais que esperado)
F_provavel     = FE * 0.95   (caso tipico)
```

Exemplo: FE = 80 -> F provavel entre 68-88, media 76.

### 6.5 Identificacao de Gaps

Para cada camada DNA com CS < 40%, gerar um gap report:

```yaml
gaps:
  - camada: "paradoxos_produtivos"
    cobertura: 0%
    impacto: "CRITICO — 15% do CS, 35% do score de fidelidade final"
    recomendacao: "Buscar entrevistas longas onde discute contradicoes"
  - camada: "modelo_social"
    cobertura: 40%
    impacto: "MODERADO — afeta blind test de interacao"
    recomendacao: "Buscar debates ou interacoes publicas"
```

### 6.6 Correlacao PCFE com Formula de Fidelidade Real

A PCFE e propositalmente construida para CORRELACIONAR com a formula de fidelidade real (F = L*0.20 + B*0.30 + C*0.15 + K*0.20 + V*0.15):

| Componente PCFE | Correlacao com Fidelidade Real |
|-----------------|-------------------------------|
| VS (Volume) | Mais material -> mais MIUs -> mais evidencias para todos componentes |
| DS (Diversidade) | Fontes diversas -> captura facetas diferentes -> L e V mais altos |
| CS (Cobertura) | Cobertura DNA -> B e K mais altos (drivers + frameworks cobertos) |
| PS (Profundidade) | Material profundo -> C mais alto (paradoxos so emergem em profundidade) |
| QS (Qualidade) | Fontes primarias/conteudo completo -> todos componentes mais confiaveis |

O MAIOR PESO no CS (30%) reflete que a cobertura das camadas DNA e o melhor preditor de fidelidade final, assim como B (Behavioral Fidelity) tem o maior peso na formula real (30%).

### Outputs

- FE (Fidelidade Estimada, 0-100)
- Breakdown por componente (VS, DS, CS, PS, QS)
- Gaps identificados por camada DNA
- Recomendacao (GO / GO COM RESSALVAS / ENRIQUECER / ABORTAR)

### OMEGA Integration

| Campo | Valor |
|-------|-------|
| task_type | planning |
| threshold | 85 |
| max_iterations | 3 |
| OMEGA signals | `fe_calculated`, `gaps_identified` |

---

## 7. Fase 4: GATE DE APROVACAO HUMANA

### Objetivo

Apresentar estimativa de fidelidade e aguardar decisao humana antes de iniciar pipeline pesado.

### Inputs

- FE, breakdown por componente, gaps, recomendacao

### Formato de Apresentacao

```
============================================================
   ESTIMATIVA DE FIDELIDADE PRE-CLONE
============================================================

   Especialista: {Nome Completo}
   Categoria: {categoria}
   Slug: {slug}

   FIDELIDADE ESTIMADA: {FE}% ({classificacao})

   Breakdown:
   +-------------------------------+--------+---------+
   | Componente                    | Score  |  Peso   |
   +-------------------------------+--------+---------+
   | Volume (VS)                   | {VS}   |  20%    |
   | Diversidade (DS)              | {DS}   |  15%    |
   | Cobertura DNA (CS)            | {CS}   |  30%    |
   | Profundidade (PS)             | {PS}   |  20%    |
   | Qualidade (QS)                | {QS}   |  15%    |
   +-------------------------------+--------+---------+
   | FIDELIDADE ESTIMADA (FE)      | {FE}   | 100%    |
   +-------------------------------+--------+---------+

   Fidelidade Real Estimada:
   - Pior caso:  {F_min}%
   - Caso tipico: {F_provavel}%
   - Melhor caso: {F_max}%

   Fontes Encontradas: {N} ({N tipos diferentes})

   Gaps Identificados:
   {gap_list}

   Recomendacao: {GO | GO COM RESSALVAS | ENRIQUECER | ABORTAR}

============================================================
   OPCOES:
   [1] APROVAR — Iniciar pipeline completo
   [2] ENRIQUECER — Fornecer mais fontes e re-estimar
   [3] ABORTAR — Cancelar clonagem
============================================================

   Qual opcao? (1/2/3)
```

### Fluxo por Opcao

- **[1] APROVAR:** Registrar decisao, avancar para Fase 5 (Scaffold)
- **[2] ENRIQUECER:** Pedir fontes adicionais, voltar para Fase 1 (loop). Maximo 3 loops de enriquecimento.
- **[3] ABORTAR:** Registrar motivo, encerrar pipeline

### Loop de Enriquecimento

Se o usuario escolhe [2], pode fornecer novas URLs/arquivos/textos. O pipeline volta para a Fase 1 adicionando o novo material ao catalogo existente, re-roda Fases 2-3 e apresenta nova estimativa. Maximo 3 loops de enriquecimento. Apos 3 tentativas, forcar decisao GO ou ABORTAR.

### Outputs

- Decisao: APROVAR / ENRIQUECER / ABORTAR

### OMEGA Integration

| Campo | Valor |
|-------|-------|
| task_type | N/A |
| threshold | N/A |
| Nota | NAO e task OMEGA — gate humano |

---

## 8. Fase 5: SCAFFOLD (Pos-Aprovacao)

### Objetivo

Criar toda infraestrutura do squad antes do pipeline pesado.

### Inputs

- slug, categoria, FE, catalogo de fontes

### Processo

1. Criar diretorio squad completo:
   ```
   DUARTEOS/{Categoria}/squad/{slug}/
   |-- agents/
   |-- artifacts/behavioral/
   |-- artifacts/cognitive/
   |-- artifacts/linguistic/
   |-- artifacts/narrative/
   |-- checklists/
   |-- data/raw/{articles,interviews,podcasts,books,tweets,videos,speeches}/
   |-- data/processed/
   |-- drivers/
   |-- frameworks/{slug}/
   |-- phrases/
   |-- system-components/
   |-- tasks/
   |-- voice/
   |-- config.yaml
   ```

2. Criar config.yaml skeleton:
   ```yaml
   clone:
     name: "{Nome}"
     slug: "{slug}"
     version: "0.1.0"
     pipeline_version: "3"
     created_at: "{timestamp}"
     fidelity_estimated: {FE}
     fidelity_score: null  # preenchido na Fase 9
     status: "scaffolding"
     category: "{categoria}"
   ```

3. Criar DNA skeleton em `synapse/minds/{slug}.yaml` (usando mind-template.yaml)

4. Criar TASKS do pipeline:
   ```
   tasks/
   |-- 01-extracao-completa-{slug}.md
   |-- 02-inferencia-drivers-{slug}.md
   |-- 03-mapeamento-sistemas-{slug}.md
   |-- 04-perfil-fidelidade-{slug}.md
   |-- 05-agente-operacional-{slug}.md
   |-- 06-squad-artifacts-{slug}.md
   ```

5. Criar checklist personalizado:
   ```
   checklists/{slug}-pipeline-checklist.yaml
   ```
   Com gates para cada fase restante.

### Outputs

- Diretorios squad (21+ dirs)
- config.yaml skeleton
- DNA skeleton em synapse/minds/
- TASKS + Checklists personalizados

### Gate

Validar que todos os 21+ dirs existem e config.yaml e parseavel.

### OMEGA Integration

| Campo | Valor |
|-------|-------|
| task_type | implementation |
| threshold | 90 |
| max_iterations | 3 |
| OMEGA signals | `files_created`, `schema_valid` |

---

## 9. Fase 6: EXTRACAO

### Objetivo

Extrair Micro-Unidades Interpretativas Neurais (MIUs) e fragmentos semanticos do material bruto.

**Principio fundamental:** Cortes sao SEMANTICOS, nao por tamanho. Cada MIU = 1 unidade de ensino completa com significado autonomo.

### Inputs

- Entidade DB: `contents` (material bruto JA coletado na Fase 1 e validado na Fase 2)
- Diretorios JA criados na Fase 5 (Scaffold)

### Processo: Extracao Linguistica + Validacao

1. **Extracao:** Separar material bruto em MIUs — fragmentos semanticos minimos com significado autonomo
2. **Classificacao:** Cada MIU recebe tipo semantico: comportamental, linguistico, narrativo, decisorio, framework, interacao_social, argumentativo, associativo
3. **Validacao (agente independente):** MIU tem significado autonomo? SIM -> validated | NAO -> rejected

### Outputs

- **Entidades DB:** `mius`, `fragments`
- **Filesystem:** `data/processed/fragments/`, `data/processed/transcriptions/`

### Entidade: mius

```yaml
mius:
  description: "Micro-Unidades Interpretativas Neurais — fragmentos semanticos atomicos"
  type: "hot_compute"
  fields:
    - id
    - content_id           # FK -> contents
    - mind_id
    - text
    - semantic_type        # comportamental, linguistico, narrativo, decisorio, framework
    - timestamp_start      # para video/audio
    - timestamp_end
    - validation_status    # pending, validated, rejected
    - layer                # 1=raw, 2=fragment, 3=essence, 4=actionable (Forte)
```

### Entidade: fragments

```yaml
fragments:
  description: "Fragmentos processados e indexados"
  type: "storage"
  fields:
    - id
    - miu_id               # FK -> mius
    - content_id
    - fragment_text
    - context
    - tags
```

### Progressive Summarization (Forte)

| Layer | Conteudo | Localizacao |
|-------|----------|-------------|
| Layer 1 | Texto bruto integral | `data/raw/` |
| Layer 2 | MIUs extraidas — trechos relevantes | DB `mius` (validation_status=validated) |
| Layer 3 | Essencia destilada de cada MIU | Campo `essence` em `mius` |
| Layer 4 | Insight acionavel | Gerado na Fase 7 apos inferencia |

**Intermediate Packets:** Cada MIU validada e um Intermediate Packet reutilizavel que alimenta multiplos drivers, frameworks e componentes.

### Gate Gawande 6->7

```yaml
gate_6_7:
  type: "DO-CONFIRM"
  kill_items: [1, 2]
  items:
    - id: 1
      critical: true
      check: "Fragmentation quality >= 95%?"
    - id: 2
      critical: true
      check: "Progressive Summarization completa (layers 1-3)?"
    - id: 3
      critical: false
      check: "Hook de validacao YAML executou sem erros?"
    - id: 4
      critical: false
      check: "Taxa de rejeicao documentada e justificada?"
    - id: 5
      critical: false
      check: "Assinatura de agente em cada MIU?"
```

### Metricas

| Metrica | Threshold | Tipo |
|---------|-----------|------|
| fragmentation_quality | >= 95% | Kill item |
| semantic_ratio | >= 90% cortes semanticos vs arbitrarios | Warning |
| progressive_summarization | Layers 1-3 completas | Kill item |
| rejection_rate | Documentada e justificada | Warning |

### OMEGA Integration

| Campo | Valor |
|-------|-------|
| task_type | research |
| threshold | 80 |
| max_iterations | 3 |
| OMEGA signals | `schema_valid`, `data_integrity` |

---

## 10. Fase 7: INFERENCIA

### Objetivo

Inferir drivers/motivadores a partir das MIUs validadas. Criar evidencias MIU<->Driver. Calcular correlacoes entre drivers. Classificar em tiers de performance.

### Inputs

- Entidade DB: `mius` (validated, da Fase 6)

### Processo: Motor de Inferencia

```
Step 1: Para cada MIU validada, perguntar:
        "Que motivador/driver explica este comportamento/declaracao/decisao?"

Step 2: Gerar registros em miu_driver_evidence vinculando MIU <-> Driver
        com strength de evidencia e referencia exata a fonte.

Step 3: Agregar evidencias por driver -> calcular forca (strength) e
        confianca (confidence) -> gerar mind_drivers.

Step 4: Calcular correlacoes entre drivers da mente ->
        gerar driver_relationships.

Step 5: Classificar drivers em tiers de performance:
        - Gold: alta forca + alta confianca + alta frequencia
        - Silver: media forca ou confianca
        - Bronze: evidencia presente mas limitada
```

### Protocolo de Avaliacao Independente (Kahneman)

3 agentes independentes executam inferencia sobre as mesmas MIUs. Suas atribuicoes MIU->Driver sao comparadas ANTES de mediacao. Coeficiente de concordancia inter-agente >= 0.85.

**Base rate:** Antes de atribuir driver, verificar frequencia na populacao geral. Se 80% das pessoas tem "busca por significado", nao e diferenciador.

### Outputs

- **Entidades DB:** `mind_drivers`, `miu_driver_evidence`, `driver_relationships`, `drivers`
- **Filesystem:** `drivers/` (driver-map.yaml, driver-correlations.yaml, driver-strength.yaml, driver-network.yaml)

### Entidade: drivers

```yaml
drivers:
  description: "Catalogo mestre de drivers/motivadores"
  type: "entity"
  fields:
    - id
    - name
    - description
    - category               # cognitivo, emocional, comportamental, social
    - base_rate              # frequencia na populacao geral (Kahneman)
```

### Entidade: mind_drivers

```yaml
mind_drivers:
  description: "Drivers especificos atribuidos a uma mente"
  type: "hot_compute"
  fields:
    - id
    - mind_id
    - driver_id              # FK -> drivers
    - strength               # forca calculada
    - confidence             # confianca na inferencia
    - performance_tier       # gold, silver, bronze
```

### Entidade: miu_driver_evidence

```yaml
miu_driver_evidence:
  description: "Evidencias que ligam MIUs a drivers — rastreabilidade completa"
  type: "evidence"
  fields:
    - id
    - miu_id                 # FK -> mius
    - driver_id              # FK -> drivers
    - mind_id
    - evidence_text
    - evidence_strength      # quao forte e esta evidencia
    - source_reference       # citacao exata
```

### Entidade: driver_relationships

```yaml
driver_relationships:
  description: "Correlacoes e relacoes entre drivers"
  type: "relational"
  fields:
    - id
    - driver_a_id            # FK -> drivers
    - driver_b_id            # FK -> drivers
    - correlation            # -1.0 a 1.0
    - relationship_type      # causal, correlacional, antagonico
    - mind_id                # pode ser global ou per-mind
```

### Gate Gawande 7->8

```yaml
gate_7_8:
  type: "DO-CONFIRM"
  kill_items: [1, 2, 4]
  items:
    - id: 1
      critical: true
      check: "Predictive accuracy >= 90%?"
    - id: 2
      critical: true
      check: "Cada mind_driver tem >= 2 evidencias em miu_driver_evidence?"
    - id: 3
      critical: false
      check: "False positive rate < 5%?"
    - id: 4
      critical: true
      check: "3 agentes independentes concordam (>= 0.85)?"
    - id: 5
      critical: false
      check: "driver_relationships calculados e documentados?"
    - id: 6
      critical: false
      check: "Drivers classificados em tiers (gold/silver/bronze)?"
```

### Metricas

| Metrica | Threshold | Tipo |
|---------|-----------|------|
| predictive_accuracy | >= 90% | Kill item |
| false_positive_rate | < 5% | Warning |
| evidence_density | >= 2.0 MIUs por driver | Kill item |
| inter_agent_agreement | >= 0.85 | Kill item |

### OMEGA Integration

| Campo | Valor |
|-------|-------|
| task_type | mind_clone |
| threshold | 95 |
| max_iterations | 3 |
| model | Opus (obrigatorio) |
| OMEGA signals | `fidelity_check`, `evidence_linked` |

---

## 11. Fase 8: MAPEAMENTO

### Objetivo

Mapear a mente contra sistemas de classificacao (Big Five, MBTI, Eneagrama, catalogo de 1000+ artefatos cognitivos) e gerar scores por componente.

### Inputs

- Entidades DB: `mind_drivers`, `driver_relationships`, `mapping_systems`, `system_components`, `component_driver_map`

### Processo: Mapeamento

```
Step 1: Carregar mapping_systems disponiveis (Big Five, MBTI, Eneagrama,
        catalogo proprietario de 1000+ artefatos cognitivos).

Step 2: Para cada system_component, usar component_driver_map para
        calcular score da mente baseado nos mind_drivers identificados.

Step 3: Gerar mind_component_scores — pontuacao em cada dimensao
        de cada sistema (ex: Openness = 0.92, Conscientiousness = 0.78).

Step 4: Agregar scores em mind_system_mappings — perfil completo
        da mente em cada sistema de mapeamento.
```

### Outputs

- **Entidades DB:** `mind_component_scores`, `mind_system_mappings`
- **Filesystem:** `system-components/{mind-name}-system.yaml`, `artifacts/` populado

### Entidade: mapping_systems

```yaml
mapping_systems:
  description: "Sistemas de mapeamento disponiveis"
  type: "catalog"
  fields:
    - id
    - name                   # Big Five, MBTI, Eneagrama, etc.
    - version
    - components             # lista de componentes do sistema
```

### Entidade: system_components

```yaml
system_components:
  description: "Componentes individuais de cada sistema"
  type: "storage"
  fields:
    - id
    - mapping_system_id      # FK -> mapping_systems
    - name                   # ex: "Openness to Experience", "INTJ", "Tipo 5"
    - description
    - scale_min
    - scale_max
```

### Entidade: component_driver_map

```yaml
component_driver_map:
  description: "Mapa componente <-> driver"
  type: "relational"
  fields:
    - id
    - component_id           # FK -> system_components
    - driver_id              # FK -> drivers
    - affinity_score         # quao forte e a relacao
    - direction              # positivo, negativo
```

### Entidade: mind_component_scores

```yaml
mind_component_scores:
  description: "Scores da mente em cada componente"
  type: "hot_compute"
  fields:
    - id
    - mind_id
    - component_id           # FK -> system_components
    - score                  # valor no sistema (ex: 0.85 em Openness)
    - confidence
    - evidence_count         # quantas evidencias suportam
```

### Entidade: mind_system_mappings

```yaml
mind_system_mappings:
  description: "Mapeamentos completos da mente por sistema"
  type: "storage"
  fields:
    - id
    - mind_id
    - mapping_system_id      # FK -> mapping_systems
    - profile_summary        # perfil textual completo
    - calculated_at
```

### Gate Gawande 8->9

```yaml
gate_8_9:
  type: "DO-CONFIRM"
  kill_items: [1, 2]
  items:
    - id: 1
      critical: true
      check: "Todos os componentes relevantes tem score?"
    - id: 2
      critical: true
      check: "Consistencia interna entre sistemas >= 95%?"
    - id: 3
      critical: false
      check: "Cruzamento com catalogo de artefatos cognitivos completo?"
    - id: 4
      critical: false
      check: "mind_system_mappings gerados para todos os sistemas?"
```

### Metricas

| Metrica | Threshold | Tipo |
|---------|-----------|------|
| component_coverage | 100% | Kill item |
| internal_consistency | >= 95% | Kill item |
| catalog_crossref | Completo | Warning |

### OMEGA Integration

| Campo | Valor |
|-------|-------|
| task_type | mind_clone |
| threshold | 95 |
| max_iterations | 3 |
| OMEGA signals | `mapping_complete`, `scores_calculated` |

---

## 12. Fase 9: PERFIL

### Objetivo

Agregar tudo em um Perfil Agregado e gerar a entidade `minds` final. A mente NASCE nesta fase.

### Inputs

- Entidades DB: `mind_component_scores`, `mind_system_mappings`, `mind_drivers`, `driver_relationships`

### Processo: Perfil Agregado

```
Step 1: Cruzar mind_component_scores + mind_system_mappings + mind_drivers
        para gerar perfil unificado da mente.

Step 2: Calcular score_apex (relevancia), archetype, complexity_level, status.

Step 3: Gerar entidade em minds — a mente esta NASCIDA no sistema.

Step 4: Identificar mind_tools: quais ferramentas cognitivas do catalogo
        de 1000+ artefatos esta mente utiliza? Com que proficiencia?
```

### Outputs

- **Entidades DB:** `minds`, `mind_tools`
- **Filesystem:** config.yaml atualizado, artifacts/ completo

### Entidade: minds

```yaml
minds:
  description: "A mente finalizada — entidade principal do sistema"
  type: "entity"
  fields:
    - id
    - name
    - status                 # draft, active, premium, archived
    - score_apex
    - archetype
    - complexity_level
    - version
    - created_at
    - profile_aggregated     # perfil completo agregado
```

### Entidade: mind_tools

```yaml
mind_tools:
  description: "Ferramentas cognitivas que a mente utiliza"
  type: "relational"
  fields:
    - id
    - mind_id
    - tool_id                # FK -> tools
    - proficiency            # quao bem a mente usa esta ferramenta
    - evidence_count
    - source                 # como foi identificado: inferido, declarado, observado
```

### Validacao de Fidelidade (Kahneman)

1. **Blind test:** Apresentar material NUNCA visto. O clone generaliza corretamente? Se nao -> overfitting.
2. **Noise audit:** Re-executar com mesmos inputs. Varia significativamente? Reprodutibilidade >= 0.90.
3. **Pre-mortem final:** "E 2027. Descobrimos que o clone e caricatura. O que deu errado?" Documentar cenarios de falha.

### Formula de Fidelidade

Ver Secao 18 para formula completa. Threshold: composite >= 95%, nenhum componente abaixo de 85%.

### Calibracao FE vs F (Novo no v3)

Apos calcular F (fidelidade real), comparar com FE (estimativa da Fase 3):

```
delta_estimativa = F - FE
accuracy_estimativa = 100 - abs(delta_estimativa)
```

- Se `accuracy_estimativa >= 70%`: estimativa foi adequada. Registrar para calibracao.
- Se `accuracy_estimativa < 70%`: registrar anomalia em `.claude/omega/pcfe-calibration.yaml` para ajuste futuro dos pesos da PCFE.

Armazenar `{slug, FE, F_real, delta, accuracy}` em `.claude/omega/pcfe-calibration.yaml` para cada clone.

### Gate Gawande 9->10

```yaml
gate_9_10:
  type: "DO-CONFIRM"
  kill_items: [1, 2, 3]
  items:
    - id: 1
      critical: true
      check: "Fidelity score composto >= 95%?"
    - id: 2
      critical: true
      check: "Blind test passou?"
    - id: 3
      critical: true
      check: "Pre-mortem executado e documentado?"
    - id: 4
      critical: false
      check: "mind_tools populado com proficiency scores?"
    - id: 5
      critical: false
      check: "config.yaml atualizado com status 'active'?"
    - id: 6
      critical: false
      check: "FE vs F comparado e registrado em pcfe-calibration.yaml?"
```

### Metricas

| Metrica | Threshold | Tipo |
|---------|-----------|------|
| fidelity_score_composite | >= 95% | Kill item |
| no_component_below | 85% | Kill item |
| blind_test | Passed | Kill item |
| noise_audit_reproducibility | >= 0.90 | Warning |
| premortem | Executado e documentado | Kill item |

### OMEGA Integration

| Campo | Valor |
|-------|-------|
| task_type | mind_clone |
| threshold | 95 |
| max_iterations | 3 |
| OMEGA signals | `fidelity_check`, `tests_pass` |

---

## 13. Fase 10: RECOMENDACAO

### Objetivo

Dado uma mente ativa, recomendar ferramentas cognitivas para desenvolvimento e identificar gaps de capacidade. Transforma o clone de "retrato estatico" em "sistema de crescimento".

### Inputs

- Entidades DB: `minds`, `mind_tools`, `tools`, `tool_driver_affinities`, `tool_relations`

### Processo: Match Engine

```
Step 1: Carregar mind_drivers e mind_tools da mente.

Step 2: Cruzar drivers com tool_driver_affinities:
        "Quais ferramentas do catalogo tem alta afinidade com os
        drivers desta mente mas que ela AINDA NAO utiliza?"

Step 3: Verificar tool_relations para sequenciamento:
        "Esta ferramenta tem pre-requisitos? A mente ja domina?"

Step 4: Gerar Recommended Tools — ordenados por
        relevancia x afinidade x viabilidade (pre-reqs atendidos).

Step 5: Gerar Development Gaps — areas onde a mente tem drivers fortes
        mas ferramentas fracas ou ausentes.
```

### Outputs

- Recommended Tools (ferramentas que a mente deveria desenvolver)
- Development Gaps (lacunas identificadas no perfil cognitivo)

### Entidade: tools

```yaml
tools:
  description: "Catalogo mestre de ferramentas cognitivas"
  type: "catalog"
  fields:
    - id
    - name                   # ex: "First Principles", "Inversao", "Analogia"
    - category               # framework, heuristica, modelo mental
    - description
    - difficulty_level
    - prerequisites          # ferramentas que deve dominar antes
```

### Entidade: tool_driver_affinities

```yaml
tool_driver_affinities:
  description: "Afinidade entre ferramentas e drivers"
  type: "hot_compute"
  fields:
    - id
    - tool_id                # FK -> tools
    - driver_id              # FK -> drivers
    - affinity_score         # quao util e esta ferramenta para este driver
    - context                # em qual contexto a afinidade e valida
```

### Entidade: tool_relations

```yaml
tool_relations:
  description: "Relacoes entre ferramentas"
  type: "relational"
  fields:
    - id
    - tool_a_id              # FK -> tools
    - tool_b_id              # FK -> tools
    - relation_type          # prerequisite, complementary, alternative, synergistic
```

### Use Cases

| Use Case | Exemplo |
|----------|---------|
| **Operacao do clone** | Copywriter com driver forte "persuasao emocional" sem framework "fascinations" -> Recomenda `frameworks/bencivenga/fascinations.yaml` |
| **Desenvolvimento** | Mente com gap em "pensamento analitico" -> Recomenda First Principles, Inversao, Steel Manning |
| **Composicao de squad** | Mente tem gap X -> buscar mente com forca X no catalogo -> squad complementar |

### OMEGA Integration

| Campo | Valor |
|-------|-------|
| task_type | mind_clone |
| threshold | 95 |
| max_iterations | 3 |

---

## 14. Estrutura de Pastas por Squad

Baseado no padrao real do squad `copy/` do MMOS, a estrutura generica para QUALQUER squad:

```
DUARTEOS/squad/{categoria}/
|-- agents/                          <- 1 arquivo .md por mente ativa
|   |-- {mind-name-1}.md
|   |-- {mind-name-2}.md
|   +-- {mind-name-n}.md
|
|-- archive/                         <- Versoes anteriores (PARA do Forte)
|   |-- agents/
|   +-- README.md
|
|-- authority/                       <- Provas sociais, credenciais
|
|-- checklists/                      <- Gates Gawande (READ-DO e DO-CONFIRM)
|   |-- {technique}-checklist.md     <- Checklists por tecnica/metodo
|   |-- {mind-name}-checklist.md     <- Checklists especificos por mente
|   |-- quality-checklist.md         <- Checklist geral de qualidade
|   +-- agent-creation-checklist.md  <- Checklist para criacao de agentes
|
|-- data/                            <- Base de conhecimento estatica
|   |-- {source}-dna.yaml            <- DNAs extraidos
|   |-- {domain}-kb.md               <- Knowledge bases do dominio
|   +-- {extraction}-extraction.md   <- Extracoes de metodologias
|
|-- docs/                            <- Documentacao do squad
|
|-- frameworks/                      <- Frameworks POR MENTE (1 diretorio cada)
|   +-- {mind-name}/
|       |-- {framework-1}.yaml
|       |-- {framework-2}.yaml
|       +-- {framework-n}.yaml
|
|-- lib/                             <- Biblioteca de carregamento e helpers
|   +-- loader.md
|
|-- phrases/                         <- Frases-assinatura extraidas
|
|-- projects/                        <- Projetos ativos
|
|-- reference/                       <- Material de referencia
|
|-- scripts/                         <- Hooks e automacoes
|
|-- swipe/                           <- Exemplos reais (swipe files)
|
|-- swipe-sources/                   <- Fontes e metadados dos swipes
|
|-- tasks/                           <- Tarefas executaveis (prompts de acao)
|   |-- analyze-mental-conversation.md
|   |-- audit-{technique}.md
|   |-- create-{deliverable}.md
|   +-- ... (20+ tasks por squad)
|
|-- templates/                       <- Templates reutilizaveis
|
|-- voice/                           <- Tom de voz por persona
|
+-- workflows/                       <- Pipelines multi-step
    |-- wf-{workflow-name}.yaml
    +-- ...
```

**Categorias validas (lowercase kebab-case):** copy, marketing, ux-design, ai, tech, business, content, product, saude, juridico

**Convencao de nomes:** `DUARTEOS/squad/{categoria}/{diretorio}` — categoria em kebab-case, slug de mente em kebab-case.

---

## 15. Mind-Create vs Mind-Update

### Mind-Create: Pipeline Completo (Fase 0 -> 10)

```
/DUARTEOS:mmos:mind-clone {nome-do-especialista}
  |
  +-- Fase 0: INTAKE (canonicalizacao + dedup)
  |
  +-- Fase 1: PESQUISA (WebSearch + WebFetch + material fornecido)
  +-- Fase 2: ANALISE RAPIDA (MIUs sample + cobertura)
  +-- Fase 3: ESTIMATIVA PCFE (fidelidade estimada pre-clone)
  |
  +-- Fase 4: GATE HUMANO (GO / ENRIQUECER / ABORTAR)
  |   +-- Se ENRIQUECER: volta para Fase 1 (max 3 loops)
  |   +-- Se ABORTAR: FIM
  |
  +-- Fase 5: SCAFFOLD (dirs, tasks, checklists, config.yaml)
  |
  +-- Fase 6: EXTRACAO (MIUs completas + fragments + estilometria)
  +-- Fase 7: INFERENCIA (drivers + evidencias + DNA 6 camadas)
  +-- Fase 8: MAPEAMENTO (scores + systems)
  +-- Fase 9: PERFIL (mente nasce, fidelidade calculada, FE vs F)
  +-- Fase 10: RECOMENDACAO (agente .md + squad artifacts + tools + gaps)
  |
  +-- DNA persiste em .claude/synapse/minds/{slug}.yaml
  +-- Agente gerado em DUARTEOS/squad/{categoria}/agents/{slug}.md
```

### Mind-Update: Ponto de Entrada Diferente

O mind-update usa o MESMO pipeline mas entra na fase adequada ao tipo de novo material:

| Tipo de Novo Material | Fase de Entrada | Exemplo |
|----------------------|-----------------|---------|
| Novas fontes brutas | Fase 6 (Extracao) | Novo podcast, novo livro |
| Novas MIUs ja extraidas | Fase 6 (Extracao) | Fragmentos pre-processados |
| Novo driver identificado | Fase 7 (Inferencia) | Driver manual ou cross-reference |
| Novo sistema de classificacao | Fase 8 (Mapeamento) | Novo framework de personalidade |
| Recalibracao de perfil | Fase 9 (Perfil) | Nova validacao com dados existentes |

**Na pratica do DuarteOS**, a maioria dos updates entra pela Fase 6 (novas fontes) e roda o pipeline parcial 6->7->DNA Merge->Regression.

**Nota:** Mind-update NAO passa pela PCFE (Fases 1-5). O clone ja existe e ja foi validado. Apenas o pipeline pesado (Fases 6-10) e relevante para updates.

### Regras de Merge Incremental

| Operacao | Regra | Exemplo |
|----------|-------|---------|
| **ADICIONAR** | Novos itens sao adicionados ao final de cada lista | Nova crenca -> append em `filosofia.crencas_core` |
| **NUNCA REMOVER** | Itens existentes NUNCA sao removidos, mesmo que contraditados | Crenca antiga permanece, nova e adicionada |
| **REFORCAR** | Itens existentes recebem novo `source_path` | `evidencia` atualizada com nova referencia |
| **PARADOXOS** | Novo paradoxo -> adicionar. Existente -> adicionar exemplo | Secao cresce monotonicamente |
| **EVOLUCAO** | Posicao mudou -> registrar em `dilemas.evolucao` | `de:` / `para:` / `quando:` / `motivo:` |
| **DEDUP** | NAO duplicar insight identico | Verificar similaridade antes de adicionar |

### Rollback Automatico

Se a fidelidade pos-update cai mais de 5% em relacao ao valor pre-update:

1. Restaurar backup automatico
2. Reverter agente .md
3. Registrar rollback no ingestion_log
4. Notificar usuario com diagnostico

**Se fidelidade < 95% mas queda <= 5%:** Warning + notificacao ao usuario com opcoes (aceitar, rollback, fornecer mais fontes).

### Classificacao de Insights (Delta Analysis)

| Tipo | Significado | Acao |
|------|-------------|------|
| **NOVO** | Insight inexistente no DNA atual | Adicionar como nova entrada |
| **REFORCO** | Confirma/fortalece existente | Incrementar peso/fonte |
| **EVOLUCAO** | Modifica/nuanca existente | Preservar ambas visoes com evidencia |

---

## 16. Integracao OMEGA v2

Cada fase MMOS roda como task OMEGA independente. O contrato completo esta em `OMEGA.md` Secao 20.

### Mapeamento Fase -> Task OMEGA

| Fase MMOS | Nome | task_type OMEGA | Threshold | max_iterations | Completion Signals |
|-----------|------|----------------|-----------|----------------|-------------------|
| 0 | Intake | N/A | N/A | N/A | N/A (pre-condicao) |
| 1 | Pesquisa | research | 80 | 3 | `sources_validated`, `catalog_complete` |
| 2 | Analise Rapida | research | 80 | 3 | `mius_extracted`, `coverage_mapped` |
| 3 | Estimativa PCFE | planning | 85 | 3 | `fe_calculated`, `gaps_identified` |
| 4 | Aprovacao Humana | N/A | N/A | N/A | N/A (gate humano) |
| 5 | Scaffold | implementation | 90 | 3 | `files_created`, `schema_valid` |
| 6 | Extracao | research | 80 | 3 | `schema_valid`, `data_integrity` |
| 7 | Inferencia | mind_clone | 95 | 3 | `fidelity_check`, `evidence_linked` |
| 8 | Mapeamento | mind_clone | 95 | 3 | `mapping_complete`, `scores_calculated` |
| 9 | Perfil | mind_clone | 95 | 3 | `fidelity_check`, `tests_pass` |
| 10 | Recomendacao | mind_clone | 95 | 3 | `files_created`, `schema_valid` |

### Fluxo OMEGA Completo

```
/DUARTEOS:mmos:mind-clone {nome}
  |
  +-- OMEGA inicializa pipeline MMOS v3
  |   +-- Carrega Synapse L0-L7 com contexto de mind clone
  |
  +-- FASE 0: Intake (pre-condicao, NAO e task OMEGA)
  |
  +-- FASE 1: Pesquisa (task_type: research, threshold: 80)
  |   +-- OMEGA loop: executa, score, feedback, repeat
  |   +-- Gate Gawande 1->2: kill items bloqueantes
  |   +-- Dual-gate met -> avanca
  |
  +-- FASE 2: Analise Rapida (task_type: research, threshold: 80)
  |   +-- OMEGA loop
  |   +-- Sem gate formal -> flui para Fase 3
  |
  +-- FASE 3: Estimativa PCFE (task_type: planning, threshold: 85)
  |   +-- OMEGA loop
  |   +-- Dual-gate met -> avanca
  |
  +-- FASE 4: Gate Humano (NAO e task OMEGA)
  |   +-- Apresenta FE + gaps + recomendacao
  |   +-- Aguarda decisao: APROVAR / ENRIQUECER / ABORTAR
  |   +-- Se ENRIQUECER: volta Fase 1 (max 3 loops)
  |
  +-- FASE 5: Scaffold (task_type: implementation, threshold: 90)
  |   +-- OMEGA loop
  |   +-- Dual-gate met -> avanca
  |
  +-- FASE 6: Extracao (task_type: research, threshold: 80)
  |   +-- OMEGA loop
  |   +-- Gate Gawande 6->7
  |   +-- Dual-gate met -> avanca
  |
  +-- FASE 7: Inferencia (task_type: mind_clone, threshold: 95)
  |   +-- OMEGA loop (modelo: Opus obrigatorio)
  |   +-- Gate Gawande 7->8
  |   +-- Dual-gate met -> avanca
  |
  +-- FASE 8: Mapeamento (task_type: mind_clone, threshold: 95)
  |   +-- OMEGA loop
  |   +-- Gate Gawande 8->9
  |   +-- Dual-gate met -> avanca
  |
  +-- FASE 9: Perfil (task_type: mind_clone, threshold: 95)
  |   +-- OMEGA loop
  |   +-- Gate Gawande 9->10 (inclui blind test + pre-mortem + FE vs F)
  |   +-- Dual-gate met -> avanca
  |
  +-- FASE 10: Recomendacao (task_type: mind_clone, threshold: 95)
  |   +-- OMEGA loop
  |   +-- Dual-gate met -> clone completo
  |
  +-- OMEGA finaliza: atualiza Synapse, registra em progress.log
```

### Gates Gawande no OMEGA

Os gates Gawande mapeiam diretamente para o dual-gate exit do OMEGA:

- **Kill items (critical: true):** Mapeados como backpressure gates. Se falham -> task `blocked`.
- **Warning items (critical: false):** Registrados no progress.log. Nao impedem avanco.
- **Todos kill items passam:** Mapeados como `completion_signals` + `exit_signal: true` -> dual-gate met.

### Circuit Breaker

O circuit breaker do OMEGA protege contra loops no pipeline:

- **CLOSED:** Operacao normal
- **HALF_OPEN:** 2 iteracoes sem progresso — ultima tentativa
- **OPEN:** 3 iteracoes sem progresso — fase congelada, clone marcado DRAFT, revisao humana

### Mind Update no OMEGA

```
/DUARTEOS:mmos:mind-update {nome}
  |
  +-- OMEGA inicializa pipeline de update
  |
  +-- BACKUP automatico
  |
  +-- DELTA ANALYSIS (classifica: NOVO / REFORCO / EVOLUCAO)
  |
  +-- MERGE ADITIVO (nunca remove)
  |
  +-- REGRESSION CHECK (testes anteriores passam?)
  |
  +-- FIDELITY CHECK (delta <= 5%? Se nao -> AUTO-ROLLBACK)
  |
  +-- OMEGA finaliza: score >= 95 para aprovacao
```

---

## 17. Integracao Synapse v3

O Synapse v3 e o motor de contexto que armazena e injeta dados dos mind clones. O contrato completo esta em `SYNAPSE.md` Secao 4.

### DNA Persiste em Synapse

- **Localizacao:** `.claude/synapse/minds/{slug}.yaml`
- **Template:** `.claude/synapse/mind-template.yaml`
- **Schema:** 6 camadas DNA + 4 subcamadas + identity + ingestion_log + stats

### As 6 Camadas + 4 Subcamadas do DNA

| Camada | O Que Captura | Pergunta-Chave |
|--------|-------------|----------------|
| 1. Filosofia | Crencas fundamentais, visao de mundo | "O que esta pessoa acredita ser verdade?" |
|    1a. Hierarquia de Valores | Ranking de valores com resolucao de conflitos | "Qual valor vence quando dois colidem?" |
|    1b. Motivacao Profunda | Impulsores e medos — motores de comportamento | "O que move e o que paralisa?" |
| 2. Frameworks | Modelos de pensamento estruturados | "Como organiza e estrutura problemas?" |
| 3. Heuristicas | Atalhos mentais, regras de bolso | "Que atalhos mentais usa para decidir?" |
|    3a. Modelo Social | Teoria da mente — como modela intencoes dos outros | "Como interpreta criticas, elogios, provocacoes?" |
| 4. Associacoes Conceituais | Pontes entre conceitos nao relacionados | "Quando fala de X, conecta com Y — por que?" |
| 5. Metodologias | Processos repetiveis, sistemas formais | "Que sistemas formais segue?" |
| 6. Dilemas | Trade-offs, tensoes, evolucao de posicoes | "Como lida com contradicoes?" |
| 7. Paradoxos Produtivos | Contradicoes internas que geram valor | "Que verdades contraditorias sustenta simultaneamente?" |
| 8. Comunicacao Avancada | Estrutura retorica + estilometria computacional | "Qual a formula argumentativa e assinatura estilistica?" |

**Camada 7 (Paradoxos) e a "camada ouro"** — 35% do score de fidelidade. Minimo 2 paradoxos por clone, cada um com >= 3 fontes independentes.
**Camada 8 (Comunicacao Avancada)** — estilometria computacional fornece baseline quantitativo para V (Voice).

### Indices Atualizados Automaticamente

- `minds/_index.yaml` — indice de todos os clones
- Atualizado apos cada mind-clone e mind-update
- Campos: slug, name, domain, clone_file, versao_dna, ultima_atualizacao

### Squad State

- Artefatos de mind clones em `DUARTEOS/squad/{categoria}/`
- Estado rastreado pelo Synapse via agent state tracking

### Ingestion Protocol

```
INGEST(source, mind_clone):
  1. Identificar mind clone alvo
  2. Ler DNA atual de minds/{slug}.yaml
  3. Processar conteudo -> extrair insights
  4. Para cada insight:
     a. Classificar em camada destino (1-6)
     b. Verificar duplicidade
     c. Adicionar incrementalmente (Edit, nunca Write)
     d. Registrar source_path
  5. Incrementar versao_dna
  6. Adicionar entrada no ingestion_log
  7. Registrar em .claude/synapse/ingestion/{YYYY-MM-DD}-{slug}.yaml
  8. Atualizar minds/_index.yaml
```

---

## 18. Formula de Fidelidade (Completa)

### Formula

```
F = (L x 0.20) + (B x 0.30) + (C x 0.15) + (K x 0.20) + (V x 0.15)
```

### Componentes

| Componente | Peso | Range | O Que Mede | Fontes de Medicao |
|-----------|------|-------|-----------|-------------------|
| **L** — Linguistic Accuracy | 20% | 0-100 | Precisao linguistica: MIUs linguisticos + voice | `artifacts/linguistic/` + `voice/` -> mius por semantic_type=linguistico |
| **B** — Behavioral Fidelity | **30%** | 0-100 | Fidelidade comportamental: drivers + scores (MAIOR PESO) | `artifacts/behavioral/` + `mind_drivers` -> `mind_component_scores` |
| **C** — Contradiction Handling | 15% | 0-100 | Paradoxos produtivos: contradicoes internas | Contradicoes mapeadas -> blind test com cenarios contraditorios |
| **K** — Knowledge/Framework Application | 20% | 0-100 | Profundidade de conhecimento: frameworks + tools | `frameworks/` + `mind_tools` -> teste de aplicacao em problema novo |
| **V** — Voice Authenticity | 15% | 0-100 | Autenticidade da voz narrativa | `voice/` + `phrases/` -> blind test texto clone vs texto real |

### Thresholds

| Threshold | Valor | Acao |
|-----------|-------|------|
| **Minimum per component** | 85 | Se qualquer componente < 85 -> retornar a fase responsavel |
| **Minimum composite** | 95 | Meta inegociavel para clone ativo |
| **Maximum component deviation** | 10 | Desvio maximo entre componentes |

### Regras de Fidelidade

1. **Se F >= 95 e todos componentes >= 85:** Clone ATIVO. Status = active.
2. **Se F >= 95 mas algum componente < 85:** Retornar a fase do componente fraco.
3. **Se F < 95:** Notificar usuario. Opcoes: aceitar como draft, fornecer mais fontes, revisar manualmente.
4. **Se F < 90:** Clone marcado DRAFT. Nao pode operar em producao.

---

## 19. Metricas Consolidadas

### Dashboard Completo

```yaml
metrics_dashboard:

  fase_1_pesquisa:
    zero_secondary_sources: "true"
    min_sources: ">= 3"
    material_preserved: "true"
    omega_task_type: "research"
    omega_threshold: 80

  fase_2_analise_rapida:
    mius_sample_count: "20-50 MIUs"
    coverage_mapped: "todas camadas verificadas"
    omega_task_type: "research"
    omega_threshold: 80

  fase_3_estimativa_pcfe:
    fe_calculated: "true"
    gaps_identified: "true"
    all_5_components: "VS, DS, CS, PS, QS calculados"
    omega_task_type: "planning"
    omega_threshold: 85

  fase_5_scaffold:
    dirs_created: ">= 21"
    config_yaml_valid: "true"
    dna_skeleton_created: "true"
    omega_task_type: "implementation"
    omega_threshold: 90

  fase_6_extracao:
    fragmentation_quality: ">= 95%"
    semantic_ratio: ">= 0.90"
    progressive_summarization: "layers 1-3 completas"
    rejection_rate: "documentada e justificada"
    omega_task_type: "research"
    omega_threshold: 80

  fase_7_inferencia:
    predictive_accuracy: ">= 90%"
    false_positive_rate: "< 5%"
    evidence_density: ">= 2.0 MIUs por driver"
    inter_agent_agreement: ">= 0.85"
    omega_task_type: "mind_clone"
    omega_threshold: 95

  fase_8_mapeamento:
    component_coverage: "100%"
    internal_consistency: ">= 95%"
    catalog_crossref: "completo"
    omega_task_type: "mind_clone"
    omega_threshold: 95

  fase_9_perfil:
    fidelity_score_composite: ">= 95%"
    no_component_below: "85%"
    blind_test: "passed"
    noise_audit_reproducibility: ">= 0.90"
    premortem: "executed and documented"
    fe_vs_f_compared: "true"
    omega_task_type: "mind_clone"
    omega_threshold: 95

  fase_10_recomendacao:
    recommendation_relevance: "validated"
    gap_accuracy: "confirmed via blind test"
    tool_sequencing: "prerequisites verified"
    omega_task_type: "mind_clone"
    omega_threshold: 95
```

### Tabela Resumo

| Fase | Metrica Principal | Threshold | Kill Item? |
|------|------------------|-----------|------------|
| 1 | Zero secondary sources | true | SIM |
| 1 | Min sources | >= 3 | NAO |
| 3 | FE calculated | true | SIM |
| 3 | All 5 components | true | SIM |
| 5 | Dirs created | >= 21 | SIM |
| 5 | Config YAML valid | true | SIM |
| 6 | Fragmentation quality | >= 95% | SIM |
| 6 | Progressive sum. | Layers 1-3 | SIM |
| 7 | Predictive accuracy | >= 90% | SIM |
| 7 | Evidence density | >= 2.0 | SIM |
| 7 | Inter-agent agreement | >= 0.85 | SIM |
| 8 | Component coverage | 100% | SIM |
| 8 | Internal consistency | >= 95% | SIM |
| 9 | Fidelity composite | >= 95% | SIM |
| 9 | Min component | >= 85% | SIM |
| 9 | Blind test | Passed | SIM |
| 9 | Pre-mortem | Documented | SIM |
| 9 | FE vs F compared | true | NAO |
| 10 | Recommendation relevance | Validated | NAO |

---

## 20. Checklist de Criacao de Agente

Os 8 passos para transformar uma mente clonada em agente operacional:

### Pre-condicoes

- Mente existe em DB `minds` com status = 'active'
- Fidelity score >= 95%
- mind_tools populado

### Passos

| # | Acao | Detalhes | Output |
|---|------|---------|--------|
| 1 | Gerar arquivo do agente | System prompt completo: CORBS, behavioral patterns, communication templates, voice signature, framework references, contradiction handling | `DUARTEOS/squad/{cat}/agents/{mind-name}.md` |
| 2 | Criar checklists especificos | Gates de qualidade para tecnicas/metodos da mente | `checklists/{mind-name}-checklist.md` |
| 3 | Popular frameworks | Todos os frameworks extraidos em YAML, um arquivo por framework | `frameworks/{mind-name}/{framework}.yaml` |
| 4 | Extrair frases-assinatura | Assinaturas linguisticas, padroes, expressoes recorrentes | `phrases/{mind-name}-phrases.yaml` |
| 5 | Definir voice | Tom de voz calibrado com exemplos | `voice/{mind-name}-voice.yaml` |
| 6 | Criar tasks especificas | Tarefas onde esta mente excela | `tasks/{acao}-{mind-name}.md` |
| 7 | Testar agente | Cenario conhecido (comparar), cenario novo (consistencia), debate com outro agente (fidelidade) | `tests/results/{mind-name}/` |
| 8 | Documentar DNA/extracoes | Qualquer DNA ou extracao especifica em `data/` | `data/{source}-{mind-name}-dna.yaml` |

### loader.md

O `lib/loader.md` define a ordem de carregamento do squad:

```yaml
load_order:
  1: "agents/{active-agents}.md"
  2: "data/{knowledge-bases}"
  3: "frameworks/{relevant}/"
  4: "checklists/{task-specific}.md"
  5: "tasks/{current-task}.md"
  6: "voice/{relevant}.yaml"
  7: "templates/{if-needed}"

context_management:
  max_tokens: "Gerenciar janela de 200k tokens"
  priority: "Agente > Task > Checklist > Framework > Data"
  lazy_loading: "Frameworks e data so carregam quando task exige"
```

---

## 21. Camadas de Profundidade Cognitiva — 6 Componentes v2.1

**Adicionado em:** v2.1.0
**Motivacao:** Gap analysis vs PRD de Clonagem Neural e Semantica v2.0 (Manus AI)
**Impacto estimado:** +6-12% de fidelidade composite (de ~89% para ~95%+)

### 21.1 Componentes Adicionados

| # | Componente | Camada DNA | Impacto F | Fase de Extracao |
|---|-----------|-----------|-----------|------------------|
| 1 | Estilometria Computacional | `comunicacao_avancada.estilometria` | L +3-5%, V +2-3% | Fase 6 (MIUs -> analise estatistica) |
| 2 | Associacoes Conceituais | `associacoes_conceituais` (nova) | B +3-5%, K +2-3% | Fase 7 (co-ocorrencia em MIUs) |
| 3 | Estrutura Retorica | `comunicacao_avancada.estrutura_retorica` | V +2-3%, B +1-2% | Fase 6 (MIUs narrativos) |
| 4 | Modelo de Recompensa e Medo | `filosofia.motivacao_profunda` | B +3-4% | Fase 7 (drivers positivos/negativos) |
| 5 | Hierarquia de Valores Rankeada | `filosofia.hierarquia_valores` | C +2-3%, B +1-2% | Fase 7 (analise de decisoes dificeis) |
| 6 | Teoria da Mente Simulada | `heuristicas.modelo_social` | B +3-5%, V +1-2% | Fase 6-7 (MIUs de interacao social) |

### 21.2 Integracao com Fases Existentes

**Fase 6 — Extracao (novos targets):**
- Ao extrair MIUs, classificar adicionalmente por: interacao_social (para modelo_social), argumentativo (para estrutura_retorica)
- Calcular metricas estilometricas sobre o corpus de MIUs linguisticos
- Identificar padroes de conexao conceitual recorrentes

**Fase 7 — Inferencia (novos targets):**
- Alem de drivers genericos, inferir: drivers motivacionais (impulsores vs medos), associacoes conceituais (pontes recorrentes), hierarquia de valores (baseada em decisoes relatadas)
- Separar drivers em positivos (impulsores) e negativos (medos/aversoes)
- Rankear valores fundamentais por evidencia de sacrificio

**Fase 9 — Perfil (validacao ampliada):**
- Blind test DEVE incluir cenarios de: provocacao (testa modelo_social), argumento complexo (testa estrutura_retorica), associacao inesperada (testa pontes conceituais)
- Estilometria usada como baseline quantitativa para validar V (Voice)

### 21.3 Impacto na Formula de Fidelidade

A formula F permanece: `F = (L*0.20) + (B*0.30) + (C*0.15) + (K*0.20) + (V*0.15)`

Os novos componentes enriquecem os INPUTS de cada dimensao:
- **L** recebe estilometria (metricas quantitativas complementam avaliacao qualitativa)
- **B** recebe modelo_social + motivacao_profunda + associacoes (comportamento mais profundo)
- **C** recebe hierarquia_valores (como resolve conflitos de principios)
- **K** recebe associacoes_conceituais (conexoes de conhecimento) + estrutura_retorica
- **V** recebe estilometria + estrutura_retorica (voz mais precisa)

### 21.4 Regras de Extracao

1. **Estilometria:** Extrair AUTOMATICAMENTE do corpus de MIUs. Nao depende de inferencia humana.
2. **Associacoes:** Minimo 3 pontes conceituais por clone. Se < 3: marcar como "material insuficiente".
3. **Estrutura Retorica:** Identificar pelo menos 1 formula argumentativa padrao por clone.
4. **Motivacao Profunda:** Minimo 1 impulsor + 1 medo. Se expert so mostra face positiva: documentar como "medo NAO identificado — necessita mais fontes".
5. **Hierarquia de Valores:** Rankear SOMENTE quando ha evidencia de escolha entre valores conflitantes. Se sem evidencia: manter como lista plana (compatibilidade com v2).
6. **Modelo Social:** Extrair de MIUs com tipo `interacao_social`. Se < 2 interacoes observadas: marcar campo como "dados insuficientes".

---

## Integracao Final: 5 Autoridades x 11 Fases x 15 Entidades

```
                  PESQUISA  ANALISE   PCFE      GATE      SCAFFOLD  EXTRACAO  INFERENCIA  MAPEAMENTO  PERFIL    RECOMENDACAO
                  Fase 1    Fase 2    Fase 3    Fase 4    Fase 5    Fase 6    Fase 7      Fase 8      Fase 9    Fase 10
                +---------+---------+---------+---------+---------+---------+-----------+-----------+---------+-------------+
ALLEN (GTD)     |Captura  |Sample   |   --    |   --    |Organize |Clarifica|Classifica |    --      |   --    |    --       |
Workflow        |exaustiva|represent|         |         |infraest |MIU<->tip|driver->con|            |         |             |
                |agnostica|         |         |         |         |sem filtr|/incubar   |            |         |             |
                +---------+---------+---------+---------+---------+---------+-----------+-----------+---------+-------------+
FORTE (CODE)    |Layer 1  |Layer1-2 |   --    |   --    |   --    |Layer 2-3|Layer 4    |Destilacao |EXPRESS  |   PARA      |
Memoria         |Capture  |Sample   |         |         |         |Organize |Distill    |Scores     |A mente  |   mapping   |
                |         |         |         |         |         |+Distill |Actionable |           |nasce    |             |
                +---------+---------+---------+---------+---------+---------+-----------+-----------+---------+-------------+
DEMING (PDSA)   |Catalogo |Cobertur |FE calc  |   --    |Schema   |Fragment |Predictive |Consistency|Fidelity |Relevance    |
Loops           |completo |por DNA  |5 comps  |         |valid    |quality  |accuracy   |>=95%      |score    |Match        |
                |         |         |         |         |         |>=95%    |>=90%      |           |>=95%    |accuracy     |
                +---------+---------+---------+---------+---------+---------+-----------+-----------+---------+-------------+
GAWANDE         |Gate 1->2|   --    |   --    |   --    |   --    |Gate 6->7|Gate 7->8  |Gate 8->9  |Gate9->10|Gate Final   |
Checklists      |DO-CONF  |         |         |         |         |DO-CONF  |DO-CONF    |DO-CONF    |DO-CONF  |DO-CONF      |
                |kill:1   |         |         |         |         |kill:1,2 |kill:1,2,4 |kill:1,2   |kill:1-3 |kill:1       |
                +---------+---------+---------+---------+---------+---------+-----------+-----------+---------+-------------+
KAHNEMAN        |Anti     |Repres.  |Overconf |   --    |   --    |Fragment.|Base rate  |Halo effect|Blind    |Gap          |
Anti-Vies       |confirm. |amostra  |ranges   |         |         |de julg. |Independent|Independ.  |test     |validation   |
                |Anti     |         |nao pts  |         |         |Salienci |Pre-mortem |           |Noise    |             |
                |anchor   |         |         |         |         |Independ.|           |           |audit    |             |
                +---------+---------+---------+---------+---------+---------+-----------+-----------+---------+-------------+

ENTIDADES DB:    catalogo  mius_     fe_report  decisao  infraest  contents  mind_driv   mapping_sys  minds     tools
                 fontes    sample                                  mius      miu_drv_ev  sys_compnts  mind_tool tool_drv_aff
                                                                   fragments drv_relat   comp_drv_map           tool_relat
                                                                             drivers     mind_comp_sc
                                                                                         mind_sys_map
```

---

*MMOS Engine v3.0.0 — Pipeline de Clonagem Mental de Alta Fidelidade*
*11 fases (0-10) x 15+ entidades DB x 5 autoridades x PCFE x Gate Humano x OMEGA v2 loop x Synapse v3 DNA*
*6 camadas + 4 subcamadas cognitivas + estilometria + associacoes + retorica + motivacao + hierarquia + modelo_social*
*Documento autocontido. Fonte de verdade: .claude/protocols/MMOS-PIPELINE.md*
