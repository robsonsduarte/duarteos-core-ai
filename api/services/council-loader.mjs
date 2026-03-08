import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve, join } from 'path'

/**
 * CouncilLoader — carrega dados dos conselhos do filesystem.
 * Parseia os .md dos conselhos para extrair nome, dominio e membros.
 */
export class CouncilLoader {
  #councilsPath
  #cache = new Map()

  constructor(basePath) {
    this.#councilsPath = resolve(basePath, '.claude', 'commands', 'DUARTEOS', 'conselho')
  }

  /**
   * Retorna lista de todos os conselhos.
   */
  loadAll() {
    const files = readdirSync(this.#councilsPath).filter((f) => f.endsWith('.md'))
    return files
      .map((f) => {
        const slug = f.replace('.md', '')
        try {
          return this.loadOne(slug)
        } catch {
          return null
        }
      })
      .filter(Boolean)
  }

  /**
   * Carrega e parseia um conselho especifico.
   */
  loadOne(slug) {
    if (this.#cache.has(slug)) return this.#cache.get(slug)

    const filePath = join(this.#councilsPath, `${slug}.md`)
    if (!existsSync(filePath)) {
      const err = new Error(`Conselho '${slug}' nao encontrado.`)
      err.status = 404
      err.code = 'COUNCIL_NOT_FOUND'
      throw err
    }

    const content = readFileSync(filePath, 'utf-8')
    const parsed = this.#parseMd(slug, content)
    this.#cache.set(slug, parsed)
    return parsed
  }

  // ---- internals ----

  #parseMd(slug, content) {
    const name = this.#extractName(content)
    const domain = this.#extractDomain(content)
    const members = this.#extractMembers(content)

    return { slug, name, domain, members }
  }

  #extractName(content) {
    const match = content.match(/^#\s+(.+?)(?:\s*—.*)?$/m)
    return match ? match[1].trim() : 'Conselho Desconhecido'
  }

  #extractDomain(content) {
    // Linha: **Dominio:** valor
    const match = content.match(/\*\*Dom[ií]nio:\*\*\s*(.+)/)
    return match ? match[1].trim() : ''
  }

  /**
   * Extrai slugs dos membros da tabela markdown.
   * A tabela tem formato: | Nome | `/DUARTEOS:Categoria:slug` | ... |
   * Extrai o slug da coluna de skill (segunda coluna).
   */
  #extractMembers(content) {
    const members = []

    // Localiza a secao usando indexOf para evitar problemas de regex multiline
    const sectionStart = content.indexOf('## Membros do Conselho')
    if (sectionStart === -1) return members

    const fromSection = content.slice(sectionStart)
    // Vai ate o proximo H2 ou fim do arquivo
    const nextH2 = fromSection.indexOf('\n## ', 1)
    const section = nextH2 !== -1 ? fromSection.slice(0, nextH2) : fromSection

    const tableLines = section
      .split('\n')
      .filter((line) => line.trim().startsWith('|') && !line.includes('---'))

    // Pula header (primeira linha de tabela)
    const dataLines = tableLines.slice(1)

    for (const line of dataLines) {
      const cells = line
        .split('|')
        .map((c) => c.trim())
        .filter((c) => c)

      if (cells.length < 2) continue

      // Extrai slug da segunda coluna: `/DUARTEOS:Categoria:slug`
      const skillCell = cells[1]
      const slugMatch = skillCell.match(/`\/DUARTEOS:[^:]+:([^`]+)`/)
      if (!slugMatch) continue

      const slug = slugMatch[1].trim()
      const name = cells[0]

      members.push({ slug, name })
    }

    return members
  }
}
