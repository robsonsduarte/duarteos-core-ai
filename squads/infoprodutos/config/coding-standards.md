# Padroes de Producao de Conteudo — Squad Infoprodutos

## Tom de Voz

- **Profissional:** autoridade sem arrogancia, demonstra dominio do assunto
- **Acessivel:** linguagem clara, evita jargao desnecessario, explica termos tecnicos
- **Acionavel:** todo conteudo direciona para acao pratica, nao apenas teoria
- **Empatico:** reconhece dores e desafios do leitor antes de oferecer solucao
- **Brasileiro:** portugues BR natural, sem portugalismos, sem anglicismos desnecessarios

### Regras de Tom

1. Usar segunda pessoa informal ("voce") — nunca "tu" ou "o senhor"
2. Preferir voz ativa sobre passiva
3. Frases curtas (max 25 palavras por frase como regra geral)
4. Paragrafos curtos (max 4-5 linhas)
5. Usar analogias do cotidiano para explicar conceitos abstratos
6. Evitar superlativos vazios ("o melhor", "incrivel", "revolucionario")
7. Sustentar afirmacoes com dados, exemplos ou referencias

## Estrutura de Capitulos

Cada capitulo segue a estrutura HCER (Hook, Conteudo, Exercicio, Resumo):

### 1. Hook de Abertura (5-10% do capitulo)

- Pergunta provocativa, estatistica impactante ou historia curta
- Conecta com uma dor/desejo do avatar
- Cria curiosidade para continuar lendo
- Maximo 1 pagina

### 2. Conteudo Principal (70-75% do capitulo)

- Dividido em 3-5 secoes com subtitulos claros
- Cada secao tem: conceito + exemplo + aplicacao
- Usar listas, bullet points e destaques visuais para escaneabilidade
- Incluir pelo menos 1 framework/modelo por capitulo
- Intercalar teoria com casos praticos
- Transicoes claras entre secoes

### 3. Exercicio/Acao (10-15% do capitulo)

- Exercicio pratico que aplica o conteudo ensinado
- Instrucoes passo a passo (numeradas)
- Resultado esperado descrito claramente
- Nivel de dificuldade adequado ao publico

### 4. Resumo do Capitulo (5-10% do capitulo)

- 3-5 pontos-chave em bullet points
- Frase de transicao para o proximo capitulo (bridge)
- Opcional: checklist de acao rapida

## Formatacao Markdown

### Hierarquia de Titulos

```markdown
# Titulo do Capitulo (H1 — apenas 1 por capitulo)
## Secao Principal (H2 — 3-5 por capitulo)
### Subsecao (H3 — quando necessario)
```

### Elementos Visuais

```markdown
> **Destaque:** Para insights importantes ou citacoes de autoridade

**Negrito** para termos-chave na primeira aparicao

*Italico* para enfase leve ou termos estrangeiros

---  (separador entre secoes maiores)

- Listas nao ordenadas para itens sem sequencia
1. Listas ordenadas para passos sequenciais

| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Dados    | Dados    | Dados    |
```

### Blocos Especiais

```markdown
> **Exemplo Pratico:** [descricao do exemplo]

> **Armadilha Comum:** [erro frequente a evitar]

> **Dica Pro:** [insight avancado para leitores mais experientes]

> **Exercicio:** [instrucao para praticar]
```

## Regras de Citacao e Referencia

1. Citar fonte quando usar dados, estatisticas ou pesquisas
2. Formato: "Segundo [Autor/Fonte], [afirmacao]" ou nota de rodape
3. Preferir fontes dos ultimos 5 anos (exceto classicos atemporais)
4. Mind Clones podem ser citados como especialistas consultados
5. Nunca inventar dados ou estatisticas — usar "estudos indicam" quando nao tiver fonte exata
6. Referencias compiladas no final do ebook

## Padrao de Nomenclatura de Arquivos

```
squads/infoprodutos/output/
  {pipeline_id}/
    phase-1-discovery/
      niche-scorecard.json
      niche-scorecard.md
    phase-2-research/
      market-dossie.json
      market-dossie.md
      avatar-profile.json
      avatar-profile.md
    phase-3-strategy/
      commercial-strategy.json
      commercial-strategy.md
    phase-4-architecture/
      ebook-outline.json
      ebook-outline.md
    phase-5-production/
      chapter-01.md
      chapter-02.md
      ...
      chapter-{nn}.md
      full-manuscript.md
    phase-6-design/
      design-system.json
      cover-spec.json
      ebook-final.html
      ebook-final.pdf
```

### Convencoes

- Diretorios em kebab-case
- Arquivos em kebab-case
- Capitulos com numero zero-padded (01, 02, ..., 99)
- Artefatos estruturados em .json (API-ready)
- Artefatos legíveis em .md (para humanos)
- Todo artefato .json tem um .md correspondente para leitura

## Metricas de Qualidade de Conteudo

| Metrica | Minimo | Ideal |
|---------|--------|-------|
| Palavras por capitulo | 2.000 | 3.000-4.000 |
| Palavras total ebook | 15.000 | 25.000-35.000 |
| Exemplos por capitulo | 2 | 3-5 |
| Exercicios por capitulo | 1 | 1-2 |
| Flesch-Kincaid (adaptado PT-BR) | 50 | 60-70 |
| Paragrafos > 5 linhas | < 10% | 0% |
| Secoes sem subtitulo > 500 palavras | 0 | 0 |
