# MMOS Mind Update — Atualizacao Incremental de Clone

Atualize um mind clone existente com novo material usando merge incremental e rollback automatico.

**Modo:** Pipeline incremental — 5 steps com protecao anti-regressao
**Nivel:** Intermediario
**Prerequisito:** Clone deve existir (criado via /DUARTEOS:mmos:mind-clone)
**DNA:** 6 Camadas Cognitivas (merge aditivo, nunca destrutivo)

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
| **Pipeline** | 5 fases completas (Research, Analysis, Synthesis, Synapse Sync, Implementation, Validation) | 5 steps parciais (Validacao, Delta Analysis, DNA Merge, Clone Update, Regression Validation) |
| **Fonte** | WebSearch + WebFetch (pesquisa automatica) | Material fornecido (URL, arquivo, texto, inbox) |
| **DNA** | Criado do zero | Merge incremental (adiciona, nunca remove) |
| **Agente .md** | Gerado do zero | Editado cirurgicamente (so secoes impactadas) |
| **Protecao** | Validacao de fidelidade (score >= 90%) | Rollback automatico se fidelidade cair > 5% |
| **Prerequisito** | Nenhum | Clone deve existir |
| **Quando usar** | Expert novo, sem clone no sistema | Novo podcast, artigo, livro, entrevista do expert |

**Regra de ouro:** Se o slug existe em `.claude/synapse/minds/`, use `mind-update`. Se nao existe, use `mind-clone`.

## As 6 Camadas do DNA Mental

| Camada | O que captura | Pergunta-chave |
|--------|-------------|----------------|
| **Filosofia** | Crencas fundamentais, visao de mundo, principios inegociaveis | "O que esta pessoa acredita ser verdade?" |
| **Frameworks** | Passos-a-passo, modelos de pensamento estruturados | "Como esta pessoa organiza e estrutura problemas?" |
| **Heuristicas** | Atalhos mentais, regras de bolso, padroes de decisao rapida | "Que atalhos mentais usa para decidir rapido?" |
| **Metodologias** | Processos repetiveis, sistemas formais, ferramentas | "Que sistemas formais segue consistentemente?" |
| **Dilemas** | Trade-offs, tensoes reconhecidas, zonas cinza, evolucao de posicoes | "Como lida com contradicoes e decisoes impossiveis?" |
| **Paradoxos Produtivos** | Contradicoes que coexistem e geram valor | "Que verdades aparentemente contraditorias ela sustenta simultaneamente?" |

Campos extras que tambem podem receber updates:
- **Communication:** novas frases-assinatura, mudancas de tom, novos padroes
- **Expertise:** novos dominios, novas influencias, novos pontos cegos
- **Behavior:** novos padroes situacionais

## Canonicalizacao de Entidades

Mesmas regras do DuarteOS (referencia completa em `/DUARTEOS:squad:clone-mind`):

1. **Normalizar nome:** remover acentos, lowercase, hifens entre palavras
   - "Alex Hormozi" -> `alex-hormozi`
   - "Naval Ravikant" -> `naval-ravikant`
2. **Resolver variacoes:** diferentes formas do mesmo nome resolvem para o mesmo slug
   - "Hormozi", "Alex Hormozi", "Alex H." -> `alex-hormozi`
3. **Deteccao por contexto:** se nome nao e reconhecido, verificar `synapse/minds/*.yaml`
4. **Aliases conhecidos:** "MrBeast" = "Jimmy Donaldson" -> `mrbeast`
5. **Nome canonico = slug do arquivo:** `.claude/synapse/minds/{slug}.yaml`
6. **Se ambiguo:** perguntar ao usuario

---

## Pipeline: 5 Steps

---

### STEP 1: VALIDACAO E PREPARACAO

**Objetivo:** Confirmar que o clone existe, criar backup, e preparar o material novo.
**Artefato:** Backup em `data/minds/{slug}_backup_{timestamp}.yaml`

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
     - `fidelidade_antes` = valor de `stats.confianca_geral` (se disponivel)
     - Numero de itens em cada camada (para comparacao posterior)

4. **Criar backup automatico**
   - Criar diretorio `data/minds/` se nao existir (`mkdir -p`)
   - Copiar o YAML atual para: `data/minds/{slug}_backup_{timestamp}.yaml`
   - Formato do timestamp: `YYYYMMDD-HHmmss` (ex: `20260302-143022`)
   - Confirmar que o backup foi salvo com sucesso

5. **Processar fonte de entrada**

   | Tipo de fonte | Como processar |
   |---------------|---------------|
   | **URL** (comeca com http/https) | Usar WebFetch para extrair conteudo textual |
   | **Arquivo local** (caminho no filesystem) | Usar Read tool para ler conteudo |
   | **Texto bruto** (entre aspas) | Usar diretamente como material |
   | **Sem fonte** (argumento vazio) | Verificar `inbox/{slug}/` por arquivos pendentes (nao processados) |

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

**Objetivo:** Analisar APENAS o novo material e extrair insights incrementais.
**Artefato:** `data/minds/{slug}_delta_{timestamp}.md`
**Dependencia:** Step 1 concluido

#### Procedimento

1. **Analisar o material novo** e extrair insights APENAS do conteudo fornecido.
   NAO pesquisar na internet. NAO usar conhecimento previo sobre o expert.
   Extrair SOMENTE o que esta explicito no material.

2. **Extrair insights nas 6 camadas:**

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
   - Novos paradoxos (verdades aparentemente contraditorias que coexistem)
   - Reforco de paradoxos existentes (novos exemplos, nova evidencia)
   - Resolucao de paradoxos anteriores (se o expert reconciliou a tensao)

   **Campos extras:**
   - Communication: novas frases-assinatura, mudancas de tom, novos padroes
   - Expertise: novos dominios mencionados, novas influencias citadas
   - Behavior: novos padroes situacionais observados

3. **Para cada insight extraido, registrar:**

   ```yaml
   - camada: "{filosofia|frameworks|heuristicas|metodologias|dilemas|paradoxos|communication|expertise|behavior}"
     tipo: "{NOVO|REFORCO|EVOLUCAO}"
     conteudo: "{descricao do insight}"
     evidencia: "{citacao direta ou parafraseada do material}"
     source_path: "{URL ou caminho do arquivo fonte}"
   ```

   Classificacao de tipo:
   - **NOVO**: insight que nao existe no DNA atual
   - **REFORCO**: insight que confirma/fortalece algo ja existente
   - **EVOLUCAO**: insight que mostra mudanca de posicao em relacao ao DNA atual

4. **Comparar com DNA existente:**
   - Para cada insight, verificar se ja existe algo similar no DNA atual
   - Se similar existe: marcar como REFORCO e referenciar o item existente
   - Se contradiz algo existente: marcar como EVOLUCAO e documentar a mudanca
   - Se genuinamente novo: marcar como NOVO

5. **Compilar artefato delta:**

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

   ## Camadas Impactadas
   {Lista de camadas com insights extraidos}

   ## Insights Detalhados

   ### Filosofia ({N} insights)
   1. [{NOVO|REFORCO|EVOLUCAO}] {conteudo}
      Evidencia: "{citacao}"
      Source: {path}

   ### Frameworks ({N} insights)
   ...

   ### Heuristicas ({N} insights)
   ...

   ### Metodologias ({N} insights)
   ...

   ### Dilemas ({N} insights)
   ...

   ### Paradoxos Produtivos ({N} insights)
   ...

   ### Communication ({N} insights)
   ...

   ### Expertise ({N} insights)
   ...

   ### Behavior ({N} insights)
   ...

   ## Conflitos com DNA Atual
   {Se algum insight contradiz o DNA existente, listar aqui com detalhes}
   ```

6. **Salvar em** `data/minds/{slug}_delta_{timestamp}.md`

7. **Validacao do Step 2:**
   - Pelo menos 1 insight extraido (se zero: avisar "Material nao continha insights relevantes para o DNA de {nome}")
   - Cada insight tem source_path preenchido
   - Cada insight foi classificado (NOVO/REFORCO/EVOLUCAO)

**NAO avance para Step 3 sem o artefato delta salvo.**

---

### STEP 3: DNA MERGE (Incremental com Protecao)

**Objetivo:** Fazer merge do delta no DNA existente, de forma aditiva e nunca destrutiva.
**Artefato:** `.claude/synapse/minds/{slug}.yaml` atualizado
**Dependencia:** Step 2 concluido

#### Regras de Merge (CRITICAS)

| Operacao | Regra | Exemplo |
|----------|-------|---------|
| **ADICIONAR** | Novos itens sao adicionados ao final de cada lista | Nova crenca -> append em `filosofia.crencas_core` |
| **NUNCA REMOVER** | Itens existentes NUNCA sao removidos, mesmo que contraditados | Crenca antiga permanece, nova e adicionada ao lado |
| **REFORCAR** | Itens existentes recebem novo `source_path` como evidencia adicional | `evidencia` atualizada com nova referencia |
| **PARADOXOS** | Novo paradoxo -> adicionar. Existente confirmado -> adicionar exemplo | Secao `paradoxos_produtivos` cresce monotonicamente |
| **EVOLUCAO** | Posicao mudou -> registrar em `dilemas.evolucao` com data e motivo | `de:` / `para:` / `quando:` / `motivo:` |
| **DEDUP** | NAO duplicar insight identico (mesmo conteudo, mesma camada) | Verificar similaridade antes de adicionar |

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
   - Manter o item original intacto
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
   - `communication.patterns`: editar padroes se nova evidencia for mais precisa
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

#### Regras de Edicao

- **NAO reescrever o agente inteiro** — apenas editar as secoes impactadas
- **Usar Edit tool** para modificacoes cirurgicas
- **Write tool** SOMENTE se uma secao inteiramente nova precisa ser criada (ex: secao "Paradoxos Produtivos" nao existia)
- **Preservar** todo conteudo nao impactado intacto

#### Procedimento

1. **Ler DNA atualizado** de `.claude/synapse/minds/{slug}.yaml`

2. **Ler agente existente** de `.claude/commands/DUARTEOS/{Categoria}/{slug}.md`
   - Se o agente `.md` nao existir: avisar que precisa ser criado via `mind-clone` primeiro
   - Identificar o caminho correto via `identity.clone_file` no DNA YAML

3. **Mapear impacto** — para cada camada que recebeu novos insights, identificar a secao correspondente no agente `.md`:

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
   - Para cada secao impactada, usar Edit tool para adicionar ou atualizar conteudo
   - Novos frameworks: adicionar na lista existente de "Modelos Mentais"
   - Novas frases-assinatura: adicionar em "Vocabulario Obrigatorio"
   - Novos paradoxos: adicionar (ou criar) secao "Paradoxos Produtivos"
   - Novas heuristicas: adicionar na secao relevante
   - Evolucoes: atualizar a secao correspondente E manter referencia a posicao anterior

5. **Atualizar frontmatter:**
   - Incrementar versao (se tiver campo de versao)
   - Atualizar `created_at` ou `updated_at` com data atual
   - Adicionar fonte ao campo `sources` (se existir)

6. **Validacao do Step 4:**
   - Agente `.md` editado com sucesso (nao corrompido)
   - Secoes nao impactadas permanecem identicas
   - Novos conteudos sao consistentes com o DNA atualizado
   - Formatacao markdown preservada

**NAO avance para Step 5 sem o agente atualizado e validado.**

---

### STEP 5: REGRESSION VALIDATION (Fidelidade Comparativa)

**Objetivo:** Validar que o update nao degradou a qualidade do clone. Rollback automatico se necessario.
**Artefato:** `data/minds/{slug}_regression_{timestamp}.md`
**Dependencia:** Step 4 concluido

#### Procedimento

1. **Gerar 5 perguntas-teste** (subset rapido da validacao completa):

   | # | Tipo | Proposito | Peso |
   |---|------|-----------|------|
   | 1 | Superficie | Pergunta simples sobre area de expertise | 15% |
   | 2 | Profundidade media | Pergunta que exige uso de framework especifico | 20% |
   | 3 | Profunda | Pergunta que exige integracao de multiplas camadas DNA | 30% |
   | 4 | Paradoxo 1 | Pergunta que testa tensao/contradicao | 17.5% |
   | 5 | Paradoxo 2 | Pergunta que testa resolucao de dilema | 17.5% |

   As perguntas devem ser RELEVANTES ao novo material ingerido, testando se os novos insights foram integrados sem degradar os existentes.

2. **Para cada pergunta, avaliar a resposta em 4 dimensoes (0-100):**

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

5. **Decisao de rollback:**

   | Condicao | Acao | Mensagem |
   |----------|------|----------|
   | `fidelidade_depois >= fidelidade_antes` | SUCESSO | "Update aplicado com sucesso. Fidelidade: {antes}% -> {depois}%." |
   | `fidelidade_depois >= fidelidade_antes - 5` | WARNING | "Update aplicado com leve queda de fidelidade: {antes}% -> {depois}%. Recomendado revisar os novos insights." |
   | `fidelidade_depois < fidelidade_antes - 5` | ROLLBACK AUTOMATICO | "Update causou queda de fidelidade de {antes}% para {depois}%. Rollback automatico executado." |

   **Nota:** Se `fidelidade_antes` nao estiver disponivel (primeiro update), considerar como 75% baseline.

6. **Em caso de ROLLBACK:**
   - Restaurar backup: copiar `data/minds/{slug}_backup_{timestamp}.yaml` de volta para `.claude/synapse/minds/{slug}.yaml`
   - Reverter o agente `.md`: usar `git checkout` para restaurar versao anterior, ou re-ler backup se disponivel
   - Registrar no `ingestion_log` que rollback ocorreu:
     ```yaml
     - date: "{YYYY-MM-DD}"
       source: "mind-update-rollback"
       title: "ROLLBACK: {titulo da fonte}"
       motivo: "Queda de fidelidade de {antes}% para {depois}%"
       source_path: "{fonte original}"
     ```
   - Avisar usuario:
     ```
     ROLLBACK EXECUTADO

     O update com a fonte "{titulo}" causou queda de fidelidade:
     - Antes: {fidelidade_antes}%
     - Depois: {fidelidade_depois}%
     - Queda: {diferenca}%

     Possíveis causas:
     1. Material de baixa qualidade ou irrelevante
     2. Conteudo inconsistente com o DNA existente do expert
     3. Fonte contem informacoes incorretas sobre o expert

     O DNA e o agente foram restaurados ao estado anterior.
     Backup utilizado: data/minds/{slug}_backup_{timestamp}.yaml
     ```

7. **Compilar artefato de regressao:**

   ```markdown
   # Regression Validation: {Nome do Especialista}
   Data: {data}
   Fonte testada: {URL/caminho}
   DNA versao: {antes} -> {depois}
   Resultado: {SUCESSO|WARNING|ROLLBACK}

   ## Scores

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

   ## Detalhes das Perguntas

   ### Pergunta 1 (Superficie): {pergunta}
   **Resposta simulada:** {resposta}
   **Avaliacao:** {justificativa para cada dimensao}

   ### Pergunta 2 (Media): {pergunta}
   ...

   ### Pergunta 3 (Profunda): {pergunta}
   ...

   ### Pergunta 4 (Paradoxo 1): {pergunta}
   ...

   ### Pergunta 5 (Paradoxo 2): {pergunta}
   ...

   ## Conclusao
   {Resumo da decisao e proximos passos}
   ```

8. **Salvar em** `data/minds/{slug}_regression_{timestamp}.md`

---

## Resumo dos Artefatos

| Step | Artefato | Caminho |
|------|----------|---------|
| 1 - Validacao | Backup do DNA | `data/minds/{slug}_backup_{timestamp}.yaml` |
| 2 - Delta Analysis | Insights extraidos | `data/minds/{slug}_delta_{timestamp}.md` |
| 3 - DNA Merge | DNA atualizado | `.claude/synapse/minds/{slug}.yaml` |
| 3 - DNA Merge | Log de ingestao | `.claude/synapse/ingestion/{YYYY-MM-DD}-{slug}.yaml` |
| 4 - Clone Update | Agente atualizado | `.claude/commands/DUARTEOS/{Cat}/{slug}.md` |
| 5 - Regression | Relatorio de fidelidade | `data/minds/{slug}_regression_{timestamp}.md` |

## Regras Criticas

1. **MERGE ADITIVO** — o merge NUNCA remove itens existentes do DNA. So adiciona ou reforça.
2. **ROLLBACK AUTOMATICO** — se a fidelidade cair mais de 5%, o update e revertido automaticamente sem intervencao do usuario.
3. **BACKUP OBRIGATORIO** — antes de qualquer merge, um backup completo do DNA e criado.
4. **EDIT > WRITE** — SEMPRE usar Edit tool para modificar arquivos existentes. Write so para secoes genuinamente novas.
5. **SOURCE_PATH** — todo insight DEVE ter rastreabilidade ate a fonte original.
6. **DEDUP** — verificar similaridade antes de adicionar. NAO duplicar insights identicos.
7. **VERSIONAMENTO** — `versao_dna` incrementa a cada update bem-sucedido.
8. **SO CONTEUDO FORNECIDO** — durante Delta Analysis, usar APENAS o material fornecido. NAO pesquisar na internet. NAO usar conhecimento previo.
9. **PRESERVAR CONTRADICOES** — se o expert se contradiz, registrar como evolucao em `dilemas.evolucao`, NAO tentar "resolver" a contradicao.
10. **IDEMPOTENCIA** — processar o mesmo material 2x nao deve duplicar insights no DNA.

## Exemplos de Uso

### Exemplo 1: Update com URL de video
```
/DUARTEOS:mmos:mind-update "Andrew Ng" https://youtube.com/watch?v=xxx

Step 1: Validando... andrew-ng.yaml existe (v1). Backup criado.
Step 2: WebFetch extraindo conteudo... 3 novos insights encontrados.
Step 3: Merge incremental... DNA atualizado para v2.
Step 4: Agente AI/andrew-ng.md editado (secao Frameworks atualizada).
Step 5: Fidelidade 82% -> 85%. SUCESSO.
```

### Exemplo 2: Update com arquivo local
```
/DUARTEOS:mmos:mind-update "Gary Halbert" /docs/boron-letters-ch5.pdf

Step 1: Validando... gary-halbert.yaml existe (v3). Backup criado.
Step 2: Lendo PDF... 7 novos insights + 2 reforcos.
Step 3: Merge incremental... DNA atualizado para v4.
Step 4: Agente Copywriting/gary-halbert.md editado (3 secoes atualizadas).
Step 5: Fidelidade 88% -> 91%. SUCESSO.
```

### Exemplo 3: Update com texto bruto
```
/DUARTEOS:mmos:mind-update "Naval Ravikant" "Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now."

Step 1: Validando... naval-ravikant.yaml existe (v2). Backup criado.
Step 2: Analisando texto... 1 novo insight (Filosofia) + 1 reforco (Heuristicas).
Step 3: Merge incremental... DNA atualizado para v3.
Step 4: Agente editado (secao "O Que Voce Valoriza" atualizada).
Step 5: Fidelidade 85% -> 86%. SUCESSO.
```

### Exemplo 4: Update sem fonte (processar inbox)
```
/DUARTEOS:mmos:mind-update "Pedro Sobral"

Step 1: Validando... pedro-sobral.yaml existe (v5). Backup criado.
        Sem fonte fornecida. Verificando inbox/pedro-sobral/...
        Encontrado: inbox/pedro-sobral/PODCASTS/sobral-ep142.txt
Step 2: Processando inbox... 12 novos insights.
Step 3: Merge incremental... DNA atualizado para v6.
Step 4: Agente Marketing/pedro-sobral.md editado (4 secoes atualizadas).
Step 5: Fidelidade 79% -> 83%. SUCESSO.
        Arquivo movido para inbox/processed/pedro-sobral/sobral-ep142.txt
```

### Exemplo 5: Update com rollback
```
/DUARTEOS:mmos:mind-update "Bill Gates" https://example.com/low-quality-article

Step 1: Validando... bill-gates.yaml existe (v2). Backup criado.
Step 2: WebFetch extraindo... 4 insights encontrados (qualidade questionavel).
Step 3: Merge incremental... DNA atualizado para v3.
Step 4: Agente Business/bill-gates.md editado.
Step 5: Fidelidade 86% -> 72%. ROLLBACK AUTOMATICO.
        DNA restaurado para v2. Agente revertido.
        Material de baixa qualidade ou inconsistente com DNA existente.
```
