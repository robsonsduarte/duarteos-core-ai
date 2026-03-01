# Squad: DNA Mental — Clone de Especialista

Crie um agente baseado na mente de um especialista real atraves de um pipeline de 5 fases.

**Modo:** Pipeline sequencial — cada fase gera artefato antes de avancar
**Nivel:** Avancado — requer ferramentas de busca (WebSearch, WebFetch)

## Argumentos

$ARGUMENTS — nome do especialista a clonar (obrigatorio)

Se $ARGUMENTS estiver vazio, pergunte: "Qual especialista voce quer clonar? (nome completo)"

## Modos de Operacao

### Modo Criacao (padrao)
```
/DUARTEOS:squad:clone-mind Naval Ravikant
```
Pipeline completo: Research → Analysis → Synthesis → Synapse Sync → Implementation → Validation

### Modo Incremental (expert existente + nova fonte)
```
/DUARTEOS:squad:clone-mind --update "Naval Ravikant" https://youtube.com/watch?v=xxx
/DUARTEOS:squad:clone-mind --update "Naval Ravikant" /path/to/transcript.pdf
/DUARTEOS:squad:clone-mind --update "Naval Ravikant" "texto bruto aqui..."
```
Pipeline parcial: Ingestao → Analysis (delta) → Synapse Merge → Update clone file
- Le o DNA existente de `.claude/synapse/minds/{nome}.yaml`
- Processa APENAS a nova fonte
- Faz MERGE incremental das 5 camadas (adiciona, nunca remove)
- Atualiza o clone `.md` com novos insights
- Incrementa versao do DNA

### Modo Dossie (alimentar dossie tematico)
```
/DUARTEOS:squad:clone-mind --dossier "trafego pago" https://youtube.com/watch?v=xxx
```
Extrai insights da fonte e adiciona ao dossie tematico em `.claude/synapse/dossiers/`

## Descricao

Este e o comando mais poderoso de criacao de agentes do DuarteOS. Em vez de criar um agente generico, ele pesquisa profundamente um especialista real — livros, entrevistas, palestras, artigos, podcasts — e extrai seus modelos mentais, estilo de comunicacao, valores e padroes de decisao para criar um agente que pensa e responde como essa pessoa.

Qualidade do clone depende DIRETAMENTE da qualidade das fontes coletadas na Fase 1.

## As 5 Camadas do DNA Mental

Todo mind clone gerado por este comando possui DNA estruturado em 5 camadas cognitivas:

| Camada | O que captura | Pergunta-chave |
|--------|-------------|----------------|
| **Filosofia** | Crencas fundamentais, visao de mundo, principios inegociaveis | "O que esta pessoa acredita ser verdade?" |
| **Frameworks** | Passos-a-passo, modelos de pensamento estruturados | "Como esta pessoa organiza e estrutura problemas?" |
| **Heuristicas** | Atalhos mentais, regras de bolso, padroes de decisao rapida | "Que atalhos mentais usa para decidir rapido?" |
| **Metodologias** | Processos repetiveis, sistemas formais, ferramentas | "Que sistemas formais segue consistentemente?" |
| **Dilemas** | Trade-offs, tensoes reconhecidas, zonas cinza, evolucao de posicoes | "Como lida com contradicoes e decisoes impossiveis?" |

Essas 5 camadas sao extraidas na Fase 2, estruturadas na Fase 3 (como YAML no Synapse), e transformadas em prompt na Fase 4.

## Canonicalizacao de Entidades

Antes de criar ou atualizar um mind clone, o nome do especialista DEVE ser canonicalizado.

### Regras de Canonicalizacao

1. **Normalizar nome:** remover acentos, lowercase, hifens entre palavras
   - "Alex Hormozi" → `alex-hormozi`
   - "Naval Ravikant" → `naval-ravikant`
   - "Thiago Finch" → `thiago-finch`

2. **Resolver variacoes:** diferentes formas do mesmo nome resolvem para o mesmo slug
   - "Hormozi", "Alex Hormozi", "Alex H." → `alex-hormozi`
   - "Naval", "Naval Ravikant", "NavalR" → `naval-ravikant`
   - "Dr. Drauzio", "Drauzio Varella" → `drauzio-varella`

3. **Deteccao por contexto:** se o nome nao e reconhecido diretamente
   - Verificar se existe mind clone com nome similar em `.claude/synapse/minds/*.yaml`
   - Verificar aliases conhecidos (ex: "MrBeast" = "Jimmy Donaldson")
   - Se ambiguo: perguntar ao usuario

4. **Nome canonico = slug do arquivo:**
   - Mind clone: `.claude/synapse/minds/{slug}.yaml`
   - Comando: `.claude/commands/DUARTEOS/{Categoria}/{slug}.md`
   - Inbox: `inbox/{slug}/`

5. **Regra critica:** NUNCA criar dois mind clones para a mesma pessoa
   - Antes de criar, SEMPRE verificar se ja existe com `Glob` em `synapse/minds/*.yaml`
   - Se existir, usar modo `--update` em vez de criacao

## Pipeline de 5 Fases

---

### FASE 1: RESEARCH (Coleta de Fontes)

**Objetivo:** Coletar material de alta qualidade sobre o especialista.
**Artefato:** `data/minds/{nome-normalizado}_sources.md`

#### Procedimento

1. Normalize o nome do especialista: lowercase, sem acentos, hifens (ex: "Naval Ravikant" → "naval-ravikant")

2. Crie o diretorio `data/minds/` se nao existir

3. Execute buscas sistematicas usando WebSearch e WebFetch:

   **Categoria: Obras e Publicacoes**
   - Buscar: "{nome} livro publicado", "{nome} book author"
   - Buscar: "{nome} artigo publicado", "{nome} blog post", "{nome} newsletter"
   - Buscar: "{nome} framework", "{nome} methodology"
   - Para cada resultado relevante: extrair titulo, ano, resumo das ideias principais

   **Categoria: Entrevistas e Palestras**
   - Buscar: "{nome} entrevista", "{nome} interview", "{nome} podcast"
   - Buscar: "{nome} palestra", "{nome} talk", "{nome} keynote"
   - Buscar: "{nome} TED talk", "{nome} conference"
   - Para cada resultado: extrair citacoes diretas, posicionamentos, opinioes

   **Categoria: Pensamento e Filosofia**
   - Buscar: "{nome} filosofia", "{nome} philosophy", "{nome} principles"
   - Buscar: "{nome} conselho", "{nome} advice", "{nome} lessons learned"
   - Buscar: "{nome} decisao controversa", "{nome} contrarian opinion"
   - Buscar: "{nome} mental model", "{nome} framework decisao"

   **Categoria: Comunicacao e Estilo**
   - Buscar: "{nome} twitter/X quotes", "{nome} frases celebres"
   - Buscar: "{nome} estilo comunicacao", "{nome} writing style"
   - Se encontrar perfis publicos: analisar tom, vocabulario, padroes

4. Compilar fontes em formato estruturado:

```markdown
# Fontes: {Nome do Especialista}
Data da coleta: {data}
Total de fontes: {N}
Qualidade estimada: {alta/media/baixa}

## Obras e Publicacoes
1. **{Titulo}** ({ano}) — {resumo das ideias principais}
   Fonte: {URL}
   Citacoes relevantes:
   - "{citacao 1}"
   - "{citacao 2}"

2. ...

## Entrevistas e Palestras
1. **{Titulo}** ({ano}, {veiculo}) — {resumo}
   Fonte: {URL}
   Citacoes relevantes:
   - "{citacao 1}"

2. ...

## Pensamento e Filosofia
1. **{Conceito/Principio}** — {descricao}
   Fonte: {URL}
   Contexto: {como ele chegou nessa conclusao}

2. ...

## Comunicacao e Estilo
- Tom predominante: {ex: direto, provocativo, academico, humilde}
- Palavras/frases recorrentes: [lista]
- Metaforas favoritas: [lista]
- Como abre uma conversa: {padrao}
- Como encerra um argumento: {padrao}
```

5. **Validacao da Fase 1:**
   - MINIMO 10 fontes de qualidade (URLs verificaveis)
   - Pelo menos 2 categorias com 3+ fontes cada
   - Se encontrar MENOS de 5 fontes:
     - Avisar o usuario: "Encontrei apenas {N} fontes sobre {nome}. Para um clone de alta qualidade, preciso de mais material."
     - Perguntar: "Voce tem URLs, documentos ou transcricoes que posso analisar?"
     - Se o usuario fornecer material adicional, incorporar e continuar
     - Se nao fornecer, avisar que a qualidade do clone sera limitada

6. Salvar em `data/minds/{nome-normalizado}_sources.md`

**NAO avance para Fase 2 sem o artefato salvo e validado.**

---

### FASE 2: ANALYSIS (Extracao de Padroes)

**Objetivo:** Extrair padroes cognitivos, decisorios e comunicativos do especialista.
**Artefato:** `data/minds/{nome-normalizado}_analysis.md`
**Dependencia:** Fase 1 concluida

#### Procedimento

1. Leia `data/minds/{nome-normalizado}_sources.md` integralmente

2. Analise cada fonte e extraia padroes nas seguintes dimensoes:

   **Modelos Mentais**
   - Quais frameworks ele usa para pensar?
   - Como ele estrutura problemas complexos?
   - Quais analogias/metaforas usa repetidamente?
   - Qual seu modelo de mundo? (otimista/pessimista, sistemico/linear, etc.)

   **Processo Decisorio**
   - Como ele toma decisoes? (dados vs intuicao, rapido vs deliberado)
   - Quais criterios usa para avaliar opcoes?
   - Como lida com incerteza?
   - Quais heuristicas aplica? (regra 80/20, inversao, first principles, etc.)

   **Valores e Prioridades**
   - O que ele prioriza consistentemente?
   - O que ele evita ou rejeita?
   - Quais trade-offs ele faz sem hesitar?
   - Quais sao suas "linhas vermelhas"?

   **Estilo de Comunicacao**
   - Como ele explica conceitos complexos? (analogia, exemplo, historia, dados)
   - Qual o tamanho tipico de suas respostas? (conciso vs elaborado)
   - Usa humor? Que tipo?
   - Como ele discorda de alguem?
   - Como ele admite que nao sabe algo?

   **Vocabulario e Linguagem**
   - Termos tecnicos recorrentes
   - Expressoes e jargoes proprios
   - Frases de efeito/assinatura
   - Idioma primario de expressao

   **Contradicoes e Evolucao**
   - Posicoes que mudou ao longo do tempo
   - Contradicoes aparentes em seu pensamento
   - Como ele reconcilia contradicoes
   - Evolucao visivel de ideias

   **Filosofia (Camada 1)**
   - Quais sao suas crencas fundamentais sobre o mundo/mercado/vida?
   - Que principios ele NUNCA viola, mesmo sob pressao?
   - Qual sua visao de mundo? (otimista/pragmatico/cetico/idealista)

   **Heuristicas (Camada 3)**
   - Que regras de bolso usa para decisoes rapidas?
   - Quais "red flags" fazem ele parar imediatamente?
   - Que vieses ele reconhece ter conscientemente?

   **Metodologias (Camada 4)**
   - Que processos repetiveis e documentados ele segue?
   - Quais ferramentas/tecnicas sempre recomenda?
   - Que sistemas formais estruturam seu trabalho?

   **Dilemas (Camada 5)**
   - Que trade-offs tipicos ele enfrenta e como resolve?
   - Em que areas admite nao ter resposta definitiva?
   - Que posicoes mudou ao longo do tempo e por que?

3. Compilar analise:

```markdown
# Analise: {Nome do Especialista}
Data da analise: {data}
Fontes analisadas: {N}

## Modelos Mentais
### Modelo Principal: {nome do modelo}
{descricao detalhada de como ele pensa}

### Outros Modelos
- {modelo}: {como aplica}
- ...

## Processo Decisorio
### Como Decide
{descricao do processo}

### Criterios Recorrentes
1. {criterio}
2. ...

### Heuristicas
- {heuristrica}: {quando usa}
- ...

## Valores e Prioridades
### Valores Core
1. {valor} — evidencia: {fonte/citacao}
2. ...

### O Que Evita
- {coisa} — motivo: {por que}
- ...

## Estilo de Comunicacao
### Padrao Geral
{descricao do estilo}

### Padroes Especificos
- Ao explicar: {padrao}
- Ao discordar: {padrao}
- Ao nao saber: {padrao}
- Ao convencer: {padrao}

## Vocabulario Caracteristico
### Termos Assinatura
- "{termo/frase}" — contexto: {quando usa}
- ...

### Tom Predominante
{descricao do tom}

## Contradicoes e Evolucao
### Mudancas de Posicao
- {posicao antiga} → {posicao nova} — motivo: {por que mudou}
- ...

### Pontos Cegos Identificados
- {limitacao} — evidencia: {fonte}
- ...
```

4. Salvar em `data/minds/{nome-normalizado}_analysis.md`

**NAO avance para Fase 3 sem o artefato salvo.**

---

### FASE 3: SYNTHESIS (DNA Estruturado)

**Objetivo:** Sintetizar a analise em DNA Mental estruturado em YAML.
**Artefato:** `data/minds/{nome-normalizado}_dna.yaml`
**Dependencia:** Fase 2 concluida

#### Procedimento

1. Leia `data/minds/{nome-normalizado}_analysis.md` integralmente

2. Sintetize em formato YAML estruturado:

```yaml
# DNA Mental: {Nome do Especialista}
# Synapse Mind Clone — Memoria Incremental
# Gerado em: {data}
# Fontes processadas: {N}
# Confianca: {alta/media/baixa}

identity:
  name: "{Nome Completo}"
  slug: "{nome-normalizado}"
  domain: "{Dominio}"
  archetype: "{Arquetipo}"

filosofia:
  crencas_core:
    - belief: "{crenca}"
      evidencia: "{fonte}"
  visao_de_mundo: "{descricao}"
  principios_inegociaveis:
    - "{principio}"

frameworks:
  primarios:
    - name: "{framework}"
      steps: ["{passo 1}", "{passo 2}"]
      quando_usar: "{situacao}"
  modelo_decisao: "{descricao}"

heuristicas:
  regras_rapidas:
    - trigger: "{quando}"
      acao: "{faz}"
  red_flags:
    - "{sinal de alerta}"

metodologias:
  processos:
    - name: "{processo}"
      etapas: ["{etapa 1}", "{etapa 2}"]
  ferramentas_preferidas:
    - "{ferramenta}"

dilemas:
  tradeoffs_tipicos:
    - tensao: "{X vs Y}"
      posicao: "{como resolve}"
  evolucao:
    - de: "{antes}"
      para: "{depois}"
      motivo: "{por que}"

communication:
  style: "{estilo}"
  tone: "{tom}"
  vocabulary:
    signature_phrases: ["{frase}"]
    technical_terms:
      - "{termo}"
    avoided_words:
      - "{palavra/expressao que nunca usa}"
  patterns:
    explaining: "{Como explica conceitos}"
    disagreeing: "{Como discorda}"
    admitting_ignorance: "{Como admite nao saber}"
    persuading: "{Como convence}"
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
  when_confident: "{Como age quando tem certeza}"
  when_uncertain: "{Como age quando nao tem certeza}"
  under_pressure: "{Como age sob pressao}"
  when_wrong: "{Como reage ao estar errado}"
  when_teaching: "{Como ensina/mentora}"

ingestion_log:
  - date: "{data}"
    source: "{tipo}"
    title: "{titulo}"

stats:
  total_fontes: "{N}"
  versao_dna: 1
  confianca_geral: "{nivel}"
```

3. Revisar o YAML:
   - Cada campo deve ser preenchido com base em EVIDENCIA da analise
   - Campos sem evidencia suficiente: preencher com `"[dados insuficientes]"` em vez de inventar
   - O YAML deve ser parseable (sem erros de sintaxe)

4. Salvar em `data/minds/{nome-normalizado}_dna.yaml`

**NAO avance para Fase 3.5 sem o artefato salvo.**

---

### FASE 3.5: SYNAPSE SYNC (Salvar DNA Incremental)

**Objetivo:** Persistir o DNA no Synapse para memoria incremental.
**Artefato:** `.claude/synapse/minds/{nome-normalizado}.yaml`
**Dependencia:** Fase 3 concluida

#### Procedimento

1. Verifique se `.claude/synapse/minds/` existe (crie com mkdir -p se nao existir)

2. Verifique se ja existe um DNA para este expert:
   - Se `.claude/synapse/minds/{nome-normalizado}.yaml` ja existe:
     - LEIA o DNA existente
     - MERGE incremental: adicione novas crencas, frameworks, heuristicas SEM remover as existentes
     - Incremente `stats.versao_dna`
     - Adicione entrada no `ingestion_log`
     - Atualize `stats.ultima_atualizacao`
   - Se NAO existe:
     - Copie o YAML da Fase 3 diretamente
     - Defina `stats.versao_dna: 1`

3. Atualize o indice `.claude/synapse/minds/_index.yaml`:
   ```yaml
   # Indice de Mind Clones — Synapse
   # Auto-gerado pelo clone-mind

   minds:
     - slug: "{nome}"
       name: "{Nome Completo}"
       domain: "{dominio}"
       versao_dna: "{N}"
       ultima_atualizacao: "{data}"
       confianca: "{nivel}"
       clone_file: ".claude/commands/DUARTEOS/{Categoria}/{nome}.md"
   ```

4. Salve e confirme: "DNA sincronizado com Synapse (versao {N})"

**NAO avance para Fase 4 sem o DNA salvo no Synapse.**

---

### FASE 4: IMPLEMENTATION (Gerar Agente)

**Objetivo:** Transformar o DNA em um agente funcional do DuarteOS.
**Artefato:** `.claude/commands/DUARTEOS/{Categoria}/{nome-normalizado}.md`
**Dependencia:** Fase 3.5 concluida

#### Procedimento

1. Leia `data/minds/{nome-normalizado}_dna.yaml`

2. Gere o arquivo do agente no formato padrao do DuarteOS:

```markdown
---
name: "{nome-normalizado}"
description: "Agente baseado na mente de {Nome Completo} — {archetype}"
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
source_dna: "data/minds/{nome-normalizado}_dna.yaml"
created_at: "{data}"
confidence: "{alta/media/baixa}"
---

# {Nome Completo} — Mind Clone

Voce e um agente que pensa, decide e comunica como {Nome Completo}.

## Quem Voce E

{Paragrafo baseado em identity + archetype. Descreva a essencia da pessoa em 3-4 frases. Use o tom da propria pessoa.}

## Como Voce Pensa

{Baseado em mental_models. Descreva os modelos mentais primarios, como resolve problemas, como estrutura pensamento. Use exemplos especificos.}

### Modelos Mentais
{Lista dos modelos primarios com descricao de quando e como usar cada um.}

### Processo Decisorio
{Baseado em decision_framework. Descreva passo a passo como a pessoa decide.}

## Como Voce Comunica

{Baseado em communication. Descreva o estilo, tom, padrao de respostas.}

### Regras de Comunicacao
1. {Regra derivada do estilo — ex: "Sempre use analogias para explicar conceitos abstratos"}
2. {Regra derivada do tom — ex: "Seja direto, nunca use linguagem corporativa"}
3. {Regra derivada do vocabulario — ex: "Use os termos: {lista}"}
4. {Regra derivada dos padroes — ex: "Ao discordar, primeiro reconheca o ponto do outro"}
5. {Regra derivada do response_length}

### Vocabulario Obrigatorio
Frases e termos que voce DEVE usar naturalmente:
{Lista de signature_phrases e technical_terms}

### Vocabulario Proibido
Nunca use:
{Lista de avoided_words}

## O Que Voce Valoriza

{Baseado em values. Liste os valores core e como eles se manifestam em decisoes praticas.}

### Prioridades
{priorities}

### O Que Voce Evita
{avoids}

### Linhas Vermelhas
{Lista de red_lines — coisas que o agente NUNCA faz}

## Sua Expertise

### Dominio Profundo
{Lista de areas deep com descricao do nivel de conhecimento}

### Conhecimento Amplo
{Lista de areas broad}

### Limitacoes (Honestas)
{Lista de blind_spots — o agente deve reconhecer essas limitacoes quando questionado}

## Comportamento Situacional

- **Quando tem certeza:** {when_confident}
- **Quando tem duvida:** {when_uncertain}
- **Sob pressao:** {under_pressure}
- **Quando erra:** {when_wrong}
- **Quando ensina:** {when_teaching}

## Regras Finais

1. Nunca invente informacao que {Nome} nao diria — prefira dizer "nao sei" no estilo dele
2. Mantenha consistencia com os modelos mentais listados acima
3. Use o vocabulario obrigatorio naturalmente, nao forcado
4. Reconheca limitacoes quando questionado fora do dominio de expertise
5. Evolua — se o usuario fornecer novas informacoes sobre {Nome}, integre ao seu modelo mental
```

3. Se o usuario especificou um squad, salve em `squads/{squad}/agents/{nome-normalizado}.md`
4. Caso contrario, salve em `agents/{nome-normalizado}.md` (diretorio global de agentes)
5. Em ambos os casos, crie tambem o diretorio se nao existir

**NAO avance para Fase 5 sem o artefato salvo.**

---

### FASE 5: VALIDATION (Verificar Fidelidade)

**Objetivo:** Validar que o agente captura fielmente a essencia do especialista.
**Artefato:** `data/minds/{nome-normalizado}_validation.md`
**Dependencia:** Fase 4 concluida

#### Procedimento

1. Leia o agente gerado na Fase 4
2. Leia o DNA da Fase 3 para referencia

3. Crie 5 perguntas-teste que o especialista responderia de forma caracteristica:

   - **Pergunta 1 (Dominio Core):** Pergunta tecnica direta sobre sua area de expertise principal
   - **Pergunta 2 (Decisao):** Cenario que exige decisao com trade-offs
   - **Pergunta 3 (Contrarian):** Pergunta que testa uma opiniao controversa/contrarian do especialista
   - **Pergunta 4 (Comunicacao):** Pedido para explicar algo complexo (testa estilo de explicacao)
   - **Pergunta 5 (Fora do Dominio):** Pergunta fora da expertise (testa como o agente lida com limitacoes)

4. Para cada pergunta, gere a resposta como o agente faria (usando o system prompt do agente)

5. Avalie cada resposta em 5 criterios (0-100):

   | Criterio | O Que Avalia | Peso |
   |----------|-------------|------|
   | Estilo | Tom, extensao, estrutura da resposta | 20% |
   | Vocabulario | Usa termos/frases caracteristicos | 20% |
   | Modelos Mentais | Aplica os frameworks corretos | 25% |
   | Valores | Prioridades e evitacoes consistentes | 20% |
   | Autenticidade | "Soa como a pessoa real?" | 15% |

6. Calcular score final (media ponderada):
   - >= 90%: APROVADO — agente pronto para uso
   - 70-89%: PARCIAL — identificar gaps e iterar Fase 4
   - < 70%: REPROVADO — voltar para Fase 2 com mais fontes

7. Compilar validacao:

```markdown
# Validacao: {Nome do Especialista}
Data: {data}
Score Final: {score}%
Status: {APROVADO/PARCIAL/REPROVADO}
Iteracao: {1/2/3}

## Perguntas e Respostas

### Pergunta 1: {pergunta} (Dominio Core)
**Resposta do Agente:**
{resposta}

**Avaliacao:**
- Estilo: {score}/100 — {justificativa}
- Vocabulario: {score}/100 — {justificativa}
- Modelos Mentais: {score}/100 — {justificativa}
- Valores: {score}/100 — {justificativa}
- Autenticidade: {score}/100 — {justificativa}
- **Subtotal: {score ponderado}%**

### Pergunta 2: ...
(mesmo formato)

### Pergunta 3: ...
### Pergunta 4: ...
### Pergunta 5: ...

## Score Final

| Criterio | Media | Peso | Ponderado |
|----------|-------|------|-----------|
| Estilo | {X} | 20% | {Y} |
| Vocabulario | {X} | 20% | {Y} |
| Modelos Mentais | {X} | 25% | {Y} |
| Valores | {X} | 20% | {Y} |
| Autenticidade | {X} | 15% | {Y} |
| **TOTAL** | | | **{score}%** |

## Gaps Identificados
{Se score < 90%, liste o que precisa melhorar}
- {gap 1}: {o que esta faltando e como corrigir}
- ...

## Recomendacao
{APROVADO: "Agente pronto para uso em: agents/{nome}.md"}
{PARCIAL: "Iterar Fase 4 com foco em: {gaps}. Iteracao {N+1}/3"}
{REPROVADO: "Fontes insuficientes. Voltar a Fase 1/2 com mais material."}
```

8. Salvar em `data/minds/{nome-normalizado}_validation.md`

9. **Se score < 90% e iteracao < 3:**
   - Identifique os gaps especificos
   - Volte a Fase 4 e ajuste o system prompt do agente para corrigir os gaps
   - Rode Fase 5 novamente (nova iteracao)
   - Maximo 3 iteracoes

10. **Se score < 90% apos 3 iteracoes:**
    - Salve o melhor resultado
    - Informe: "Agente criado com score {X}%. Considere fornecer mais fontes para melhorar a fidelidade."

---

## Resumo dos Artefatos

| Fase | Artefato | Caminho |
|------|----------|---------|
| 1 - Research | Fontes coletadas | `data/minds/{nome}_sources.md` |
| 2 - Analysis | Padroes extraidos (5 camadas) | `data/minds/{nome}_analysis.md` |
| 3 - Synthesis | DNA estruturado (YAML 5 camadas) | `data/minds/{nome}_dna.yaml` |
| 3.5 - Synapse Sync | DNA persistido no Synapse | `.claude/synapse/minds/{nome}.yaml` |
| 4 - Implementation | Agente funcional | `.claude/commands/DUARTEOS/{Cat}/{nome}.md` |
| 5 - Validation | Relatorio de fidelidade | `data/minds/{nome}_validation.md` |

## Regras Criticas

1. **Fase 1 e a mais importante** — qualidade das fontes determina tudo
2. **NUNCA inventar informacao** — usar apenas fontes verificaveis com URLs
3. **Se nao encontrar fontes suficientes (< 5):** avisar o usuario e pedir URLs/documentos antes de continuar
4. **Cada fase gera um artefato ANTES de avancar** — sem excecao
5. **Score < 90% → iterar Fase 4** (maximo 3 iteracoes)
6. **O agente deve ser UTIL, nao um novelty** — ele deve agregar valor real em decisoes, analises e comunicacao
7. **Preservar contradicoes reais** — pessoas reais sao contraditorias, nao suavizar isso
8. **Admitir limitacoes do clone** — se os dados sao insuficientes em alguma area, o agente deve saber disso

## Exemplos

### Criacao (pipeline completo)
```
/DUARTEOS:squad:clone-mind Naval Ravikant
/DUARTEOS:squad:clone-mind Paul Graham
/DUARTEOS:squad:clone-mind Nassim Taleb
/DUARTEOS:squad:clone-mind Steve Jobs
/DUARTEOS:squad:clone-mind "Flavio Augusto da Silva"
```

### Incremental (adicionar nova fonte a expert existente)
```
/DUARTEOS:squad:clone-mind --update "Naval Ravikant" https://youtube.com/watch?v=abc123
/DUARTEOS:squad:clone-mind --update "Paul Graham" /docs/pg-essay-transcript.pdf
/DUARTEOS:squad:clone-mind --update "Nassim Taleb" "Trecho de entrevista recente..."
```

### Dossie (alimentar dossie tematico)
```
/DUARTEOS:squad:clone-mind --dossier "trafego pago" https://youtube.com/watch?v=xyz
/DUARTEOS:squad:clone-mind --dossier "copywriting" /docs/swipe-file.pdf
```
