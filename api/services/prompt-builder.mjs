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
  const estilometria = mindLoader.loadEstilometria(slug)
  const mius = mindLoader.loadMius(slug)
  const fidelityProfile = mindLoader.loadFidelityProfile(slug)
  const tasks = mindLoader.loadTasks(slug)

  const parts = [agentMdCleaned.trim()]

  // --- Squad Artifacts (drivers, voice, phrases, frameworks, behavioral, cognitive, linguistic, narrative) ---
  const hasArtifacts = Object.keys(artifacts).length > 0
  if (hasArtifacts) {
    parts.push('\n\n---\n\n## Squad Artifacts (Pre-Loaded)\n')

    for (const [key, value] of Object.entries(artifacts)) {
      if (!value || (Array.isArray(value) && value.length === 0)) continue
      const label = formatArtifactLabel(key)
      parts.push(`### ${label}\n\`\`\`yaml\n${yaml.dump(value, { lineWidth: 120 }).trim()}\n\`\`\`\n`)
    }
  }

  // --- Estilometria Computacional (calibracao precisa de linguagem) ---
  if (estilometria) {
    parts.push(`### Estilometria Computacional\n\`\`\`yaml\n${yaml.dump(estilometria, { lineWidth: 120 }).trim()}\n\`\`\`\n`)
  }

  // --- MIUs — Banco de Citacoes Reais ---
  if (mius) {
    parts.push(`### MIUs (Minimum Inference Units — Citacoes Reais)\n\`\`\`yaml\n${yaml.dump(mius, { lineWidth: 120 }).trim()}\n\`\`\`\n`)
  }

  // --- Perfil de Fidelidade ---
  if (fidelityProfile) {
    parts.push(`### Perfil de Fidelidade\n\`\`\`yaml\n${yaml.dump(fidelityProfile, { lineWidth: 120 }).trim()}\n\`\`\`\n`)
  }

  // --- Synapse DNA ---
  if (synapseDnaRaw) {
    parts.push(`\n### Synapse DNA\n\`\`\`yaml\n${synapseDnaRaw.trim()}\n\`\`\`\n`)
  }

  // --- Tasks (como o clone executa tarefas especificas do dominio) ---
  if (tasks.length > 0) {
    parts.push('\n---\n\n## Tasks Especializadas\n')
    for (const task of tasks) {
      if (task._format === 'markdown') {
        parts.push(`### ${task._file.replace(/\.md$/, '')}\n${task.content.trim()}\n`)
      } else {
        const { _file, _format, ...taskData } = task
        parts.push(`### ${_file.replace(/\.yaml$/, '')}\n\`\`\`yaml\n${yaml.dump(taskData, { lineWidth: 120 }).trim()}\n\`\`\`\n`)
      }
    }
  }

  parts.push(
    `\n---\n\n**Instrucao de Operacao:** Responda SEMPRE como ${config.name}. Use seus frameworks, voz, paradoxos e exemplos especificos. Calibre sua linguagem pela estilometria e use as MIUs como banco de citacoes reais. Responda em portugues mantendo termos tecnicos em ingles quando apropriado. Nao quebre o personagem.`
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
    estilometria: 'Estilometria Computacional',
    mius: 'MIUs (Citacoes Reais)',
    fidelity_profile: 'Perfil de Fidelidade',
    tasks: 'Tasks Especializadas',
  }
  return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
