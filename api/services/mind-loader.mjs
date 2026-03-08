import { readFileSync, readdirSync, existsSync, statSync } from 'fs'
import { resolve, join } from 'path'
import yaml from 'js-yaml'

/**
 * MindLoader — carrega dados dos mind clones do filesystem com cache em memoria.
 */
export class MindLoader {
  #mindsPath
  #synapsePath
  #cache = new Map()

  constructor(basePath) {
    this.#mindsPath = resolve(basePath, 'DUARTEOS', 'minds')
    this.#synapsePath = resolve(basePath, '.claude', 'synapse', 'minds')
  }

  /**
   * Retorna lista de todos os slugs de clones disponveis.
   */
  listSlugs() {
    return readdirSync(this.#mindsPath).filter((entry) => {
      const full = join(this.#mindsPath, entry)
      return statSync(full).isDirectory()
    })
  }

  /**
   * Carrega metadados de todos os clones. Usa cache.
   */
  loadAll() {
    const slugs = this.listSlugs()
    return slugs
      .map((slug) => {
        try {
          return this.#loadConfig(slug)
        } catch {
          return null
        }
      })
      .filter(Boolean)
  }

  /**
   * Carrega config.yaml de um clone especifico.
   * Lanca erro se o clone nao existe.
   */
  loadOne(slug) {
    const config = this.#loadConfig(slug)
    if (!config) {
      const err = new Error(`Mind clone '${slug}' nao encontrado.`)
      err.status = 404
      err.code = 'MIND_NOT_FOUND'
      throw err
    }

    const mindDir = join(this.#mindsPath, slug)
    const artifactsAvailable = this.#detectArtifacts(slug, mindDir)
    const hasFullSquad = this.#isFullSquad(mindDir)

    return { ...config, artifacts_available: artifactsAvailable, has_full_squad: hasFullSquad }
  }

  /**
   * Carrega TODOS os artefatos YAML de um clone MMOS v3.
   * Para clones legacy retorna apenas o que existir.
   */
  loadArtifacts(slug) {
    const mindDir = join(this.#mindsPath, slug)
    if (!existsSync(mindDir)) {
      const err = new Error(`Mind clone '${slug}' nao encontrado.`)
      err.status = 404
      err.code = 'MIND_NOT_FOUND'
      throw err
    }

    const artifacts = {}

    artifacts.drivers = this.#loadYamlSingle(mindDir, `drivers/${slug}-drivers.yaml`)
    artifacts.voice = this.#loadYamlSingle(mindDir, `voice/${slug}-voice.yaml`)
    artifacts.phrases = this.#loadYamlSingle(mindDir, `phrases/${slug}-phrases.yaml`)
    artifacts.system_components = this.#loadYamlSingle(mindDir, `system-components/${slug}-system.yaml`)
    artifacts.checklists = this.#loadYamlSingle(mindDir, `checklists/${slug}-checklist.yaml`)

    artifacts.frameworks = this.#loadYamlDir(mindDir, `frameworks/${slug}`)
    artifacts.behavioral = this.#loadYamlDir(mindDir, 'artifacts/behavioral')
    artifacts.cognitive = this.#loadYamlDir(mindDir, 'artifacts/cognitive')
    artifacts.linguistic = this.#loadYamlDir(mindDir, 'artifacts/linguistic')
    artifacts.narrative = this.#loadYamlDir(mindDir, 'artifacts/narrative')

    // Remove nulls para clones legacy
    for (const key of Object.keys(artifacts)) {
      if (artifacts[key] === null || (Array.isArray(artifacts[key]) && artifacts[key].length === 0)) {
        delete artifacts[key]
      }
    }

    return artifacts
  }

  /**
   * Carrega o agent.md principal.
   * MMOS v3: agents/{slug}.md
   * Legacy: agent.md
   */
  loadAgentMd(slug) {
    const mindDir = join(this.#mindsPath, slug)

    const fullPath = join(mindDir, 'agents', `${slug}.md`)
    if (existsSync(fullPath)) {
      return readFileSync(fullPath, 'utf-8')
    }

    const legacyPath = join(mindDir, 'agent.md')
    if (existsSync(legacyPath)) {
      return readFileSync(legacyPath, 'utf-8')
    }

    return null
  }

  /**
   * Carrega o Synapse DNA do clone se existir.
   */
  loadSynapseDna(slug) {
    const dnaPath = join(this.#synapsePath, `${slug}.yaml`)
    if (!existsSync(dnaPath)) return null
    try {
      return readFileSync(dnaPath, 'utf-8')
    } catch {
      return null
    }
  }

  // ---- internals ----

  #loadConfig(slug) {
    if (this.#cache.has(slug)) return this.#cache.get(slug)

    const configPath = join(this.#mindsPath, slug, 'config.yaml')
    if (!existsSync(configPath)) return null

    const raw = readFileSync(configPath, 'utf-8')
    const parsed = yaml.load(raw)
    const clone = parsed?.clone || {}

    const normalized = {
      name: clone.name || slug,
      slug: clone.slug || slug,
      category: clone.category || 'Unknown',
      domain: clone.domain || '',
      archetype: clone.archetype || null,
      fidelity_score: clone.fidelity_score ?? null,
      fidelity_estimated: clone.fidelity_estimated ?? null,
      pipeline_version: clone.pipeline_version || 'legacy',
      status: clone.status || 'active',
      version: clone.version || '1.0.0',
      created_at: clone.created_at || null,
      pcfe_approved: clone.pcfe_approved ?? false,
    }

    this.#cache.set(slug, normalized)
    return normalized
  }

  #detectArtifacts(slug, mindDir) {
    const artifacts = []
    const checks = [
      { key: 'drivers', path: `drivers/${slug}-drivers.yaml` },
      { key: 'voice', path: `voice/${slug}-voice.yaml` },
      { key: 'phrases', path: `phrases/${slug}-phrases.yaml` },
      { key: 'system_components', path: `system-components/${slug}-system.yaml` },
      { key: 'checklists', path: `checklists/${slug}-checklist.yaml` },
      { key: 'frameworks', path: `frameworks/${slug}` },
      { key: 'behavioral', path: 'artifacts/behavioral' },
      { key: 'cognitive', path: 'artifacts/cognitive' },
      { key: 'linguistic', path: 'artifacts/linguistic' },
      { key: 'narrative', path: 'artifacts/narrative' },
      { key: 'synapse_dna', path: join(this.#synapsePath, `${slug}.yaml`) },
    ]

    for (const check of checks) {
      const fullPath = check.path.startsWith('/') ? check.path : join(mindDir, check.path)
      if (existsSync(fullPath)) artifacts.push(check.key)
    }

    return artifacts
  }

  #isFullSquad(mindDir) {
    return existsSync(join(mindDir, 'artifacts')) && existsSync(join(mindDir, 'frameworks'))
  }

  #loadYamlSingle(mindDir, relativePath) {
    const fullPath = join(mindDir, relativePath)
    if (!existsSync(fullPath)) return null
    try {
      return yaml.load(readFileSync(fullPath, 'utf-8'))
    } catch {
      return null
    }
  }

  #loadYamlDir(mindDir, relativeDirPath) {
    const fullDir = join(mindDir, relativeDirPath)
    if (!existsSync(fullDir)) return []
    try {
      const files = readdirSync(fullDir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
      return files
        .map((f) => {
          try {
            const parsed = yaml.load(readFileSync(join(fullDir, f), 'utf-8'))
            return { _file: f, ...parsed }
          } catch {
            return null
          }
        })
        .filter(Boolean)
    } catch {
      return []
    }
  }

  /**
   * Invalida cache de um slug especifico (ou todo o cache se nao passado).
   */
  invalidateCache(slug) {
    if (slug) {
      this.#cache.delete(slug)
    } else {
      this.#cache.clear()
    }
  }
}
