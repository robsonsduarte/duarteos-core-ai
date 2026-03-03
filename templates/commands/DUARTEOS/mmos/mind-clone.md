# MMOS Mind Clone — Pipeline de Clonagem Cognitiva

Crie um agente baseado na mente de um especialista real usando o pipeline MMOS de 7 fases.
Merge do melhor dos sistemas MMOS (Synkra AIOS) e DuarteOS.

**Modo:** Pipeline sequencial — cada fase gera artefato antes de avancar
**Nivel:** Avancado — requer WebSearch, WebFetch
**DNA:** 6 Camadas Cognitivas (Filosofia, Frameworks, Heuristicas, Metodologias, Dilemas, Paradoxos Produtivos)
**Fidelidade-alvo:** >= 95% (15 prompts, paradoxos = 35% do score)
**OMEGA:** Cada fase roda sob o protocolo OMEGA — loop de refinamento ate threshold ou escalacao (ver `.claude/protocols/OMEGA.md`)

## Argumentos

$ARGUMENTS — nome do especialista a clonar (obrigatorio)

Se $ARGUMENTS estiver vazio, pergunte: "Qual especialista voce quer clonar? (nome completo)"

## Descricao

Este e o pipeline MMOS-powered de clonagem mental do DuarteOS. Ele combina o melhor de dois sistemas:

**Do MMOS (Synkra AIOS):**
- Gate de viabilidade APEX/ICP (Phase 0) — evita gastar tokens em candidatos sem material
- 6a camada cognitiva: Paradoxos Produtivos — contradicoes internas que tornam o clone humano
- Validacao expandida: 15 prompts com scoring ponderado (paradoxos = 35% do peso)
- Prompts finais mais extensos (~10k palavras) para maior fidelidade
- Triangulacao de fontes (minimo por camada)

**Do DuarteOS:**
- As 5 camadas originais (Filosofia, Frameworks, Heuristicas, Metodologias, Dilemas)
- Synapse Sync (memoria incremental viva)
- Rastreabilidade source_path
- Canonicalizacao de entidades
- Formato DuarteOS de agente (.md com secoes padrao)
- Integracao com inbox

Diferente do `/DUARTEOS:squad:clone-mind` (5 camadas, 5 perguntas de validacao), este pipeline
gera clones com DNA de 6 camadas e validacao rigorosa de 15 perguntas com foco em paradoxos.

## Canonicalizacao de Entidades

Antes de iniciar QUALQUER fase, o nome do especialista DEVE ser canonicalizado.

### Regras de Canonicalizacao

1. **Normalizar nome:** remover acentos, lowercase, hifens entre palavras
   - "Alex Hormozi" -> `alex-hormozi`
   - "Naval Ravikant" -> `naval-ravikant`
   - "Thiago Finch" -> `thiago-finch`
   - "Patricia Peck Pinheiro" -> `patricia-peck`

2. **Resolver variacoes:** diferentes formas do mesmo nome resolvem para o mesmo slug
   - "Hormozi", "Alex Hormozi", "Alex H." -> `alex-hormozi`
   - "Naval", "Naval Ravikant", "NavalR" -> `naval-ravikant`
   - "Dr. Drauzio", "Drauzio Varella" -> `drauzio-varella`

3. **Deteccao por contexto:** se o nome nao e reconhecido diretamente
   - Verificar se existe mind clone com nome similar em `.claude/synapse/minds/*.yaml`
   - Verificar aliases conhecidos (ex: "MrBeast" = "Jimmy Donaldson")
   - Se ambiguo: perguntar ao usuario

4. **Nome canonico = slug do arquivo:**
   - Viabilidade: `data/minds/{slug}_viability.md`
   - Fontes: `data/minds/{slug}_sources.md`
   - Analise: `data/minds/{slug}_analysis.md`
   - DNA YAML: `data/minds/{slug}_dna.yaml`
   - Synapse: `.claude/synapse/minds/{slug}.yaml`
   - Agente: `.claude/commands/DUARTEOS/{Categoria}/{slug}.md`
   - Validacao: `data/minds/{slug}_validation.md`
   - Inbox: `inbox/{slug}/`

5. **Regra critica:** NUNCA criar dois mind clones para a mesma pessoa
   - Antes de criar, SEMPRE verificar se ja existe com `Glob` em `synapse/minds/*.yaml`
   - Se existir: avisar usuario que deve usar `/DUARTEOS:mmos:mind-update` em vez de mind-clone
   - NUNCA criar duplicatas

## As 6 Camadas do DNA Mental

Todo mind clone gerado por este pipeline possui DNA estruturado em 6 camadas cognitivas:

| # | Camada | O que captura | Pergunta-chave |
|---|--------|---------------|----------------|
| 1 | **Filosofia** | Crencas fundamentais, visao de mundo, principios inegociaveis | "O que esta pessoa acredita ser verdade?" |
| 2 | **Frameworks** | Passos-a-passo, modelos de pensamento estruturados | "Como esta pessoa organiza e estrutura problemas?" |
| 3 | **Heuristicas** | Atalhos mentais, regras de bolso, padroes de decisao rapida | "Que atalhos mentais usa para decidir rapido?" |
| 4 | **Metodologias** | Processos repetiveis, sistemas formais, ferramentas | "Que sistemas formais segue consistentemente?" |
| 5 | **Dilemas** | Trade-offs, tensoes reconhecidas, zonas cinza, evolucao de posicoes | "Como lida com contradicoes e decisoes impossiveis?" |
| 6 | **Paradoxos Produtivos** | Contradicoes internas contextuais que coexistem | "Que comportamentos contraditorios manifesta dependendo do contexto?" |

A Camada 6 (Paradoxos Produtivos) e a contribuicao principal do MMOS. Paradoxos sao contradicoes
internas reais que a pessoa exibe dependendo do contexto — nao sao bugs, sao features da cognicao humana.
Eles sao o que torna um clone mental genuinamente autentico em vez de uma caricatura unidimensional.

---

## Pipeline de 7 Fases

---

### FASE 0: VIABILIDADE (APEX + ICP)

**Objetivo:** Avaliar se o candidato tem material-fonte suficiente para gerar um clone de alta fidelidade ANTES de gastar tokens nas fases seguintes.
**Artefato:** `data/minds/{slug}_viability.md`
**Dependencia:** Nenhuma (fase inicial)

#### APEX — 6 Dimensoes (1-10 cada, total /60)

Avalie o candidato em cada dimensao com nota de 1 a 10, justificando com evidencia:

| Dimensao | O que avalia | Criterio para nota alta (8-10) | Criterio para nota baixa (1-3) |
|----------|-------------|-------------------------------|-------------------------------|
| **Authority** | Status de expert, credenciais, reconhecimento | Referencia global na area, citado por pares | Desconhecido, sem credenciais verificaveis |
| **Productivity** | Volume e qualidade de output ao longo do tempo | Decadas de producao, multiplos livros/obras | Pouco output publicado, carreira curta |
| **Exemplarity** | Metodos originais, frameworks, abordagens unicas | Criou frameworks adotados por outros | Segue metodos de terceiros, sem inovacao |
| **X-Factor** | Impacto cultural, influencia alem do dominio | Influencia cross-domain, mudou a industria | Impacto restrito a nicho pequeno |
| **Accessibility** | Disponibilidade de material-fonte | Livros, entrevistas, ensaios abundantes online | Pouco material publico, privativo |
| **Singularity** | Assinatura cognitiva distinta | Estilo inconfundivel, facilmente reconhecivel | Generico, intercambiavel com outros experts |

**Formato de avaliacao:**

```markdown
## APEX Score

| Dimensao | Nota | Justificativa |
|----------|------|---------------|
| Authority | X/10 | {evidencia} |
| Productivity | X/10 | {evidencia} |
| Exemplarity | X/10 | {evidencia} |
| X-Factor | X/10 | {evidencia} |
| Accessibility | X/10 | {evidencia} |
| Singularity | X/10 | {evidencia} |
| **TOTAL** | **XX/60** | |
```

#### ICP — Ideal Candidate Profile (10 criterios binarios)

Avalie cada criterio como SIM ou NAO:

| # | Criterio | SIM/NAO | Evidencia |
|---|----------|---------|-----------|
| 1 | Livros escritos >= 2 | | |
| 2 | Anos de atividade publica >= 7 | | |
| 3 | Entrevistas/podcasts disponiveis >= 5 | | |
| 4 | Frameworks originais >= 1 | | |
| 5 | Transcricoes/ensaios publicos >= 10 | | |
| 6 | Reconhecimento de pares (citado, premiado, referenciado) | | |
| 7 | Corpo de trabalho consistente (nao one-hit-wonder) | | |
| 8 | Influencia cross-domain (alem do nicho primario) | | |
| 9 | Padroes de pensamento documentados (estilo identificavel) | | |
| 10 | Fontes primarias acessiveis (nao paywall total) | | |

**ICP Score:** X/10

#### Decisao GO/NO-GO

Aplique a matriz de decisao:

| Condicao | Decisao | Acao |
|----------|---------|------|
| APEX >= 36/60 **E** ICP >= 7/10 | **GO** | Avancar para Fase 1 |
| APEX 28-35 **OU** ICP 5-6 | **CAUTION** | Avisar usuario sobre limitacoes, pedir fontes adicionais, continuar com ressalvas documentadas |
| APEX < 28 **E** ICP < 5 | **NO-GO** | Abortar pipeline, explicar motivos, sugerir alternativas |

**Se CAUTION:** Registrar no artefato quais dimensoes sao fracas e que tipo de material adicional melhoraria o resultado. Perguntar ao usuario se deseja prosseguir ou fornecer mais fontes.

**Se NO-GO:** Responder com:
```
VIABILIDADE: NO-GO

APEX: {score}/60 (abaixo do minimo 28)
ICP: {score}/10 (abaixo do minimo 5)

Motivo: {explicacao}

Alternativas sugeridas:
- {expert similar com mais material}
- {expert similar com mais material}
- Fornecer material proprio (PDFs, transcricoes) via inbox/{slug}/
```

#### Procedimento

1. Use WebSearch para buscar informacoes basicas sobre o candidato: "{nome} expert", "{nome} livros", "{nome} entrevistas", "{nome} frameworks"
2. Avalie cada dimensao APEX com nota 1-10 e justificativa baseada em evidencia
3. Avalie cada criterio ICP como SIM/NAO com evidencia
4. Aplique a decisao GO/NO-GO
5. Salve o artefato em `data/minds/{slug}_viability.md`

#### Formato do Artefato

```markdown
# Viabilidade: {Nome Completo}
Data: {data}
Pipeline: MMOS Mind Clone

## APEX Score

| Dimensao | Nota | Justificativa |
|----------|------|---------------|
| Authority | X/10 | {evidencia} |
| Productivity | X/10 | {evidencia} |
| Exemplarity | X/10 | {evidencia} |
| X-Factor | X/10 | {evidencia} |
| Accessibility | X/10 | {evidencia} |
| Singularity | X/10 | {evidencia} |
| **TOTAL** | **XX/60** | |

## ICP Score

| # | Criterio | SIM/NAO | Evidencia |
|---|----------|---------|-----------|
| 1 | Livros >= 2 | | |
| 2 | Anos atividade >= 7 | | |
| 3 | Entrevistas >= 5 | | |
| 4 | Frameworks originais >= 1 | | |
| 5 | Transcricoes/ensaios >= 10 | | |
| 6 | Reconhecimento de pares | | |
| 7 | Corpo de trabalho consistente | | |
| 8 | Influencia cross-domain | | |
| 9 | Padroes de pensamento documentados | | |
| 10 | Fontes primarias acessiveis | | |
| **TOTAL** | **X/10** | |

## Decisao

**Status:** GO / CAUTION / NO-GO
**APEX:** {score}/60
**ICP:** {score}/10

{Justificativa da decisao}

{Se CAUTION: quais dimensoes sao fracas e que material ajudaria}
{Se NO-GO: alternativas sugeridas}
```

**NAO avance para Fase 1 sem decisao GO ou CAUTION com aceite do usuario.**

---

### FASE 1: RESEARCH (Coleta de Fontes Massiva)

**Objetivo:** Coletar material de alta qualidade sobre o especialista, com foco em volume e diversidade para garantir triangulacao.
**Artefato:** `data/minds/{slug}_sources.md`
**Dependencia:** Fase 0 concluida com GO ou CAUTION aceito

#### Procedimento

1. Crie o diretorio `data/minds/` se nao existir

2. Crie a estrutura de squad MMOS para o clone (conforme `protocols/MMOS-PIPELINE.md`):

   ```bash
   mkdir -p squads/{slug}/{archive/agents,archive/prompts}
   mkdir -p squads/{slug}/{artifacts/cognitive,artifacts/behavioral,artifacts/linguistic,artifacts/narrative}
   mkdir -p squads/{slug}/{checklists,data/raw,data/processed/transcriptions,data/processed/normalized,data/processed/fragments,data/contents}
   mkdir -p squads/{slug}/{drivers,frameworks,lib/hooks}
   mkdir -p squads/{slug}/{logs,prompts/main,prompts/sub-agents,prompts/tasks}
   mkdir -p squads/{slug}/{system-components,tasks,templates/communication}
   mkdir -p squads/{slug}/{tests/results,voices,workflows}
   mkdir -p squads/{slug}/{prd,todo}
   ```

   Crie o `squads/{slug}/config.yaml` inicial:

   ```yaml
   clone:
     name: "{Nome do Especialista}"
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
       main: "{slug}"
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

   Este scaffold sera populado incrementalmente pelas fases subsequentes.

3. Verifique se existe material no inbox (`inbox/{slug}/`):
   - Se existir: incorporar todos os arquivos como fontes primarias (prioridade maxima)
   - Registrar cada arquivo do inbox com `source_path` para rastreabilidade

4. Execute buscas sistematicas usando WebSearch e WebFetch em 4 categorias:

   **Categoria A: Obras e Publicacoes**
   - Buscar: "{nome} livro publicado", "{nome} book author"
   - Buscar: "{nome} artigo publicado", "{nome} blog post", "{nome} newsletter"
   - Buscar: "{nome} framework", "{nome} methodology", "{nome} modelo"
   - Para cada resultado relevante: extrair titulo, ano, resumo das ideias principais

   **Categoria B: Entrevistas e Palestras**
   - Buscar: "{nome} entrevista", "{nome} interview", "{nome} podcast"
   - Buscar: "{nome} palestra", "{nome} talk", "{nome} keynote"
   - Buscar: "{nome} TED talk", "{nome} conference", "{nome} depoimento"
   - Para cada resultado: extrair citacoes diretas, posicionamentos, opinioes

   **Categoria C: Pensamento e Filosofia**
   - Buscar: "{nome} filosofia", "{nome} philosophy", "{nome} principles"
   - Buscar: "{nome} conselho", "{nome} advice", "{nome} lessons learned"
   - Buscar: "{nome} decisao controversa", "{nome} contrarian opinion"
   - Buscar: "{nome} mental model", "{nome} framework decisao"
   - Buscar: "{nome} contradicao", "{nome} mudou de opiniao", "{nome} paradoxo"

   **Categoria D: Comunicacao e Estilo**
   - Buscar: "{nome} twitter/X quotes", "{nome} frases celebres"
   - Buscar: "{nome} estilo comunicacao", "{nome} writing style"
   - Se encontrar perfis publicos: analisar tom, vocabulario, padroes

5. **Target de fontes:**
   - Ideal: 20-30 fontes de qualidade (URLs verificaveis)
   - Minimo absoluto: 10 fontes
   - Se encontrar MENOS de 10 fontes: avisar usuario, pedir material adicional

6. **Requisitos de triangulacao por camada:**
   - Camadas 1-4 (Filosofia, Frameworks, Heuristicas, Metodologias): >= 3 fontes independentes cada
   - Camadas 5-6 (Dilemas, Paradoxos): >= 5 fontes independentes cada
   - Registrar no artefato quantas fontes cobrem cada camada

7. Compilar fontes em formato estruturado:

```markdown
# Fontes: {Nome do Especialista}
Data da coleta: {data}
Pipeline: MMOS Mind Clone
Total de fontes: {N}
Fontes do inbox: {N ou "nenhuma"}
Qualidade estimada: {alta/media/baixa}

## Cobertura por Camada

| Camada | Fontes | Minimo | Status |
|--------|--------|--------|--------|
| Filosofia | {N} | 3 | OK/INSUFICIENTE |
| Frameworks | {N} | 3 | OK/INSUFICIENTE |
| Heuristicas | {N} | 3 | OK/INSUFICIENTE |
| Metodologias | {N} | 3 | OK/INSUFICIENTE |
| Dilemas | {N} | 5 | OK/INSUFICIENTE |
| Paradoxos | {N} | 5 | OK/INSUFICIENTE |

## Fontes do Inbox (Primarias)
{Se existir material em inbox/{slug}/:}
1. **{arquivo}** — {resumo}
   Source path: inbox/{slug}/{tipo}/{arquivo}.txt

## Obras e Publicacoes
1. **{Titulo}** ({ano}) — {resumo das ideias principais}
   Fonte: {URL}
   Camadas cobertas: {lista de camadas que esta fonte alimenta}
   Citacoes relevantes:
   - "{citacao 1}"
   - "{citacao 2}"

2. ...

## Entrevistas e Palestras
1. **{Titulo}** ({ano}, {veiculo}) — {resumo}
   Fonte: {URL}
   Camadas cobertas: {lista}
   Citacoes relevantes:
   - "{citacao 1}"

2. ...

## Pensamento e Filosofia
1. **{Conceito/Principio}** — {descricao}
   Fonte: {URL}
   Camadas cobertas: {lista}
   Contexto: {como ele chegou nessa conclusao}

2. ...

## Comunicacao e Estilo
- Tom predominante: {ex: direto, provocativo, academico, humilde}
- Palavras/frases recorrentes: [lista]
- Metaforas favoritas: [lista]
- Como abre uma conversa: {padrao}
- Como encerra um argumento: {padrao}
- Fontes: {URLs}
```

8. **Validacao da Fase 1:**
   - MINIMO 10 fontes de qualidade (URLs verificaveis ou source_path do inbox)
   - Todas as 6 camadas com cobertura minima atendida
   - Se alguma camada esta INSUFICIENTE:
     - Avisar: "Cobertura insuficiente para camada {X}. Clone tera limitacao nesta area."
     - Perguntar: "Voce tem URLs, documentos ou transcricoes adicionais?"
     - Se usuario fornecer: incorporar e revalidar
     - Se nao fornecer: documentar limitacao e prosseguir com ressalva

9. Salvar em `data/minds/{slug}_sources.md`

**NAO avance para Fase 2 sem o artefato salvo e validado.**

---

### FASE 2: COGNITIVE ANALYSIS (Extracao 6 Camadas + Extras)

**Objetivo:** Ler todas as fontes e extrair padroes cognitivos em 6 camadas + campos extras de comunicacao, expertise e comportamento.
**Artefato:** `data/minds/{slug}_analysis.md`
**Dependencia:** Fase 1 concluida

#### Procedimento

1. Leia `data/minds/{slug}_sources.md` integralmente

2. Para CADA fonte, acesse com WebFetch (URLs) ou Read (inbox) e extraia padroes nas dimensoes abaixo.

3. **Extracao das 6 Camadas Core do DNA:**

   **Camada 1: Filosofia — crencas, visao de mundo, principios inegociaveis**
   - Quais sao suas crencas fundamentais sobre o mundo/mercado/vida?
   - Que principios ele NUNCA viola, mesmo sob pressao?
   - Qual sua visao de mundo? (otimista/pragmatico/cetico/idealista)
   - Que verdades considera autoevidentes?
   - Requisito: >= 3 fontes independentes corroborando cada crenca core

   **Camada 2: Frameworks — modelos mentais estruturados, processo decisorio**
   - Quais frameworks ele usa para pensar?
   - Como ele estrutura problemas complexos?
   - Quais analogias/metaforas usa repetidamente?
   - Qual seu modelo de mundo? (sistemico/linear, etc.)
   - Requisito: >= 3 fontes independentes por framework primario

   **Camada 3: Heuristicas — regras rapidas, trigger->acao, red flags, vieses**
   - Que regras de bolso usa para decisoes rapidas?
   - Quais "red flags" fazem ele parar imediatamente?
   - Que vieses ele reconhece ter conscientemente?
   - Que atalhos mentais aplica? (regra 80/20, inversao, first principles, etc.)
   - Requisito: >= 3 fontes independentes

   **Camada 4: Metodologias — processos repetiveis, ferramentas preferidas**
   - Que processos repetiveis e documentados ele segue?
   - Quais ferramentas/tecnicas sempre recomenda?
   - Que sistemas formais estruturam seu trabalho?
   - Requisito: >= 3 fontes independentes

   **Camada 5: Dilemas — tradeoffs, zonas cinza, evolucao de posicao**
   - Que trade-offs tipicos ele enfrenta e como resolve?
   - Em que areas admite nao ter resposta definitiva?
   - Que posicoes mudou ao longo do tempo e por que?
   - Como lida com decisoes impossiveis?
   - Requisito: >= 5 fontes independentes

   **Camada 6: Paradoxos Produtivos — contradicoes internas contextuais (A MAIS CRITICA)**

   Esta e a camada que diferencia o pipeline MMOS. Paradoxos sao comportamentos contraditorios
   REAIS que coexistem na mesma pessoa, ativados por contextos diferentes. Nao sao incoerencias —
   sao a complexidade natural do pensamento humano.

   Para cada paradoxo identificado, extrair:
   - `lado_a`: uma posicao ou comportamento (ex: "Prega simplicidade")
   - `lado_b`: posicao oposta que tambem exibe (ex: "Cria sistemas complexos")
   - `trigger_a`: contexto/situacao onde lado A emerge (ex: "Ao discutir teoria com iniciantes")
   - `trigger_b`: contexto/situacao onde lado B emerge (ex: "Ao implementar solucoes em producao")
   - `resolucao`: como a pessoa reconcilia internamente (ex: "Simples na interface, complexo por baixo")
   - `exemplos`: >= 3 exemplos de fontes independentes mostrando cada lado
   - `valor_autenticidade`: alto/medio/baixo (baseado na qualidade da evidencia)

   **Minimo:** 2 paradoxos bem documentados
   **Ideal:** 4-6 paradoxos
   **Requisito:** Cada paradoxo com >= 3 exemplos de fontes independentes

   **Exemplos de paradoxos comuns:**
   - Prega X, pratica Y (em contextos diferentes, nao hipocrisia)
   - Valoriza A acima de tudo, mas sacrifica A por B em situacao C
   - E {adjetivo} quando {contexto1}, mas {adjetivo oposto} quando {contexto2}
   - Defende {posicao} publicamente, mas internamente reconhece {nuance}

4. **Extracao dos Campos Extras (fora das 6 camadas, mas parte do DNA):**

   **Communication: estilo, tom, vocabulario**
   - Como ele explica conceitos complexos? (analogia, exemplo, historia, dados)
   - Qual o tamanho tipico de suas respostas? (conciso vs elaborado)
   - Usa humor? Que tipo?
   - Como ele discorda de alguem?
   - Como ele admite que nao sabe algo?
   - Como ele persuade?
   - Termos tecnicos recorrentes
   - Expressoes e jargoes proprios
   - Frases de efeito/assinatura
   - Palavras/expressoes que NUNCA usa

   **Expertise: dominio profundo, conhecimento amplo, blind spots, influencias**
   - Areas de expertise profunda (decadas de estudo/pratica)
   - Areas de conhecimento amplo (sabe bastante mas nao e especialista)
   - Blind spots declarados ou observaveis
   - Quem o influenciou (pessoas, livros, escolas de pensamento)

   **Behavior: padroes situacionais**
   - Quando confiante: como se comporta
   - Quando incerto: como se comporta
   - Sob pressao: como se comporta
   - Quando erra: como reage
   - Quando ensina: como se comporta

5. Compilar analise:

```markdown
# Analise Cognitiva: {Nome do Especialista}
Data da analise: {data}
Pipeline: MMOS Mind Clone
Fontes analisadas: {N}
Paradoxos identificados: {N}

## Camada 1: Filosofia

### Crencas Core
1. **{crenca}**
   - Evidencia: {fonte 1}, {fonte 2}, {fonte 3}
   - Citacao: "{citacao direta}"

2. ...

### Visao de Mundo
{descricao detalhada}

### Principios Inegociaveis
1. {principio} — evidencia: {fonte}
2. ...

## Camada 2: Frameworks

### Framework Primario: {nome}
{descricao detalhada de como funciona}
Steps: {lista de passos}
Quando usar: {situacao}
Fontes: {fonte 1}, {fonte 2}, {fonte 3}

### Outros Frameworks
- {framework}: {descricao} (fontes: {lista})
- ...

### Modelo de Decisao
{como decide: dados vs intuicao, rapido vs deliberado}

## Camada 3: Heuristicas

### Regras Rapidas
| Trigger | Acao | Fonte |
|---------|------|-------|
| {quando} | {faz} | {URL ou source_path} |
| ... | ... | ... |

### Red Flags
- {sinal de alerta} — fonte: {URL}
- ...

### Vieses Conhecidos
- {vies que reconhece} — fonte: {URL}
- ...

## Camada 4: Metodologias

### Processos Repetiveis
1. **{processo}**
   Descricao: {o que faz}
   Etapas: {lista}
   Fontes: {lista}

2. ...

### Ferramentas Preferidas
- {ferramenta/tecnica} — contexto: {quando usa}
- ...

## Camada 5: Dilemas

### Tradeoffs Tipicos
| Tensao | Posicao | Justificativa | Fonte |
|--------|---------|---------------|-------|
| {X vs Y} | {como resolve} | {por que} | {URL} |
| ... | ... | ... | ... |

### Zonas Cinza
- {area sem resposta definitiva} — {como lida}
- ...

### Evolucao de Posicoes
| De | Para | Quando | Motivo | Fonte |
|----|------|--------|--------|-------|
| {antes} | {depois} | {periodo} | {por que mudou} | {URL} |
| ... | ... | ... | ... | ... |

## Camada 6: Paradoxos Produtivos [CRITICA]

### Paradoxo 1: {titulo descritivo}
- **Lado A:** {posicao/comportamento}
- **Lado B:** {posicao/comportamento oposto}
- **Trigger A:** {contexto onde lado A emerge}
- **Trigger B:** {contexto onde lado B emerge}
- **Resolucao:** {como reconcilia}
- **Valor de autenticidade:** alto/medio/baixo
- **Exemplos:**
  1. {exemplo de fonte 1 mostrando o paradoxo}
  2. {exemplo de fonte 2}
  3. {exemplo de fonte 3}

### Paradoxo 2: {titulo descritivo}
{mesmo formato}

### Paradoxo N: ...

### Nota sobre Paradoxos
{Observacao geral sobre como os paradoxos se relacionam entre si e o que revelam sobre a pessoa}

## Comunicacao

### Estilo Geral
{descricao do estilo de comunicacao}

### Padroes Especificos
- Ao explicar: {padrao}
- Ao discordar: {padrao}
- Ao nao saber: {padrao}
- Ao convencer: {padrao}

### Vocabulario Caracteristico
- Frases-assinatura: {lista}
- Termos tecnicos: {lista}
- Palavras proibidas: {lista}
- Tom predominante: {descricao}
- Uso de humor: {descricao}
- Extensao tipica de respostas: {conciso/moderado/elaborado}

## Expertise
- **Dominio profundo:** {lista}
- **Conhecimento amplo:** {lista}
- **Blind spots:** {lista}
- **Influencias:** {lista}

## Comportamento Situacional
- **Quando confiante:** {comportamento}
- **Quando incerto:** {comportamento}
- **Sob pressao:** {comportamento}
- **Quando erra:** {comportamento}
- **Quando ensina:** {comportamento}
```

6. Salvar em `data/minds/{slug}_analysis.md`

**NAO avance para Fase 3 sem o artefato salvo.**

---

### FASE 3: DNA SYNTHESIS (YAML 6 Camadas)

**Objetivo:** Transformar a analise cognitiva em DNA estruturado YAML no formato DuarteOS, com as 6 camadas + campos extras.
**Artefato:** `data/minds/{slug}_dna.yaml`
**Dependencia:** Fase 2 concluida

#### Procedimento

1. Leia `data/minds/{slug}_analysis.md` integralmente

2. Leia `data/minds/{slug}_viability.md` para os scores APEX e ICP

3. Sintetize em formato YAML estruturado:

```yaml
# DNA Mental: {Nome do Especialista}
# Pipeline: MMOS Mind Clone
# Synapse Mind Clone — Memoria Incremental
# Gerado em: {data}
# Fontes processadas: {N}
# Confianca: {alta/media/baixa}
# APEX: {score}/60 | ICP: {score}/10

identity:
  name: "{Nome Completo}"
  slug: "{nome-normalizado}"
  domain: "{Dominio Principal}"
  archetype: "{Arquetipo — 2-3 palavras}"
  clone_file: ".claude/commands/DUARTEOS/{Categoria}/{slug}.md"
  apex_score: {XX}/60
  icp_score: {X}/10

filosofia:
  crencas_core:
    - belief: "{crenca fundamental}"
      evidencia: "{fonte/citacao}"
      source_path: "{URL ou inbox path}"
    - belief: "{crenca 2}"
      evidencia: "{fonte}"
      source_path: "{URL ou inbox path}"
  visao_de_mundo: "{descricao da visao de mundo}"
  principios_inegociaveis:
    - "{principio 1}"
    - "{principio 2}"

frameworks:
  primarios:
    - name: "{Nome do Framework}"
      steps:
        - "{passo 1}"
        - "{passo 2}"
        - "{passo 3}"
      quando_usar: "{situacao/contexto}"
    - name: "{Framework 2}"
      steps: ["{passo 1}", "{passo 2}"]
      quando_usar: "{situacao}"
  modelo_decisao: "{descricao de como decide}"

heuristicas:
  regras_rapidas:
    - trigger: "{quando/sinal}"
      acao: "{o que faz}"
      fonte: "{referencia}"
      source_path: "{URL ou inbox path}"
    - trigger: "{trigger 2}"
      acao: "{acao 2}"
      fonte: "{referencia}"
      source_path: "{URL ou inbox path}"
  vieses_conhecidos:
    - "{vies que reconhece}"
  red_flags:
    - "{sinal que faz parar}"

metodologias:
  processos:
    - name: "{Nome do Processo}"
      descricao: "{o que faz}"
      etapas:
        - "{etapa 1}"
        - "{etapa 2}"
    - name: "{Processo 2}"
      descricao: "{descricao}"
      etapas: ["{etapa 1}", "{etapa 2}"]
  ferramentas_preferidas:
    - "{ferramenta/tecnica 1}"
    - "{ferramenta/tecnica 2}"

dilemas:
  tradeoffs_tipicos:
    - tensao: "{X vs Y}"
      posicao: "{como resolve}"
      justificativa: "{por que}"
    - tensao: "{tensao 2}"
      posicao: "{posicao}"
      justificativa: "{justificativa}"
  zonas_cinza:
    - "{area sem resposta definitiva}"
  evolucao:
    - de: "{posicao antiga}"
      para: "{posicao nova}"
      quando: "{periodo/momento}"
      motivo: "{por que mudou}"

paradoxos_produtivos:
  paradoxos:
    - lado_a: "{posicao/comportamento A}"
      lado_b: "{posicao/comportamento B — oposto de A}"
      trigger_a: "{contexto onde A emerge}"
      trigger_b: "{contexto onde B emerge}"
      resolucao: "{como reconcilia internamente}"
      exemplos:
        - fonte: "{URL ou source_path}"
          citacao: "{evidencia do paradoxo}"
        - fonte: "{URL ou source_path}"
          citacao: "{evidencia do paradoxo}"
        - fonte: "{URL ou source_path}"
          citacao: "{evidencia do paradoxo}"
      valor_autenticidade: alto  # alto|medio|baixo
    - lado_a: "{paradoxo 2 lado A}"
      lado_b: "{paradoxo 2 lado B}"
      trigger_a: "{trigger A}"
      trigger_b: "{trigger B}"
      resolucao: "{resolucao}"
      exemplos:
        - fonte: "{fonte}"
          citacao: "{citacao}"
      valor_autenticidade: medio
  nota_camada: "{Observacao geral sobre como os paradoxos se relacionam}"

communication:
  style: "{estilo geral — ex: direto e provocativo}"
  tone: "{tom predominante — ex: autoritativo mas acessivel}"
  vocabulary:
    signature_phrases:
      - "{frase-assinatura 1}"
      - "{frase-assinatura 2}"
    technical_terms:
      - "{termo tecnico recorrente}"
    avoided_words:
      - "{palavra/expressao que nunca usa}"
  patterns:
    explaining: "{como explica conceitos}"
    disagreeing: "{como discorda}"
    admitting_ignorance: "{como admite nao saber}"
    persuading: "{como convence}"
  response_length: "{conciso/moderado/elaborado}"
  humor: "{tipo de humor ou 'raramente usa humor'}"

expertise:
  deep:
    - "{area de expertise profunda 1}"
    - "{area de expertise profunda 2}"
  broad:
    - "{area de conhecimento amplo 1}"
    - "{area de conhecimento amplo 2}"
  blind_spots:
    - "{limitacao/ponto cego 1}"
    - "{limitacao/ponto cego 2}"
  influences:
    - "{pessoa/livro/escola que o influenciou}"

behavior:
  when_confident: "{como age quando tem certeza}"
  when_uncertain: "{como age quando nao tem certeza}"
  under_pressure: "{como age sob pressao}"
  when_wrong: "{como reage ao estar errado}"
  when_teaching: "{como ensina/mentora}"

ingestion_log:
  - date: "{data}"
    source: "{tipo — web/inbox/pdf}"
    title: "{titulo da fonte}"
    source_path: "{URL ou inbox path}"
    insights_extraidos: {N}
    camadas_atualizadas:
      - "{camada 1}"
      - "{camada 2}"

stats:
  total_fontes: {N}
  ultima_atualizacao: "{data}"
  versao_dna: 1
  confianca_geral: "{alta/media/baixa}"
  apex_score: {XX}/60
  icp_score: {X}/10
  fidelidade: null  # preenchido apos Fase 5
```

4. Revisar o YAML:
   - Cada campo deve ser preenchido com base em EVIDENCIA da analise
   - Campos sem evidencia suficiente: preencher com `"[dados insuficientes]"` em vez de inventar
   - O YAML deve ser parseable (sem erros de sintaxe)
   - Paradoxos devem ter exemplos com fontes reais
   - source_path deve apontar para URLs reais ou caminhos de inbox validos

5. Salvar em `data/minds/{slug}_dna.yaml`

**NAO avance para Fase 3.5 sem o artefato salvo.**

---

### FASE 3.5: SYNAPSE SYNC (Persistir DNA Incremental)

**Objetivo:** Persistir o DNA no Synapse para memoria incremental viva.
**Artefato:** `.claude/synapse/minds/{slug}.yaml`
**Dependencia:** Fase 3 concluida

#### Procedimento

1. Verifique se `.claude/synapse/minds/` existe (crie com `mkdir -p` se nao existir)

2. Verifique se ja existe um DNA para este expert:

   **Se `.claude/synapse/minds/{slug}.yaml` JA EXISTE:**
   - LEIA o DNA existente
   - MERGE incremental:
     - Adicione novas crencas, frameworks, heuristicas, metodologias, dilemas, paradoxos
     - NUNCA remova entradas existentes
     - Se uma entrada ja existe com conteudo similar, nao duplicar
     - Adicione novos paradoxos ao array existente
   - Incremente `stats.versao_dna`
   - Adicione entrada no `ingestion_log`
   - Atualize `stats.ultima_atualizacao`
   - Atualize `stats.fidelidade` se disponivel

   **Se NAO EXISTE:**
   - Copie o YAML da Fase 3 diretamente
   - Defina `stats.versao_dna: 1`

3. Atualize o indice `.claude/synapse/minds/_index.yaml`:

```yaml
# Indice de Mind Clones — Synapse
# Auto-gerado pelo MMOS mind-clone

minds:
  - slug: "{slug}"
    name: "{Nome Completo}"
    domain: "{dominio}"
    pipeline: "mmos"
    versao_dna: {N}
    ultima_atualizacao: "{data}"
    confianca: "{nivel}"
    apex_score: {XX}/60
    icp_score: {X}/10
    clone_file: ".claude/commands/DUARTEOS/{Categoria}/{slug}.md"
```

4. Registre a ingestao em `.claude/synapse/ingestion/{YYYY-MM-DD}-{slug}.yaml`:

```yaml
date: "{data}"
source_type: "mmos-pipeline"
source_url: null
title: "MMOS Mind Clone: {Nome Completo}"
mind_clone: "{slug}"
pipeline: "mmos"
camadas_impactadas:
  - filosofia
  - frameworks
  - heuristicas
  - metodologias
  - dilemas
  - paradoxos_produtivos
insights:
  - camada: "{camada}"
    insight: "{descricao}"
versao_dna_antes: {N-1 ou 0}
versao_dna_depois: {N}
```

5. Confirme: "DNA sincronizado com Synapse (versao {N}, pipeline MMOS)"

**NAO avance para Fase 4 sem o DNA salvo no Synapse.**

---

### FASE 4: IMPLEMENTATION (Gerar Agente — Prompt Extenso)

**Objetivo:** Transformar o DNA de 6 camadas em um agente funcional do DuarteOS com prompt extenso (~10k palavras) e secao dedicada a paradoxos.
**Artefato:** `.claude/commands/DUARTEOS/{Categoria}/{slug}.md`
**Dependencia:** Fase 3.5 concluida

#### Procedimento

1. Leia `data/minds/{slug}_dna.yaml`
2. Leia `data/minds/{slug}_viability.md` para scores APEX/ICP

3. Determine a Categoria com base no dominio:
   - AI, Tech, Business, Marketing, Copywriting, UX-Design, Content, Product, Saude, Juridico
   - Se nenhuma existente se encaixa, criar nova categoria

4. Gere o arquivo do agente no formato padrao DuarteOS com as seguintes secoes:

```markdown
---
name: "{slug}"
description: "Mind clone MMOS de {Nome Completo} — {archetype}"
tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - WebSearch
  - WebFetch
model: sonnet
type: mind-clone
pipeline: mmos
source_dna: "data/minds/{slug}_dna.yaml"
apex_score: {XX}/60
icp_score: {X}/10
fidelidade: null
created_at: "{data}"
confidence: "{alta/media/baixa}"
---

# {Nome Completo} — Mind Clone

Voce e um agente que pensa, decide e comunica como {Nome Completo}.
Clone gerado pelo pipeline MMOS do DuarteOS com DNA de 6 camadas cognitivas.

## Quem Voce E

{Paragrafo extenso em 1a pessoa. Conte a historia desta pessoa: de onde veio, o que construiu,
o que a move, qual o principio central da vida/carreira. Use o TOM da propria pessoa — se ela
e direta, seja direto; se usa historias, use historias. Este paragrafo deve ter 300-500 palavras.
Mencione conquistas especificas, momentos definidores, evolucao ao longo da carreira.
O leitor deve sentir que esta ouvindo a pessoa falar.}

## Como Voce Pensa

{Descricao detalhada dos modelos mentais, como resolve problemas, como estrutura pensamento.
Use exemplos especificos e concretos. 500-800 palavras.}

### Modelos Mentais Primarios

{Para cada framework primario do DNA:}

**{Nome do Framework}**
{Descricao detalhada de como funciona, quando usar, exemplo pratico.
Escreva como se a pessoa estivesse explicando o framework. 150-250 palavras por framework.}

### Processo Decisorio

{Baseado em modelo_decisao. Descreva passo a passo como a pessoa decide.
Inclua: dados vs intuicao, velocidade, criterios, como lida com incerteza. 200-400 palavras.}

### Heuristicas — Regras de Bolso

{Lista detalhada das regras rapidas, formatada como instruces acionaveis:}

Quando {trigger}, voce {acao}. (Fonte: {referencia})

{Red flags — sinais que fazem parar:}

Se perceber {red_flag}, PARE imediatamente e {acao}.

{Vieses conhecidos — reconheca honestamente:}

Voce sabe que tende a {vies}. Quando perceber isso, {mitigacao}.

### Metodologias e Processos

{Para cada processo repetivel do DNA:}

**{Nome do Processo}**
1. {Etapa 1}
2. {Etapa 2}
3. ...
{Quando usar: {contexto}. Ferramentas: {lista}.}

## Como Voce Comunica

{Baseado em communication. Descricao detalhada do estilo, tom, extensao, padroes. 300-500 palavras.}

### Regras de Comunicacao

1. {Regra derivada do estilo — ex: "Sempre use analogias para explicar conceitos abstratos"}
2. {Regra derivada do tom — ex: "Seja direto, nunca use linguagem corporativa"}
3. {Regra derivada do vocabulario}
4. {Regra derivada dos padroes}
5. {Regra derivada do response_length}
6. {Regra derivada do humor}
7. {Regra derivada dos padroes de discordancia}

### Vocabulario Obrigatorio

Frases e termos que voce DEVE usar naturalmente:
{Lista de signature_phrases e technical_terms, com contexto de quando usar cada um}

### Vocabulario Proibido

Nunca use estas palavras/expressoes:
{Lista de avoided_words, com justificativa de por que esta pessoa nunca diria isso}

## O Que Voce Valoriza

{Baseado em filosofia + dilemas. Liste valores core e como se manifestam. 300-500 palavras.}

### Prioridades

{Lista de prioridades em ordem, com justificativa}

### Linhas Vermelhas

{Baseado em principios_inegociaveis. Lista de coisas que voce NUNCA faz, com explicacao:}

- NUNCA {acao proibida} — porque {justificativa}
- ...

## Sua Expertise

### Dominio Profundo

{Lista de areas deep com descricao do nivel de conhecimento e exemplos de quando demonstra profundidade}

### Conhecimento Amplo

{Lista de areas broad com descricao do que sabe e do que nao sabe em cada area}

### Limitacoes (Honestas)

{Lista de blind_spots — o agente deve reconhecer estas limitacoes quando questionado:}

- {limitacao}: "{como a pessoa diria que nao sabe disso, no estilo dela}"
- ...

### Influencias

{Lista de influencias com descricao de como cada uma moldou o pensamento}

## Comportamento Situacional

- **Quando tem certeza:** {when_confident — descricao detalhada do comportamento}
- **Quando tem duvida:** {when_uncertain — como expressa incerteza no estilo da pessoa}
- **Sob pressao:** {under_pressure — como reage, o que prioriza}
- **Quando erra:** {when_wrong — como reage ao erro, o que faz depois}
- **Quando ensina:** {when_teaching — como adapta comunicacao, que tecnicas usa}

## Paradoxos Produtivos

Esta secao e CRITICA para sua autenticidade. Paradoxos sao o que te torna humano em vez de
uma caricatura unidimensional. Voce exibe comportamentos aparentemente contraditorios dependendo
do contexto — isso nao e inconsistencia, e complexidade cognitiva real.

{Para CADA paradoxo do DNA:}

### {Titulo do Paradoxo}

Quando {trigger_a}, voce {lado_a}.
Quando {trigger_b}, voce {lado_b}.

**Resolucao:** {resolucao — como voce reconcilia internamente}

{Paragrafo explicando quando e por que cada lado emerge, com exemplos concretos.
150-250 palavras por paradoxo.}

---

{Nota geral sobre como os paradoxos se relacionam, extraida de nota_camada do DNA.}

## Dilemas e Evolucao

### Trade-offs que Voce Reconhece

{Para cada tradeoff:}
- **{tensao}:** {posicao}. {justificativa}

### Zonas Cinza

{Areas onde voce admite incerteza, no estilo da pessoa}

### Como Voce Evoluiu

{Para cada evolucao de posicao:}
- Antes voce {de}. Hoje voce {para}. Mudou porque {motivo}.

## Regras Finais

1. Nunca invente informacao que {Nome} nao diria — prefira dizer "nao sei" no estilo dele/dela
2. Mantenha consistencia com os modelos mentais listados acima
3. Use o vocabulario obrigatorio naturalmente, nao forcado
4. Reconheca limitacoes quando questionado fora do dominio de expertise
5. Ative o paradoxo correto para o contexto — nao fique preso em apenas um lado
6. Quando confrontado com contradicoes, explique o contexto que ativa cada lado
7. Evolua — se o usuario fornecer novas informacoes sobre {Nome}, integre ao seu modelo mental
8. Prefira profundidade a superficialidade — esta pessoa e expert, respostas rasas sao inautenticas
9. Mantenha o tom e estilo em 100% das respostas — quebra de estilo e quebra de fidelidade
10. Em caso de duvida sobre como {Nome} responderia, diga honestamente que nao tem certeza
```

5. O prompt total deve ter aproximadamente 10.000 palavras (8.000-12.000 aceitavel).
   Se ficar abaixo de 8.000: expandir secoes "Como Voce Pensa" e "Paradoxos Produtivos".
   Se ficar acima de 12.000: condensar sem perder conteudo critico.

6. Salvar em `.claude/commands/DUARTEOS/{Categoria}/{slug}.md`
7. Salvar copia identica em `templates/commands/DUARTEOS/{Categoria}/{slug}.md`

**NAO avance para Fase 5 sem o artefato salvo.**

---

### FASE 5: VALIDATION (15 Prompts — Fidelidade Expandida)

**Objetivo:** Validar que o agente captura fielmente a essencia do especialista usando 15 perguntas distribuidas em 4 niveis, com peso especial em paradoxos.
**Artefato:** `data/minds/{slug}_validation.md`
**Dependencia:** Fase 4 concluida

#### 15 Perguntas de Teste

As perguntas sao distribuidas em 4 niveis de profundidade:

**Nivel 1: Superficie (4 perguntas — Camadas 1-2)**
Testam comportamento visivel e frameworks basicos:
1. Pergunta tecnica direta sobre area de expertise principal
2. Pedido para explicar seu framework mais conhecido
3. Pergunta sobre como ve o futuro do seu dominio
4. Pedido de conselho pratico para alguem comecando na area

**Nivel 2: Profundidade Media (4 perguntas — Camadas 3-4)**
Testam heuristicas e metodologias internalizadas:
5. Cenario que exige decisao rapida com informacao incompleta (testa heuristicas)
6. Pedido para descrever processo que usa para {tarefa tipica do dominio}
7. Pergunta sobre red flags que identifica em {contexto do dominio}
8. Cenario que exige escolha entre duas opcoes boas (testa criterios)

**Nivel 3: Profundidade Alta (3 perguntas — Camada 5)**
Testam dilemas, valores e maturidade intelectual:
9. Cenario com trade-off moral/etico no dominio
10. Pergunta sobre algo em que mudou de opiniao ao longo dos anos
11. Pergunta fora do dominio de expertise (testa como lida com limitacoes)

**Nivel 4: Paradoxos (4 perguntas — Camada 6) [CRITICAS]**
Testam se o clone manifesta contradicoes contextuais autenticas:
12. Cenario que deveria ativar `trigger_a` do paradoxo 1 (espera-se `lado_a`)
13. Cenario que deveria ativar `trigger_b` do paradoxo 1 (espera-se `lado_b`)
14. Cenario ambiguo que poderia ativar qualquer lado de um paradoxo (testa se o clone navega a ambiguidade)
15. Pergunta direta sobre uma contradicao aparente ("voce diz X mas tambem diz Y — como explica?")

#### Criterios de Avaliacao (por pergunta)

Para cada uma das 15 perguntas, avaliar em 6 criterios (0-100):

| Criterio | O que avalia |
|----------|-------------|
| Estilo | Tom, extensao, estrutura da resposta |
| Vocabulario | Usa termos/frases caracteristicos |
| Modelos Mentais | Aplica os frameworks corretos |
| Valores | Prioridades e evitacoes consistentes |
| Autenticidade | "Soa como a pessoa real?" |
| Paradoxos | Manifesta o lado correto para o contexto (Nivel 4) ou complexidade (Niveis 1-3) |

#### Formula de Fidelidade

```
fidelidade = (superficie_avg * 0.15) + (media_avg * 0.20) + (profunda_avg * 0.30) + (paradoxos_avg * 0.35)
```

Os pesos refletem a importancia relativa:
- Superficie (15%): comportamento basico e facil de acertar
- Media (20%): heuristicas requerem internalizacao real
- Profunda (30%): dilemas revelam profundidade do modelo
- Paradoxos (35%): contradicoes contextuais sao o teste definitivo de autenticidade

#### Classificacao

| Score | Status | Acao |
|-------|--------|------|
| >= 95% | **APROVADO** | Producao ready — agente pronto para uso |
| 85-94% | **PARCIAL** | Iterar Fase 4 — ajustar prompt (max 3 iteracoes) |
| 70-84% | **FRACO** | Voltar Fase 2 — coletar mais fontes, reextrair |
| < 70% | **REPROVADO** | Abortar — fontes insuficientes para clone fiel |

#### Notificacao ao Usuario

Se a fidelidade ficar **abaixo de 95%**, o sistema DEVE notificar o usuario com:

```
FIDELIDADE ABAIXO DO THRESHOLD

Clone: {Nome do Especialista}
Score obtido: {score}%
Threshold minimo: 95%
Gap: {95 - score}%

Camadas mais fracas:
1. {camada} — {score_camada}% (peso: {peso}%)
2. {camada} — {score_camada}% (peso: {peso}%)

Opcoes:
1. Iterar (ajustar prompt e re-validar) — recomendado se gap < 10%
2. Fornecer mais fontes (voltar a Fase 1) — recomendado se gap >= 10%
3. Aceitar com ressalvas (usar clone abaixo do threshold)
4. Abortar pipeline

Qual opcao voce prefere? (1/2/3/4)
```

O usuario DEVE ser consultado antes de qualquer iteracao ou abandono.

#### Procedimento

1. Leia o agente gerado na Fase 4
2. Leia o DNA da Fase 3 para referencia
3. Crie as 15 perguntas seguindo a distribuicao por nivel
4. Para cada pergunta, gere a resposta como o agente faria (usando o system prompt completo)
5. Avalie cada resposta nos 6 criterios

6. Compilar validacao:

```markdown
# Validacao MMOS: {Nome do Especialista}
Data: {data}
Pipeline: MMOS Mind Clone
Score Final: {score}%
Status: {APROVADO/PARCIAL/FRACO/REPROVADO}
Iteracao: {1/2/3}

## Resumo por Nivel

| Nivel | Perguntas | Media | Peso | Ponderado |
|-------|-----------|-------|------|-----------|
| Superficie (1-2) | 1-4 | {X}% | 15% | {Y}% |
| Media (3-4) | 5-8 | {X}% | 20% | {Y}% |
| Profunda (5) | 9-11 | {X}% | 30% | {Y}% |
| Paradoxos (6) | 12-15 | {X}% | 35% | {Y}% |
| **TOTAL** | | | | **{score}%** |

## Nivel 1: Superficie

### Pergunta 1: {pergunta}
**Resposta do Agente:**
{resposta}

**Avaliacao:**
| Criterio | Score | Justificativa |
|----------|-------|---------------|
| Estilo | {X}/100 | {justificativa} |
| Vocabulario | {X}/100 | {justificativa} |
| Modelos Mentais | {X}/100 | {justificativa} |
| Valores | {X}/100 | {justificativa} |
| Autenticidade | {X}/100 | {justificativa} |
| Paradoxos | {X}/100 | {justificativa} |
| **Media** | **{X}/100** | |

### Pergunta 2: {pergunta}
{mesmo formato}

### Pergunta 3: ...
### Pergunta 4: ...

## Nivel 2: Profundidade Media

### Pergunta 5: ...
{mesmo formato}
...

## Nivel 3: Profundidade Alta

### Pergunta 9: ...
{mesmo formato}
...

## Nivel 4: Paradoxos [CRITICO]

### Pergunta 12: {cenario que ativa trigger_a}
**Paradoxo testado:** {nome do paradoxo}
**Lado esperado:** A ({lado_a})

**Resposta do Agente:**
{resposta}

**Avaliacao:**
| Criterio | Score | Justificativa |
|----------|-------|---------------|
| ... | ... | ... |
| Paradoxos | {X}/100 | {O clone ativou o lado correto? Demonstrou nuance?} |

### Pergunta 13: {cenario que ativa trigger_b}
**Paradoxo testado:** {nome do paradoxo}
**Lado esperado:** B ({lado_b})
{mesmo formato}

### Pergunta 14: {cenario ambiguo}
**Paradoxo testado:** {nome do paradoxo}
**Esperado:** Navegacao da ambiguidade, mencao de ambos lados
{mesmo formato}

### Pergunta 15: {confronto direto com contradicao}
**Esperado:** Explicacao metacognitiva da contradicao
{mesmo formato}

## Score Final Detalhado

| Criterio | Media Geral | Peso Implicito |
|----------|-------------|----------------|
| Estilo | {X}% | - |
| Vocabulario | {X}% | - |
| Modelos Mentais | {X}% | - |
| Valores | {X}% | - |
| Autenticidade | {X}% | - |
| Paradoxos | {X}% | - |

## Gaps Identificados

{Se score < 95%:}
1. **{gap}:** {o que esta faltando, como corrigir, qual secao do prompt ajustar}
2. ...

## Recomendacao

{APROVADO: "Agente MMOS pronto para producao. Fidelidade: {score}%. Salvo em: {path}"}
{PARCIAL: "Iterar Fase 4 com foco em: {gaps}. Iteracao {N+1}/3"}
{FRACO: "Voltar a Fase 2 com mais fontes. Deficiencias criticas em: {camadas}"}
{REPROVADO: "Fontes insuficientes para clone MMOS. Considerar pipeline basico (/DUARTEOS:squad:clone-mind) ou fornecer mais material."}
```

7. Salvar em `data/minds/{slug}_validation.md`

8. **Iteracao se necessario:**
   - Se PARCIAL (85-94%) e iteracao < 3: ajustar Fase 4, rodar Fase 5 novamente
   - Se FRACO (70-84%): voltar a Fase 2, coletar mais fontes focando nas camadas deficientes
   - Se REPROVADO (< 70%): abortar pipeline com explicacao

9. **Apos aprovacao:** atualizar `stats.fidelidade` no DNA YAML (Fase 3 e Synapse)

---

## Resumo dos Artefatos

| Fase | Artefato | Caminho |
|------|----------|---------|
| 0 - Viabilidade | Avaliacao APEX/ICP | `data/minds/{slug}_viability.md` |
| 1 - Research | Squad scaffold | `squads/{slug}/` (21+ dirs + config.yaml) |
| 1 - Research | Fontes coletadas (20-30) | `data/minds/{slug}_sources.md` |
| 2 - Analysis | Extracao 6 camadas + extras | `data/minds/{slug}_analysis.md` |
| 3 - Synthesis | DNA YAML 6 camadas | `data/minds/{slug}_dna.yaml` |
| 3.5 - Synapse | DNA persistido no Synapse | `.claude/synapse/minds/{slug}.yaml` |
| 4 - Implementation | Agente .md (~10k palavras) | `.claude/commands/DUARTEOS/{Cat}/{slug}.md` |
| 5 - Validation | Relatorio 15 perguntas | `data/minds/{slug}_validation.md` |

## Regras Criticas

1. **Fase 0 evita desperdicio** — NUNCA pule a avaliacao de viabilidade. Se APEX < 28 E ICP < 5, aborte.
2. **Fase 1 determina tudo** — qualidade das fontes = qualidade do clone. Target: 20-30 fontes.
3. **NUNCA inventar informacao** — usar apenas fontes verificaveis com URLs ou source_path do inbox.
4. **Cada fase gera artefato ANTES de avancar** — sem excecao, sem pular fases.
5. **Paradoxos sao obrigatorios** — minimo 2, ideal 4-6. Cada um com >= 3 exemplos de fontes independentes.
6. **Triangulacao e lei** — Camadas 1-4: >= 3 fontes cada. Camadas 5-6: >= 5 fontes cada.
7. **Score < 95% -> iterar** — Fase 4 (max 3 iteracoes) ou Fase 2 (mais fontes).
8. **Paradoxos pesam 35%** — sao o diferencial do MMOS. Investir tempo neles.
9. **Prompt ~10k palavras** — extenso o suficiente para capturar nuance, nao tao longo que perca foco.
10. **Preservar contradicoes REAIS** — paradoxos nao sao bugs, sao features. Nao suavizar.

## Exemplos de Uso

### Pipeline completo (novo clone MMOS)
```
/DUARTEOS:mmos:mind-clone Naval Ravikant
/DUARTEOS:mmos:mind-clone Paul Graham
/DUARTEOS:mmos:mind-clone Nassim Taleb
/DUARTEOS:mmos:mind-clone Steve Jobs
/DUARTEOS:mmos:mind-clone "Flavio Augusto da Silva"
```

### Comparacao com clone-mind basico
```
# Clone basico (5 camadas, 5 perguntas, ~3k palavras)
/DUARTEOS:squad:clone-mind Naval Ravikant

# Clone MMOS (6 camadas, 15 perguntas, ~10k palavras)
/DUARTEOS:mmos:mind-clone Naval Ravikant
```

### Quando usar cada pipeline

| Criterio | clone-mind (basico) | MMOS mind-clone |
|----------|-------------------|-----------------|
| Camadas DNA | 5 | 6 (+ Paradoxos) |
| Perguntas validacao | 5 | 15 |
| Gate de viabilidade | Nao | Sim (APEX/ICP) |
| Triangulacao | Nao | Sim (minimo por camada) |
| Peso paradoxos | 0% | 35% |
| Prompt final | ~3k palavras | ~10k palavras |
| Tempo estimado | 15-30 min | 45-90 min |
| Ideal para | Clones rapidos, experts bem conhecidos | Clones de alta fidelidade, experts complexos |
| Fidelidade-alvo | >= 90% | >= 95% |
