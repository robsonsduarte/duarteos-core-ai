# MMOS Mind Update — Atualizacao Incremental de Clone

Atualize um mind clone existente com novo material usando o pipeline MMOS v2 com merge incremental e rollback automatico.

**Modo:** Pipeline incremental — mesmo pipeline do mind-clone, ponto de entrada diferente
**Nivel:** Intermediario
**Prerequisito:** Clone deve existir (criado via /DUARTEOS:mmos:mind-clone)
**DNA:** 6 Camadas Cognitivas (merge aditivo, nunca destrutivo)
**Fidelidade-alvo:** >= 95% (formula: F = L*0.20 + B*0.30 + C*0.15 + K*0.20 + V*0.15)
**Autoridades:** Allen (GTD), Forte (CODE), Deming (PDSA), Kahneman (Anti-Vies), Gawande (Gates)
**OMEGA:** Cada step roda sob o protocolo OMEGA (ver `.claude/protocols/OMEGA.md` Secao 20.8)
**Protocolo:** `.claude/protocols/MMOS-PIPELINE.md` (Secao 10)

## Argumentos

$ARGUMENTS — nome do clone + fonte (obrigatorios)

Formato: `{nome} {fonte}`

- **fonte** pode ser: URL, caminho de arquivo local, ou texto entre aspas
- Se **sem fonte**: processa proximos pendentes do `inbox/{slug}/`

Se $ARGUMENTS estiver vazio ou incompleto, pergunte o que falta:
- Sem nome: "Qual mind clone voce quer atualizar? (nome completo)"
- Sem fonte: "Qual a fonte do novo material? (URL, caminho de arquivo, ou texto entre aspas). Deixe vazio para processar pendentes do inbox."

## Sintaxe

```
/DUARTEOS:mmos:mind-update {nome} {fonte}
```

Exemplos rapidos:
```
/DUARTEOS:mmos:mind-update "Naval Ravikant" https://youtube.com/watch?v=xxx
/DUARTEOS:mmos:mind-update "Naval Ravikant" /path/to/transcript.pdf
/DUARTEOS:mmos:mind-update "Naval Ravikant" "texto bruto aqui..."
/DUARTEOS:mmos:mind-update "Naval Ravikant"
```

## Diferenca: mind-update vs mind-clone

| Criterio | mind-clone | mind-update |
|----------|-----------|-------------|
| **Proposito** | Criar clone do ZERO | ENRIQUECER clone existente |
| **Pipeline** | 6 fases completas (Fase 0->6) | 5 steps parciais (Validacao, Delta, Merge, Clone Update, Regression) |
| **Fonte** | WebSearch + WebFetch (pesquisa automatica) | Material fornecido (URL, arquivo, texto, inbox) |
| **DNA** | Criado do zero | Merge incremental (adiciona, nunca remove) |
| **Agente .md** | Gerado do zero | Editado cirurgicamente (so secoes impactadas) |
| **Protecao** | Validacao final >= 95% | Rollback automatico se fidelidade cai > 5% |
| **Prerequisito** | Nenhum | Clone deve existir |
| **Autoridades** | 5 autoridades em cada fase | Allen (clarify delta), Forte (layers), Deming (regression), Kahneman (anti-vies), Gawande (backup gate) |
| **Entidades** | 15 entidades criadas | Delta -> merge nas entidades existentes |

**Regra de ouro:** Se o slug existe em `.claude/synapse/minds/`, use `mind-update`. Se nao, use `mind-clone`.

## Ponto de Entrada no Pipeline MMOS v2

O mind-update usa o MESMO pipeline do mind-clone mas entra na fase adequada ao novo material:

| Tipo de Novo Material | Fase de Entrada | Exemplo |
|----------------------|-----------------|---------|
| Novas fontes brutas | Fase 1 (Coleta) | Novo podcast, novo livro |
| Novas MIUs ja extraidas | Fase 2 (Extracao) | Fragmentos pre-processados |
| Novo driver identificado | Fase 3 (Inferencia) | Driver manual ou cross-reference |
| Recalibracao de perfil | Fase 5 (Perfil) | Nova validacao com dados existentes |

**Na pratica**, a maioria dos updates entra pela Fase 1 (novas fontes) e roda: Coleta -> Extracao -> Delta Analysis -> DNA Merge -> Regression.

## As 6 Camadas do DNA Mental

| Camada | O que captura | Pergunta-chave |
|--------|-------------|----------------|
| **Filosofia** | Crencas fundamentais, visao de mundo, principios inegociaveis | "O que esta pessoa acredita ser verdade?" |
| **Frameworks** | Passos-a-passo, modelos de pensamento estruturados | "Como esta pessoa organiza e estrutura problemas?" |
| **Heuristicas** | Atalhos mentais, regras de bolso, padroes de decisao rapida | "Que atalhos mentais usa para decidir rapido?" |
| **Metodologias** | Processos repetiveis, sistemas formais, ferramentas | "Que sistemas formais segue consistentemente?" |
| **Dilemas** | Trade-offs, tensoes reconhecidas, zonas cinza, evolucao de posicoes | "Como lida com contradicoes e decisoes impossiveis?" |
| **Paradoxos Produtivos** | Contradicoes que coexistem e geram valor (CAMADA OURO) | "Que verdades aparentemente contraditorias ela sustenta simultaneamente?" |

Campos extras que tambem podem receber updates:
- **Communication:** novas frases-assinatura, mudancas de tom, novos padroes
- **Expertise:** novos dominios, novas influencias, novos pontos cegos
- **Behavior:** novos padroes situacionais

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

---

## Pipeline: 5 Steps

---

### STEP 1: VALIDACAO E PREPARACAO

**Objetivo:** Confirmar que o clone existe, criar backup, e preparar o material novo.
**Artefato:** Backup em `data/minds/{slug}_backup_{timestamp}.yaml`
**OMEGA:** Validacao pre-pipeline (nao e task OMEGA formal)

#### Procedimento

1. **Canonicalizar nome -> slug**
   - Aplicar regras de canonicalizacao (lowercase, sem acentos, hifens)
   - Verificar aliases conhecidos
   - Se ambiguo: perguntar ao usuario

2. **Verificar existencia do clone**
   - Verificar se `.claude/synapse/minds/{slug}.yaml` existe
   - Se NAO existe: **ABORTAR** com mensagem:
     ```
     Clone "{nome}" nao encontrado em .claude/synapse/minds/{slug}.yaml.
     Use /DUARTEOS:mmos:mind-clone para criar do zero.
     ```
   - Se existe: continuar

3. **Ler DNA existente completo**
   - Usar Read tool para ler `.claude/synapse/minds/{slug}.yaml`
   - Registrar:
     - `versao_dna_antes` = valor de `stats.versao_dna`
     - `fidelidade_antes` = valor de `stats.fidelidade` (se disponivel, senao usar 75% baseline)
     - Numero de itens em cada camada (para comparacao posterior)

4. **Criar backup automatico**
   - Criar diretorio `data/minds/` se nao existir (`mkdir -p`)
   - Copiar o YAML atual para: `data/minds/{slug}_backup_{timestamp}.yaml`
   - Formato do timestamp: `YYYYMMDD-HHmmss` (ex: `20260303-143022`)
   - Confirmar que o backup foi salvo com sucesso

5. **Processar fonte de entrada**

   | Tipo de fonte | Como processar |
   |---------------|---------------|
   | **URL** (comeca com http/https) | Usar WebFetch para extrair conteudo textual |
   | **Arquivo local** (caminho no filesystem) | Usar Read tool para ler conteudo |
   | **Texto bruto** (entre aspas) | Usar diretamente como material |
   | **Sem fonte** (argumento vazio) | Verificar `inbox/{slug}/` por arquivos pendentes |

   Para o caso **sem fonte**:
   - Usar Glob para buscar em `inbox/{slug}/**/*.txt`
   - Excluir `inbox/processed/`
   - Se nenhum arquivo encontrado: avisar "Nenhum material pendente no inbox para {nome}. Forneca uma URL, arquivo ou texto."
   - Se encontrar: processar o mais antigo primeiro

6. **Validacao do Step 1**
   - Clone existe: SIM
   - Backup criado: SIM (confirmar path)
   - Material novo carregado: SIM (confirmar tipo e tamanho estimado)
   - Se qualquer validacao falhar: ABORTAR com mensagem descritiva

**NAO avance para Step 2 sem backup confirmado e material carregado.**

---

### STEP 2: DELTA ANALYSIS (Extracao de Novos Insights)

**Objetivo:** Analisar APENAS o novo material e extrair insights incrementais usando o motor MMOS v2.
**Artefato:** `data/minds/{slug}_delta_{timestamp}.md`
**Dependencia:** Step 1 concluido
**OMEGA:** task_type=research, threshold=80

#### Procedimento

1. **Analisar o material novo** e extrair insights APENAS do conteudo fornecido.
   NAO pesquisar na internet. NAO usar conhecimento previo sobre o expert.
   Extrair SOMENTE o que esta explicito no material.

2. **Aplicar Extracao MMOS (Fases 1-2 simplificadas):**
   - Extrair MIUs do novo material (Micro-Unidades Interpretativas Neurais)
   - Cada MIU = fragmento semantico minimo com significado autonomo
   - Classificar por tipo semantico: comportamental, linguistico, narrativo, decisorio, framework
   - **Allen:** Clarificacao — cada MIU tem significado autonomo?
   - **Forte:** Progressive Summarization layers 1-3 no novo material

3. **Inferir drivers/insights (Fase 3 simplificada):**

   Extrair insights nas 6 camadas + campos extras:

   **Camada 1 — Filosofia**
   - Novas crencas fundamentais nao presentes no DNA atual
   - Mudancas ou evolucao de visao de mundo
   - Novos principios inegociaveis
   - Reforco de crencas existentes (nova evidencia)

   **Camada 2 — Frameworks**
   - Novos frameworks ou modelos mentais
   - Evolucao de frameworks existentes (novos passos, refinamentos)
   - Novos contextos de uso para frameworks ja conhecidos

   **Camada 3 — Heuristicas**
   - Novas regras de bolso / atalhos mentais
   - Novos red flags identificados
   - Novos vieses reconhecidos pelo expert

   **Camada 4 — Metodologias**
   - Novos processos repetiveis
   - Novas ferramentas recomendadas
   - Refinamentos de metodologias existentes

   **Camada 5 — Dilemas**
   - Novos tradeoffs identificados
   - Evolucao de posicoes (mudanca de opiniao)
   - Novas zonas cinza reconhecidas

   **Camada 6 — Paradoxos Produtivos**
   - Novos paradoxos (verdades contraditorias que coexistem)
   - Reforco de paradoxos existentes (novos exemplos)
   - Resolucao de paradoxos anteriores (se o expert reconciliou a tensao)

   **Campos extras:**
   - Communication: novas frases-assinatura, mudancas de tom
   - Expertise: novos dominios mencionados, novas influencias citadas
   - Behavior: novos padroes situacionais observados

4. **Classificar cada insight (Delta Analysis):**

   ```yaml
   - camada: "{filosofia|frameworks|heuristicas|metodologias|dilemas|paradoxos|communication|expertise|behavior}"
     tipo: "{NOVO|REFORCO|EVOLUCAO}"
     conteudo: "{descricao do insight}"
     evidencia: "{citacao direta ou parafraseada do material}"
     source_path: "{URL ou caminho do arquivo fonte}"
   ```

   | Tipo | Significado | Acao no Merge |
   |------|-------------|---------------|
   | **NOVO** | Insight inexistente no DNA atual | Adicionar como nova entrada |
   | **REFORCO** | Confirma/fortalece algo existente | Incrementar peso/fonte |
   | **EVOLUCAO** | Mostra mudanca de posicao | Preservar ambas visoes com evidencia |

5. **Comparar com DNA existente:**
   - Para cada insight, verificar se ja existe algo similar no DNA atual
   - Se similar existe: marcar como REFORCO e referenciar o item existente
   - Se contradiz algo existente: marcar como EVOLUCAO e documentar a mudanca
   - Se genuinamente novo: marcar como NOVO

6. **Compilar artefato delta:**

   ```markdown
   # Delta Analysis: {Nome do Especialista}
   Data: {data}
   Fonte: {URL/caminho/descricao}
   Tipo da fonte: {url|arquivo|texto|inbox}
   DNA versao atual: {versao_dna_antes}

   ## Resumo
   Total de insights: {N}
   - Novos: {N}
   - Reforcos: {N}
   - Evolucoes: {N}

   ## MIUs Extraidas: {N}
   {Lista de MIUs com tipo semantico}

   ## Camadas Impactadas
   {Lista de camadas com insights extraidos}

   ## Insights Detalhados

   ### Filosofia ({N} insights)
   1. [{NOVO|REFORCO|EVOLUCAO}] {conteudo}
      Evidencia: "{citacao}"
      Source: {path}

   ### Frameworks ({N} insights)
   ...

   ### Paradoxos Produtivos ({N} insights)
   ...

   ## Conflitos com DNA Atual
   {Se algum insight contradiz o DNA existente, listar com detalhes}
   ```

7. **Salvar em** `data/minds/{slug}_delta_{timestamp}.md`

8. **Validacao do Step 2:**
   - Pelo menos 1 insight extraido (se zero: avisar "Material nao continha insights relevantes")
   - Cada insight tem source_path preenchido
   - Cada insight foi classificado (NOVO/REFORCO/EVOLUCAO)
   - **Kahneman:** Insights nao sao enviesados por conhecimento previo — somente material fornecido

**NAO avance para Step 3 sem o artefato delta salvo.**

---

### STEP 3: DNA MERGE (Incremental com Protecao)

**Objetivo:** Fazer merge do delta no DNA existente, de forma aditiva e nunca destrutiva.
**Artefato:** `.claude/synapse/minds/{slug}.yaml` atualizado
**Dependencia:** Step 2 concluido
**OMEGA:** task_type=mind_clone, threshold=95

#### Regras de Merge (CRITICAS — 5 Autoridades Integradas)

| Operacao | Regra | Autoridade | Exemplo |
|----------|-------|------------|---------|
| **ADICIONAR** | Novos itens ao final de cada lista | Allen (capture) | Nova crenca -> append |
| **NUNCA REMOVER** | Itens existentes NUNCA removidos | Forte (preserve) | Crenca antiga permanece |
| **REFORCAR** | Novo source_path como evidencia | Forte (organize) | Evidencia atualizada |
| **PARADOXOS** | Cresce monotonicamente | Deming (acumulativo) | Novo exemplo adicionado |
| **EVOLUCAO** | Registrar em dilemas.evolucao | Kahneman (ambos lados) | de/para/quando/motivo |
| **DEDUP** | NAO duplicar identico | Allen (clarify) | Verificar antes de add |

#### Procedimento

1. **Ler DNA existente** de `.claude/synapse/minds/{slug}.yaml`

2. **Para cada insight NOVO do delta:**
   - Identificar a camada destino
   - Verificar que nao e duplicata de item existente
   - Adicionar ao final da lista correspondente
   - Incluir `source_path` apontando para a fonte
   - Formato consistente com itens existentes na camada

3. **Para cada insight REFORCO do delta:**
   - Localizar o item existente na camada
   - Se o item tem campo `evidencia`: adicionar nova fonte como evidencia complementar
   - Se o item nao tem campo de fonte: adicionar `source_path` como referencia

4. **Para cada insight EVOLUCAO do delta:**
   - Manter o item original intacto (NUNCA remover)
   - Adicionar nova entrada em `dilemas.evolucao`:
     ```yaml
     - de: "{posicao anterior}"
       para: "{nova posicao}"
       quando: "{data da fonte}"
       motivo: "{evidencia da mudanca}"
       source_path: "{caminho da fonte}"
     ```

5. **Atualizar campos extras (se aplicavel):**
   - `communication.vocabulary.signature_phrases`: append novas frases
   - `expertise.deep` / `expertise.broad`: append novos dominios
   - `expertise.influences`: append novas influencias
   - `behavior.*`: atualizar se nova evidencia for mais precisa

6. **Atualizar metadata:**
   - Incrementar `stats.versao_dna` em +1
   - Atualizar `stats.ultima_atualizacao` com data atual
   - Incrementar `stats.total_fontes` em +1
   - Adicionar entrada no `ingestion_log`:
     ```yaml
     - date: "{YYYY-MM-DD}"
       source_type: "{url|arquivo|texto|inbox}"
       title: "{titulo descritivo da fonte}"
       source_path: "{URL ou caminho do arquivo}"
       insights_extraidos: {N}
       camadas_atualizadas:
         - {camada1}
         - {camada2}
     ```

7. **Aplicar mudancas usando Edit tool**
   - OBRIGATORIO usar Edit tool (NAO Write) para modificar o YAML existente
   - Fazer edits cirurgicos — so as secoes que recebem novos dados
   - Preservar formatacao e comentarios existentes
   - Validar que o YAML resultante e parseable

8. **Atualizar indice** `.claude/synapse/minds/_index.yaml`:
   - Atualizar `versao_dna` e `ultima_atualizacao` para o clone

9. **Registrar ingestao** em `.claude/synapse/ingestion/{YYYY-MM-DD}-{slug}.yaml`:
   ```yaml
   date: "{YYYY-MM-DD}"
   source_type: "{tipo}"
   source_url: "{URL ou caminho}"
   title: "{titulo}"
   mind_clone: "{slug}"
   camadas_impactadas:
     - {camada1}
     - {camada2}
   insights:
     - camada: "{camada}"
       tipo: "{NOVO|REFORCO|EVOLUCAO}"
       conteudo: "{resumo}"
   versao_dna_antes: {N}
   versao_dna_depois: {N+1}
   ```

10. **Validacao do Step 3:**
    - YAML e parseable (sem erros de sintaxe)
    - `versao_dna` incrementou
    - `ingestion_log` tem nova entrada
    - Nenhum item existente foi removido
    - `_index.yaml` atualizado
    - Registro em `ingestion/` criado

**NAO avance para Step 4 sem o DNA merged e validado.**

---

### STEP 4: CLONE UPDATE (Regenerar Agente)

**Objetivo:** Atualizar o arquivo `.md` do agente com os novos insights, de forma cirurgica.
**Artefato:** Arquivo `.md` do agente atualizado
**Dependencia:** Step 3 concluido
**OMEGA:** task_type=implementation, threshold=90

#### Regras de Edicao

- **NAO reescrever o agente inteiro** — apenas editar as secoes impactadas
- **Usar Edit tool** para modificacoes cirurgicas
- **Write tool** SOMENTE se uma secao inteiramente nova precisa ser criada
- **Preservar** todo conteudo nao impactado intacto

#### Procedimento

1. **Ler DNA atualizado** de `.claude/synapse/minds/{slug}.yaml`

2. **Ler agente existente** de `DUARTEOS/squad/{categoria}/agents/{slug}.md`
   - Se o agente `.md` nao existir: avisar que precisa ser criado via `mind-clone` primeiro
   - Identificar o caminho correto via `identity.clone_file` no DNA YAML

3. **Mapear impacto** — para cada camada que recebeu novos insights:

   | Camada DNA | Secao do Agente .md |
   |------------|-------------------|
   | Filosofia | "Quem Voce E", "O Que Voce Valoriza" |
   | Frameworks | "Como Voce Pensa", "Modelos Mentais" |
   | Heuristicas | "Processo Decisorio", regras especificas |
   | Metodologias | Secoes de processo, ferramentas |
   | Dilemas | "Contradicoes e Evolucao", trade-offs |
   | Paradoxos Produtivos | "Paradoxos Produtivos" (criar se nao existir) |
   | Communication | "Como Voce Comunica", "Vocabulario Obrigatorio" |
   | Expertise | "Sua Expertise", "Dominio Profundo" |
   | Behavior | "Comportamento Situacional" |

4. **Aplicar edits cirurgicos:**
   - Para cada secao impactada, usar Edit tool
   - Novos frameworks: adicionar na lista existente de "Modelos Mentais"
   - Novas frases-assinatura: adicionar em "Vocabulario Obrigatorio"
   - Novos paradoxos: adicionar (ou criar) secao "Paradoxos Produtivos"
   - Evolucoes: atualizar secao correspondente E manter referencia a posicao anterior

5. **Atualizar squad artifacts (se impactados):**
   - `frameworks/{slug}/` — novos YAMLs por framework descoberto
   - `phrases/{slug}-phrases.yaml` — novas frases-assinatura
   - `voice/{slug}-voice.yaml` — refinamentos de tom
   - `checklists/` — novos gates se necessario

6. **Validacao do Step 4:**
   - Agente `.md` editado com sucesso (nao corrompido)
   - Secoes nao impactadas permanecem identicas
   - Novos conteudos consistentes com DNA atualizado
   - Formatacao markdown preservada

**NAO avance para Step 5 sem o agente atualizado e validado.**

---

### STEP 5: REGRESSION VALIDATION (Fidelidade Comparativa)

**Objetivo:** Validar que o update nao degradou a qualidade do clone. Rollback automatico se necessario.
**Artefato:** `data/minds/{slug}_regression_{timestamp}.md`
**Dependencia:** Step 4 concluido
**OMEGA:** task_type=mind_clone, threshold=95

#### Procedimento

1. **Gerar 5 perguntas-teste** (subset rapido da validacao completa):

   | # | Tipo | Proposito | Peso |
   |---|------|-----------|------|
   | 1 | Superficie | Pergunta simples sobre area de expertise | 15% |
   | 2 | Profundidade media | Pergunta que exige uso de framework especifico | 20% |
   | 3 | Profunda | Pergunta que exige integracao de multiplas camadas DNA | 30% |
   | 4 | Paradoxo 1 | Pergunta que testa tensao/contradicao | 17.5% |
   | 5 | Paradoxo 2 | Pergunta que testa resolucao de dilema | 17.5% |

   As perguntas devem ser RELEVANTES ao novo material ingerido.

2. **Para cada pergunta, avaliar em 4 dimensoes (0-100):**

   | Dimensao | O que avalia |
   |----------|-------------|
   | Precisao | Resposta factualmente correta e consistente com o DNA |
   | Estilo | Tom, vocabulario e padroes comunicativos do expert |
   | Profundidade | Uso de frameworks, heuristicas e metodologias do DNA |
   | Autenticidade | "Soa como a pessoa real responderia?" |

3. **Calcular score por pergunta:**
   ```
   score_pergunta = (precisao * 0.30) + (estilo * 0.20) + (profundidade * 0.25) + (autenticidade * 0.25)
   ```

4. **Calcular fidelidade_depois (score ponderado global):**
   ```
   fidelidade = (superficie * 0.15) + (media * 0.20) + (profunda * 0.30) + (paradoxo1 * 0.175) + (paradoxo2 * 0.175)
   ```

5. **Aplicar Formula de Fidelidade MMOS v2:**
   ```
   F = (L x 0.20) + (B x 0.30) + (C x 0.15) + (K x 0.20) + (V x 0.15)

   L = Linguistic Accuracy   — precisao linguistica
   B = Behavioral Fidelity   — fidelidade comportamental (MAIOR PESO)
   C = Contradiction Handling — paradoxos produtivos
   K = Knowledge/Framework    — profundidade de conhecimento
   V = Voice Authenticity     — autenticidade da voz
   ```

6. **Decisao de rollback:**

   | Condicao | Acao | Mensagem |
   |----------|------|----------|
   | `fidelidade_depois >= fidelidade_antes` | SUCESSO | "Update aplicado. Fidelidade: {antes}% -> {depois}%." |
   | `fidelidade_depois >= fidelidade_antes - 5` | WARNING | "Update com leve queda: {antes}% -> {depois}%." |
   | `fidelidade_depois < fidelidade_antes - 5` | ROLLBACK AUTOMATICO | "Queda de fidelidade > 5%. Rollback executado." |

   **Nota:** Se `fidelidade_antes` nao disponivel (primeiro update), usar 75% baseline.

7. **Notificacao quando fidelidade abaixo de 95%:**

   Se `fidelidade_depois < 95`, DEVE notificar:

   ```
   FIDELIDADE ABAIXO DO THRESHOLD

   Clone: {Nome do Especialista}
   Fidelidade antes: {fidelidade_antes}%
   Fidelidade depois: {fidelidade_depois}%
   Componentes: L={L}% B={B}% C={C}% K={K}% V={V}%
   Threshold minimo: 95%

   Opcoes:
   1. Aceitar update (fidelidade abaixo do threshold)
   2. Rollback (reverter ao estado anterior)
   3. Fornecer mais fontes para enriquecer

   Qual opcao voce prefere? (1/2/3)
   ```

8. **Em caso de ROLLBACK:**
   - Restaurar backup: copiar `data/minds/{slug}_backup_{timestamp}.yaml` de volta para `.claude/synapse/minds/{slug}.yaml`
   - Reverter o agente `.md`: usar `git checkout` para restaurar versao anterior
   - Registrar no `ingestion_log`:
     ```yaml
     - date: "{YYYY-MM-DD}"
       source: "mind-update-rollback"
       title: "ROLLBACK: {titulo da fonte}"
       motivo: "Queda de fidelidade de {antes}% para {depois}%"
       source_path: "{fonte original}"
     ```
   - Avisar usuario com diagnostico completo

9. **Atualizar stats.fidelidade no DNA:**
   - Se update bem-sucedido: `stats.fidelidade = fidelidade_depois`

10. **Compilar artefato de regressao:**

    ```markdown
    # Regression Validation: {Nome do Especialista}
    Data: {data}
    Fonte testada: {URL/caminho}
    DNA versao: {antes} -> {depois}
    Resultado: {SUCESSO|WARNING|ROLLBACK}

    ## Fidelidade MMOS v2
    Formula: F = (L*0.20) + (B*0.30) + (C*0.15) + (K*0.20) + (V*0.15)
    - L (Linguistic): {L}%
    - B (Behavioral): {B}%
    - C (Contradiction): {C}%
    - K (Knowledge): {K}%
    - V (Voice): {V}%
    - **Composite: {F}%**

    ## Scores por Pergunta

    | Pergunta | Tipo | Precisao | Estilo | Profundidade | Autenticidade | Score | Peso |
    |----------|------|----------|--------|-------------|--------------|-------|------|
    | 1 | Superficie | {X} | {X} | {X} | {X} | {X} | 15% |
    | 2 | Media | {X} | {X} | {X} | {X} | {X} | 20% |
    | 3 | Profunda | {X} | {X} | {X} | {X} | {X} | 30% |
    | 4 | Paradoxo 1 | {X} | {X} | {X} | {X} | {X} | 17.5% |
    | 5 | Paradoxo 2 | {X} | {X} | {X} | {X} | {X} | 17.5% |

    ## Fidelidade Comparativa
    - Antes: {fidelidade_antes}%
    - Depois: {fidelidade_depois}%
    - Delta: {+/-X}%
    - Decisao: {SUCESSO|WARNING|ROLLBACK}

    ## Conclusao
    {Resumo da decisao e proximos passos}
    ```

11. **Salvar em** `data/minds/{slug}_regression_{timestamp}.md`

12. **Se processou material do inbox:**
    - Mover arquivo processado para `inbox/processed/{slug}/`

---

## Resumo dos Artefatos

| Step | Artefato | Caminho |
|------|----------|---------|
| 1 - Validacao | Backup do DNA | `data/minds/{slug}_backup_{timestamp}.yaml` |
| 2 - Delta Analysis | Insights extraidos | `data/minds/{slug}_delta_{timestamp}.md` |
| 3 - DNA Merge | DNA atualizado | `.claude/synapse/minds/{slug}.yaml` |
| 3 - DNA Merge | Log de ingestao | `.claude/synapse/ingestion/{YYYY-MM-DD}-{slug}.yaml` |
| 4 - Clone Update | Agente atualizado | `DUARTEOS/squad/{cat}/agents/{slug}.md` |
| 5 - Regression | Relatorio de fidelidade | `data/minds/{slug}_regression_{timestamp}.md` |

## Regras Criticas

1. **MERGE ADITIVO** — NUNCA remover itens existentes do DNA. So adiciona ou reforca.
2. **ROLLBACK AUTOMATICO** — se fidelidade cair > 5%, revertido automaticamente.
3. **BACKUP OBRIGATORIO** — antes de qualquer merge, backup completo criado.
4. **EDIT > WRITE** — SEMPRE usar Edit tool para arquivos existentes.
5. **SOURCE_PATH** — todo insight DEVE ter rastreabilidade ate a fonte.
6. **DEDUP** — verificar similaridade antes de adicionar. NAO duplicar.
7. **VERSIONAMENTO** — `versao_dna` incrementa a cada update bem-sucedido.
8. **SO CONTEUDO FORNECIDO** — durante Delta Analysis, APENAS material fornecido.
9. **PRESERVAR CONTRADICOES** — registrar como evolucao, NAO "resolver".
10. **IDEMPOTENCIA** — processar o mesmo material 2x nao duplica insights.
11. **FORMULA v2** — usar F = L*0.20 + B*0.30 + C*0.15 + K*0.20 + V*0.15.
12. **5 AUTORIDADES** — Allen, Forte, Deming, Kahneman, Gawande integradas.

## Exemplos de Uso

### Exemplo 1: Update com URL de video
```
/DUARTEOS:mmos:mind-update "Andrew Ng" https://youtube.com/watch?v=xxx

Step 1: Validando... andrew-ng.yaml existe (v1). Backup criado.
Step 2: WebFetch extraindo... 5 MIUs, 3 novos insights.
Step 3: Merge incremental... DNA atualizado para v2.
Step 4: Agente AI/andrew-ng.md editado (secao Frameworks atualizada).
Step 5: Fidelidade 82% -> 85%. F = L:83 B:87 C:80 K:86 V:84. SUCESSO.
```

### Exemplo 2: Update com rollback
```
/DUARTEOS:mmos:mind-update "Bill Gates" https://example.com/low-quality-article

Step 1: Validando... bill-gates.yaml existe (v2). Backup criado.
Step 2: WebFetch extraindo... 2 MIUs, 4 insights (qualidade questionavel).
Step 3: Merge incremental... DNA atualizado para v3.
Step 4: Agente Business/bill-gates.md editado.
Step 5: Fidelidade 86% -> 72%. F = L:70 B:68 C:75 K:73 V:74. ROLLBACK AUTOMATICO.
        DNA restaurado para v2. Agente revertido.
```
