module.exports = function httpError(reason) {
  const err = {message: 'An unknown error occurred.'}
  if (typeof reason === 'string') err.message = reason
  else if (reason && typeof reason === 'object') {
    err.message = reason.err || reason.error || reason.message
  }

  return {
      statusCode: 500,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify(err)
    }
}
