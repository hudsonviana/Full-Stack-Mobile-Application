import ratelimit from '../config/upstash.js'

const rateLimiter = async (req, res, next) => {
  try {
    // const key = req.ip
    // const { success, limit, remaining, reset } = await ratelimit.limit(key)

    // const { success, limit, remaining, reset } = await ratelimit.limit(
    //   'my-rate-limit'
    // )

    // res.setHeader('X-RateLimit-Limit', limit)
    // res.setHeader('X-RateLimit-Remaining', remaining)
    // res.setHeader('X-RateLimit-Reset', reset)

    const { success } = await ratelimit.limit('my-rate-limit')

    if (!success) {
      return res.status(429).json({
        message: 'Muitas requisições. Por favor, tente mais tarde.',
      })
    }
    next()
  } catch (error) {
    console.log('Erro de Rate limit:', error)
    next(error)
  }
}

export default rateLimiter
