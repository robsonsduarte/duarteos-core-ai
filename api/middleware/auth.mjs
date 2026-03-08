import { config } from '../config.mjs'

/**
 * Bearer token auth middleware.
 * Se DUARTEOS_API_KEY nao estiver configurado, permite acesso local (localhost/127.0.0.1).
 * Se configurado, exige Authorization: Bearer {token} valido.
 */
export function authMiddleware(req, res, next) {
  if (!config.duarteosApiKey) {
    const host = req.hostname || ''
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1'
    if (isLocal) {
      return next()
    }
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'DUARTEOS_API_KEY nao configurado. Acesso remoto bloqueado.',
      },
    })
  }

  const authHeader = req.headers['authorization'] || ''
  const match = authHeader.match(/^Bearer\s+(.+)$/i)

  if (!match) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authorization header ausente ou malformado. Use: Authorization: Bearer {token}',
      },
    })
  }

  if (match[1] !== config.duarteosApiKey) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Token invalido.',
      },
    })
  }

  next()
}
