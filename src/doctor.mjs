import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { execSync } from 'child_process'
import { checkMcpStatus, printMcpReport } from './mcp-check.mjs'

// ANSI color helpers
const green = (s) => `\x1b[32m${s}\x1b[0m`
const yellow = (s) => `\x1b[33m${s}\x1b[0m`
const red = (s) => `\x1b[31m${s}\x1b[0m`
const bold = (s) => `\x1b[1m${s}\x1b[0m`

const OK = green('✓')
const WARN = yellow('⚠')
const FAIL = red('✗')

/**
 * Run a command silently and return trimmed stdout, or null on failure.
 */
function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  } catch {
    return null
  }
}

/**
 * Parse a version string like "v20.11.0" or "3.12.1" into [major, minor, patch].
 */
function parseVersion(raw) {
  if (!raw) return null
  const match = raw.match(/(\d+)\.(\d+)\.(\d+)/)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

/**
 * Compare [major, minor, patch] >= [major, minor, patch].
 */
function gte(version, min) {
  for (let i = 0; i < 3; i++) {
    if (version[i] > min[i]) return true
    if (version[i] < min[i]) return false
  }
  return true
}

/**
 * Doctor diagnostic — checks entire development environment.
 */
export function doctor(cwd) {
  const results = []

  // --- 1. Node.js ---
  const nodeRaw = run('node --version')
  const nodeVer = parseVersion(nodeRaw)
  if (!nodeVer) {
    results.push(`  ${FAIL} Node.js           nao encontrado`)
  } else if (!gte(nodeVer, [18, 0, 0])) {
    results.push(`  ${FAIL} Node.js           ${nodeRaw} (requer >= 18)`)
  } else if (!gte(nodeVer, [20, 0, 0])) {
    results.push(`  ${WARN} Node.js           ${nodeRaw} (recomendado >= 20)`)
  } else {
    results.push(`  ${OK} Node.js           ${nodeRaw}`)
  }

  // --- 2. npm ---
  const npmRaw = run('npm --version')
  const npmVer = parseVersion(npmRaw)
  if (!npmVer) {
    results.push(`  ${FAIL} npm               nao encontrado`)
  } else if (!gte(npmVer, [9, 0, 0])) {
    results.push(`  ${FAIL} npm               v${npmRaw} (requer >= 9)`)
  } else {
    results.push(`  ${OK} npm               v${npmRaw}`)
  }

  // --- 3. Python ---
  const pyRaw = run('python3 --version')
  const pyVer = parseVersion(pyRaw)
  if (!pyVer) {
    results.push(`  ${FAIL} Python            nao encontrado (requer >= 3.10 para MCP servers)`)
  } else if (!gte(pyVer, [3, 10, 0])) {
    results.push(`  ${FAIL} Python            ${pyRaw} (requer >= 3.10)`)
  } else {
    results.push(`  ${OK} Python            ${pyRaw}`)
  }

  // --- 4. Git ---
  const gitRaw = run('git --version')
  const gitVer = parseVersion(gitRaw)
  if (!gitVer) {
    results.push(`  ${FAIL} Git               nao encontrado`)
  } else {
    results.push(`  ${OK} Git               ${gitRaw}`)
  }

  const gitName = run('git config --global user.name')
  const gitEmail = run('git config --global user.email')
  if (!gitName || !gitEmail) {
    const missing = [!gitName && 'user.name', !gitEmail && 'user.email'].filter(Boolean).join(', ')
    results.push(`  ${WARN} Git config        falta: ${missing}`)
  } else {
    results.push(`  ${OK} Git config        ${gitName} <${gitEmail}>`)
  }

  // --- 5. Claude Code ---
  const claudeRaw = run('which claude')
  if (!claudeRaw) {
    results.push(`  ${FAIL} Claude Code       nao encontrado (instale em claude.ai/code)`)
  } else {
    results.push(`  ${OK} Claude Code       ${claudeRaw}`)
  }

  // --- 6. Docker (optional) ---
  const dockerRaw = run('docker --version')
  if (!dockerRaw) {
    results.push(`  ${WARN} Docker            nao encontrado (opcional, para LLM routing)`)
  } else {
    results.push(`  ${OK} Docker            ${dockerRaw}`)
  }

  // --- 7. uv ---
  const uvRaw = run('uv --version')
  if (!uvRaw) {
    results.push(`  ${FAIL} uv                nao encontrado (necessario para MCP servers Python)`)
  } else {
    results.push(`  ${OK} uv                ${uvRaw}`)
  }

  // --- 8. Redis (optional) ---
  const redisRaw = run('redis-cli ping')
  if (redisRaw === 'PONG') {
    results.push(`  ${OK} Redis             rodando`)
  } else {
    results.push(`  ${WARN} Redis             nao respondeu (opcional, para session/task MCPs)`)
  }

  // --- 9. Key directories ---
  const dirs = ['.claude/', '.planning/', '.mcp.json']
  for (const dir of dirs) {
    const full = resolve(cwd, dir)
    if (existsSync(full)) {
      results.push(`  ${OK} ${dir.padEnd(18)} encontrado`)
    } else {
      results.push(`  ${FAIL} ${dir.padEnd(18)} nao encontrado`)
    }
  }

  // --- 10. .env.local ---
  const envLocalPath = resolve(cwd, '.env.local')
  if (existsSync(envLocalPath)) {
    results.push(`  ${OK} .env.local        encontrado`)
  } else {
    results.push(`  ${WARN} .env.local        nao encontrado (crie a partir de .env.example)`)
  }

  // --- 11. system.yaml ---
  const sysYamlPath = resolve(cwd, '.claude/config/system.yaml')
  if (existsSync(sysYamlPath)) {
    try {
      readFileSync(sysYamlPath, 'utf-8')
      results.push(`  ${OK} system.yaml       encontrado e legivel`)
    } catch {
      results.push(`  ${FAIL} system.yaml       encontrado mas nao legivel`)
    }
  } else {
    results.push(`  ${FAIL} system.yaml       nao encontrado (.claude/config/system.yaml)`)
  }

  // --- Print results ---
  console.log(`
  ${bold('DuarteOS Doctor')} — Diagnostico do Ambiente
  ${'='.repeat(50)}
`)

  for (const line of results) {
    console.log(line)
  }

  // --- 12. MCP Health ---
  console.log('')
  const mcpStatus = checkMcpStatus(cwd)
  printMcpReport(mcpStatus)

  // --- Summary ---
  const failCount = results.filter(r => r.includes('\x1b[31m✗')).length
  const warnCount = results.filter(r => r.includes('\x1b[33m⚠')).length

  if (failCount === 0 && warnCount === 0) {
    console.log(`  ${green('Ambiente 100% pronto!')}`)
  } else if (failCount === 0) {
    console.log(`  ${yellow(`${warnCount} aviso(s), nenhum erro critico.`)}`)
  } else {
    console.log(`  ${red(`${failCount} erro(s) critico(s)`)}${warnCount > 0 ? `, ${yellow(`${warnCount} aviso(s)`)}` : ''}`)
  }
  console.log('')
}
