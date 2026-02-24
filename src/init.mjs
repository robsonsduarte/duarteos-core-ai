import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = resolve(__dirname, '..', 'templates')

function copyTemplate(src, dest, replacements = {}) {
  let content = readFileSync(src, 'utf-8')

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(`{{${key}}}`, value)
  }

  const destDir = dirname(dest)
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true })
  }

  writeFileSync(dest, content, 'utf-8')
}

function detectProjectName(cwd) {
  const pkgPath = resolve(cwd, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      return pkg.name || null
    } catch {
      return null
    }
  }
  return null
}

export function init(projectName, options = {}) {
  const cwd = process.cwd()

  // Detect project name
  const detectedName = projectName || detectProjectName(cwd) || 'meu-projeto'
  console.log(`\n  Instalando DuarteOS Core AI no projeto: ${detectedName}`)
  console.log(`  Diretorio: ${cwd}\n`)

  const replacements = {
    PROJECT_NAME: detectedName,
    PROJECT_NAME_UPPER: detectedName.toUpperCase().replace(/-/g, ' '),
  }

  // Directories to create
  const dirs = [
    '.claude/commands/agents',
    '.claude/commands/squad',
    '.planning',
  ]

  for (const dir of dirs) {
    const fullPath = resolve(cwd, dir)
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true })
      console.log(`  + criado ${dir}/`)
    }
  }

  // Files to copy (template path -> destination path)
  const files = [
    // Settings
    ['settings.json', '.claude/settings.json'],
    ['session-context.md', '.claude/session-context.md'],

    // Agents
    ['agents/squad.md', '.claude/commands/agents/squad.md'],
    ['agents/pm.md', '.claude/commands/agents/pm.md'],
    ['agents/architect.md', '.claude/commands/agents/architect.md'],
    ['agents/backend.md', '.claude/commands/agents/backend.md'],
    ['agents/frontend.md', '.claude/commands/agents/frontend.md'],
    ['agents/qa.md', '.claude/commands/agents/qa.md'],
    ['agents/context-engineer.md', '.claude/commands/agents/context-engineer.md'],
    ['agents/devils-advocate.md', '.claude/commands/agents/devils-advocate.md'],

    // Squad commands
    ['commands/squad/new-project.md', '.claude/commands/squad/new-project.md'],
    ['commands/squad/map-codebase.md', '.claude/commands/squad/map-codebase.md'],
    ['commands/squad/plan-phase.md', '.claude/commands/squad/plan-phase.md'],
    ['commands/squad/execute-phase.md', '.claude/commands/squad/execute-phase.md'],
    ['commands/squad/verify-work.md', '.claude/commands/squad/verify-work.md'],
    ['commands/squad/discuss-phase.md', '.claude/commands/squad/discuss-phase.md'],
    ['commands/squad/research-phase.md', '.claude/commands/squad/research-phase.md'],
    ['commands/squad/validate-plan.md', '.claude/commands/squad/validate-plan.md'],
    ['commands/squad/audit.md', '.claude/commands/squad/audit.md'],
    ['commands/squad/quick.md', '.claude/commands/squad/quick.md'],
    ['commands/squad/debug.md', '.claude/commands/squad/debug.md'],
    ['commands/squad/progress.md', '.claude/commands/squad/progress.md'],
    ['commands/squad/pause.md', '.claude/commands/squad/pause.md'],
    ['commands/squad/resume.md', '.claude/commands/squad/resume.md'],

    // Planning
    ['planning/config.json', '.planning/config.json'],

    // MCP Servers
    ['mcp.json', '.mcp.json'],

    // Setup commands
    ['commands/setup-mcps.md', '.claude/commands/setup-mcps.md'],
  ]

  let installed = 0
  let skipped = 0

  for (const [src, dest] of files) {
    const destPath = resolve(cwd, dest)
    const srcPath = resolve(TEMPLATES_DIR, src)

    if (existsSync(destPath)) {
      console.log(`  ~ pulado ${dest} (ja existe)`)
      skipped++
      continue
    }

    if (!existsSync(srcPath)) {
      console.log(`  ! template nao encontrado: ${src}`)
      continue
    }

    copyTemplate(srcPath, destPath, replacements)
    console.log(`  + instalado ${dest}`)
    installed++
  }

  // Summary
  console.log(`
  Instalacao completa!
  ---
  Instalados: ${installed} arquivos
  Pulados: ${skipped} (ja existiam)

  Proximos passos:
  1. Configure os MCPs: edite .mcp.json com suas API keys
     (veja /setup-mcps para guia completo)
  2. Adicione .claude/CLAUDE.md com instrucoes especificas do seu projeto
  3. Instale o GSD: https://github.com/cleyio/gsd
  4. Use os comandos:
     /agents:squad [demanda]     — Ativa squad completo
     /agents:pm [demanda]        — Gerente de Projetos
     /agents:architect [area]    — Arquiteto
     /agents:backend [feature]   — Backend Dev
     /agents:frontend [tela]     — Frontend Dev
     /agents:qa [area]           — QA
     /agents:context-engineer    — Context Engineer
     /agents:devils-advocate     — Red Team
     /squad:new-project          — Iniciar projeto
     /squad:plan-phase N         — Planejar fase
     /squad:execute-phase N      — Executar fase
     /squad:quick "desc"         — Task rapida

  MCPs instalados (.mcp.json) — 15 servidores:
     Context7              — Docs atualizadas de bibliotecas
     EXA                   — Busca web + codigo + empresas
     Brave Search          — Busca web, noticias, imagens
     Fetch                 — Busca URLs → Markdown
     YouTube Transcript    — Transcricoes de videos
     Reddit                — Posts, trending, subreddits
     GitHub                — Issues, PRs, repos
     REST API              — Chama qualquer REST API
     Supabase              — Acesso direto ao Supabase
     CodeRabbit            — Code review IA (40+ analyzers)
     n8n                   — Automacoes n8n
     Google Workspace      — Gmail, Drive, Calendar, Docs, Sheets
     Obsidian              — Notas do Obsidian vault
     Memory                — Grafo de conhecimento persistente
     Sequential Thinking   — Raciocinio estruturado
`)
}
