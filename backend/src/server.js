import express from 'express'
import dotenv from 'dotenv'
import { initDB } from './config/db.js'
import rateLimiter from './middleware/rateLimiter.js'
import transactionsRoute from './routes/transactionsRoute.js'
import job from './config/cron.js'

dotenv.config({ quiet: true })
const PORT = process.env.PORT || 5001

const app = express()

if (process.env.NODE_ENV === 'production') job.start()

// Middlewares
app.use(rateLimiter)
app.use(express.json())
app.use((req, res, next) => {
  console.log('Oi, atingimos uma req, o método é:', req.method)
  next()
})

app.get('/api/ping', (req, res) => {
  res.status(200).json({ pong: true })
})

app.use('/api/transactions', transactionsRoute)

initDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server running on PORT:', PORT)
  })
})

// https://www.youtube.com/watch?v=vk13GJi4Vd0
// Parei em 1:23:00

// https://console.neon.tech/app/projects/gentle-glitter-68092320/branches/br-silent-cloud-ac8jp7wu/tables?database=neondb

// https://dashboard.clerk.com/apps/app_30DH0cWteNYVHtNBiYCbdLWk0of/instances/ins_30DH0d8T8v5gxS0wlhW4z7kq2Uh

// https://console.upstash.com/redis/1689acfa-fcb9-43a6-b21d-160aee99b39a?teamid=0
