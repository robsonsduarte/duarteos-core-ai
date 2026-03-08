/**
 * Global error handler middleware.
 * Deve ser registrado por ultimo no Express (4 parametros).
 */
export function errorHandler(err, req, res, _next) {
  const timestamp = new Date().toISOString()
  console.error(`[${timestamp}] ERROR ${req.method} ${req.path}:`, err.message)

  if (err.stack) {
    console.error(err.stack)
  }

  const status = err.status || err.statusCode || 500

  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Erro interno do servidor.',
      ...(err.details ? { details: err.details } : {}),
    },
  })
}

/**
 * Helper para criar erros com codigo HTTP especifico.
 */
export function createError(status, code, message, details) {
  const err = new Error(message)
  err.status = status
  err.code = code
  if (details) err.details = details
  return err
}
