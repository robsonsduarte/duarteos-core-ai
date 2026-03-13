import { init } from './init.mjs'
import { update } from './update.mjs'
import { doctor } from './doctor.mjs'
import { validate } from './validate.mjs'
import { showHelp, showVersion } from './utils.mjs'

export function run(args) {
  const command = args[0]

  if (!command || command === '--help' || command === '-h') {
    showHelp()
    return
  }

  if (command === '--version' || command === '-v') {
    showVersion()
    return
  }

  if (command === 'init') {
    const projectName = args[1] || null
    const flags = args.filter(a => a.startsWith('--'))
    const skipPrompts = flags.includes('--yes') || flags.includes('-y')
    init(projectName, { skipPrompts })
    return
  }

  if (command === 'update') {
    const flags = args.filter(a => a.startsWith('--'))
    const force = flags.includes('--force') || flags.includes('-f')
    update({ force })
    return
  }

  if (command === 'doctor') {
    doctor(process.cwd())
    return
  }

  if (command === 'validate') {
    validate(process.cwd())
    return
  }

  console.error(`Comando desconhecido: ${command}`)
  console.error('Use "duarteos --help" para ver os comandos disponiveis.')
  process.exit(1)
}
