import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function getPackageVersion() {
  const pkg = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf-8'))
  return pkg.version
}

export function showVersion() {
  console.log(`duarteos-core-ai v${getPackageVersion()}`)
}

export function showHelp() {
  console.log(`
  duarteos-core-ai v${getPackageVersion()}
  Sistema multi-agente deliberativo-executivo para Claude Code.

  Uso:
    npx duarteos-core-ai init [nome-do-projeto]    Instala agentes e commands no projeto atual
    npx duarteos-core-ai init --yes                 Instala sem perguntas (defaults)

  O que instala:
    .claude/
      settings.json              Configuracao do Claude Code (agent teams habilitado)
      session-context.md         Template de contexto de sessao
      commands/
        agents/
          squad.md               Orquestrador multi-agente (7 agentes)
          pm.md                  Supreme Orchestrator (Gerente de Projetos)
          architect.md           Arquiteto de Software
          backend.md             Desenvolvedor Backend
          frontend.md            Desenvolvedor Frontend
          qa.md                  Analista de Qualidade
          context-engineer.md    Engenheiro de Coerencia
          devils-advocate.md     Advogado do Diabo (Red Team)
        squad/
          new-project.md         Inicializar projeto/milestone
          map-codebase.md        Mapear codebase (4 agentes paralelos)
          plan-phase.md          Planejar fase do roadmap
          execute-phase.md       Executar fase (wave-based parallel)
          verify-work.md         Verificar trabalho (UAT)
          discuss-phase.md       Discutir fase (capturar decisoes)
          research-phase.md      Pesquisar fase
          validate-plan.md       Validar plano (red team)
          audit.md               Auditar milestone
          quick.md               Task rapida
          debug.md               Debug sistematico
          progress.md            Status do projeto
          pause.md               Pausar trabalho
          resume.md              Retomar trabalho
    .planning/
      config.json                Configuracao do workflow GSD

  Pre-requisitos:
    - Claude Code (claude.ai/code) instalado
    - GSD plugin instalado (https://github.com/cleyio/gsd)

  Documentacao: https://github.com/robsonsduarte/duarteos-core-ai
`)
}
