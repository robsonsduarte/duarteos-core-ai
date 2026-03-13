import { existsSync, readFileSync, statSync } from 'fs'
import { resolve } from 'path'

const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const BOLD = '\x1b[1m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

const pass = (msg) => console.log(`  ${GREEN}\u2713${RESET} ${msg}`)
const fail = (msg) => console.log(`  ${RED}\u2717${RESET} ${msg}`)
const warn = (msg) => console.log(`  ${YELLOW}\u26a0${RESET} ${msg}`)

function checkExists(cwd, relPath, label) {
  const full = resolve(cwd, relPath)
  if (existsSync(full)) {
    pass(label || relPath)
    return 'pass'
  }
  fail(label || relPath)
  return 'fail'
}

function checkJson(cwd, relPath, requiredKey) {
  const full = resolve(cwd, relPath)
  if (!existsSync(full)) {
    fail(`${relPath} — arquivo nao encontrado`)
    return 'fail'
  }
  try {
    const data = JSON.parse(readFileSync(full, 'utf-8'))
    if (requiredKey && !(requiredKey in data)) {
      fail(`${relPath} — chave "${requiredKey}" ausente`)
      return 'fail'
    }
    pass(`${relPath} — JSON valido${requiredKey ? ` (${requiredKey} presente)` : ''}`)
    return 'pass'
  } catch {
    fail(`${relPath} — JSON invalido`)
    return 'fail'
  }
}

function checkNonEmpty(cwd, relPath) {
  const full = resolve(cwd, relPath)
  if (!existsSync(full)) {
    fail(`${relPath} — arquivo nao encontrado`)
    return 'fail'
  }
  try {
    const stat = statSync(full)
    if (stat.size === 0) {
      warn(`${relPath} — arquivo vazio`)
      return 'warn'
    }
    pass(`${relPath} — existe e nao-vazio`)
    return 'pass'
  } catch {
    fail(`${relPath} — erro ao ler`)
    return 'fail'
  }
}

function checkJsonIfExists(cwd, relPath) {
  const full = resolve(cwd, relPath)
  if (!existsSync(full)) {
    warn(`${relPath} — opcional, nao encontrado`)
    return 'warn'
  }
  try {
    JSON.parse(readFileSync(full, 'utf-8'))
    pass(`${relPath} — JSON valido`)
    return 'pass'
  } catch {
    fail(`${relPath} — JSON invalido`)
    return 'fail'
  }
}

export function validate(cwd) {
  const counts = { pass: 0, fail: 0, warn: 0 }
  const track = (result) => { counts[result]++ }

  console.log(`\n${BOLD}  DuarteOS Validate${RESET}`)
  console.log(`${DIM}  Verificando integridade da instalacao em: ${cwd}${RESET}\n`)

  // 1. Required directories
  console.log(`${BOLD}  Diretorios obrigatorios${RESET}`)
  const requiredDirs = [
    '.claude/',
    '.claude/commands/',
    '.claude/protocols/',
    '.claude/config/',
    '.claude/hooks/',
    '.claude/synapse/',
    '.claude/omega/',
    '.claude/agents/',
    '.claude/agent-memory/',
    '.planning/',
  ]
  for (const dir of requiredDirs) {
    track(checkExists(cwd, dir))
  }

  // 2. Required files
  console.log(`\n${BOLD}  Arquivos obrigatorios${RESET}`)
  const requiredFiles = [
    'CLAUDE.md',
    '.mcp.json',
    '.claude/config/system.yaml',
    '.claude/config/project.yaml',
    '.claude/protocols/CONSTITUTION.md',
    '.claude/protocols/OMEGA.md',
    '.claude/protocols/SYNAPSE.md',
    '.claude/omega/config.yaml',
    '.claude/omega/state.json',
  ]
  for (const file of requiredFiles) {
    track(checkExists(cwd, file))
  }

  // 3. Config validation
  console.log(`\n${BOLD}  Validacao de configs${RESET}`)
  track(checkJson(cwd, '.mcp.json', 'mcpServers'))
  track(checkJson(cwd, '.claude/omega/state.json'))
  track(checkNonEmpty(cwd, '.claude/omega/config.yaml'))
  track(checkNonEmpty(cwd, '.claude/config/system.yaml'))
  track(checkJsonIfExists(cwd, '.planning/config.json'))

  // 4. Agent files
  console.log(`\n${BOLD}  Agentes core${RESET}`)
  const agentFiles = [
    '.claude/commands/DUARTEOS/agents/pm.md',
    '.claude/commands/DUARTEOS/agents/architect.md',
    '.claude/commands/DUARTEOS/agents/backend.md',
    '.claude/commands/DUARTEOS/agents/frontend.md',
    '.claude/commands/DUARTEOS/agents/qa.md',
    '.claude/commands/DUARTEOS/agents/context-engineer.md',
    '.claude/commands/DUARTEOS/agents/devils-advocate.md',
    '.claude/commands/DUARTEOS/agents/squad.md',
  ]
  for (const file of agentFiles) {
    track(checkExists(cwd, file))
  }

  // 5. Summary
  const total = counts.pass + counts.fail + counts.warn
  console.log(`\n${BOLD}  Resultado${RESET}`)
  console.log(`  ${GREEN}${counts.pass} passou${RESET}  ${RED}${counts.fail} falhou${RESET}  ${YELLOW}${counts.warn} avisos${RESET}  ${DIM}(${total} verificacoes)${RESET}`)

  if (counts.fail === 0) {
    console.log(`\n  ${GREEN}${BOLD}Instalacao integra!${RESET}\n`)
  } else {
    console.log(`\n  ${RED}${BOLD}${counts.fail} problema(s) encontrado(s).${RESET}`)
    console.log(`  ${DIM}Execute "npx duarteos init" para corrigir.${RESET}\n`)
  }

  return counts
}
