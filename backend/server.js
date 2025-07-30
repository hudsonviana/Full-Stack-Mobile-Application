import express from 'express'
import dotenv from 'dotenv'
import { sql } from './config/db.js'
import rateLimiter from './middleware/rateLimiter.js'
import transactionsRoute from './routes/transactionsRoute.js'

dotenv.config({ quiet: true })
const PORT = process.env.PORT || 5001

const app = express()

// Middlewares
app.use(rateLimiter)
app.use(express.json())
app.use((req, res, next) => {
  console.log('Oi, atingimos uma req, o método é:', req.method)
  next()
})

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`
    console.log('Database inicializada com sucesso')
  } catch (error) {
    console.log('Erro ao inicializar DB', error)
    process.exit(1)
  }
}

app.get('/', (req, res) => {
  res.send('Está funcionando')
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
