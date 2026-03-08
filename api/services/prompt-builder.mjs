import yaml from 'js-yaml'

/**
 * Constroi o system prompt completo para um mind clone.
 *
 * Para MMOS v3: injeta todos os artefatos como YAML inline no prompt.
 * Para legacy: usa o agent.md puro.
 */
export function buildSystemPrompt(slug, mindLoader) {
  const agentMd = mindLoader.loadAgentMd(slug)

  if (!agentMd) {
    throw new Error(`agent.md nao encontrado para o clone '${slug}'.`)
  }

  const config = mindLoader.loadOne(slug)
  const isFullSquad = config.has_full_squad

  if (!isFullSquad) {
    // Clone legacy — usa agent.md puro sem transformacao
    return agentMd.trim()
  }

  // Clone MMOS v3 — remove secao Bootstrap e injeta artefatos inline
  const agentMdCleaned = removeBootstrapSection(agentMd)

  const artifacts = mindLoader.loadArtifacts(slug)
  const synapseDnaRaw = mindLoader.loadSynapseDna(slug)

  const parts = [agentMdCleaned.trim()]

  const hasArtifacts = Object.keys(artifacts).length > 0
  if (hasArtifacts) {
    parts.push('\n\n---\n\n## Squad Artifacts (Pre-Loaded)\n')

    for (const [key, value] of Object.entries(artifacts)) {
      if (!value || (Array.isArray(value) && value.length === 0)) continue
      const label = formatArtifactLabel(key)
      parts.push(`### ${label}\n\`\`\`yaml\n${yaml.dump(value, { lineWidth: 120 }).trim()}\n\`\`\`\n`)
    }
  }

  if (synapseDnaRaw) {
    parts.push(`\n### Synapse DNA\n\`\`\`yaml\n${synapseDnaRaw.trim()}\n\`\`\`\n`)
  }

  parts.push(
    `\n---\n\n**Instrucao de Operacao:** Responda SEMPRE como ${config.name}. Use seus frameworks, voz, paradoxos e exemplos especificos. Responda em portugues mantendo termos tecnicos em ingles quando apropriado. Nao quebre o personagem.`
  )

  return parts.join('\n')
}

/**
 * Remove a secao "## Bootstrap" do agent.md.
 * A secao vai ate o proximo ## heading ou ate o fim do arquivo.
 */
function removeBootstrapSection(md) {
  // Remove tudo entre "## Bootstrap" e o proximo "## " ou "---"
  return md
    .replace(/^## Bootstrap[\s\S]*?(?=^## |\n---|\z)/m, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function formatArtifactLabel(key) {
  const labels = {
    drivers: 'Drivers (Motivadores)',
    voice: 'Voice Profile',
    phrases: 'Phrases Assinatura',
    system_components: 'System Components',
    checklists: 'Quality Checklists',
    frameworks: 'Frameworks',
    behavioral: 'Behavioral Patterns',
    cognitive: 'Cognitive Architecture',
    linguistic: 'Linguistic Profile',
    narrative: 'Narrative & Storytelling',
  }
  return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
