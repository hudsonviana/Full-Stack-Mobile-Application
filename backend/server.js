import express from 'express'
import dotenv from 'dotenv'
import { sql } from './config/db.js'
import rateLimiter from './middleware/rateLimiter.js'

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

app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `
    res.status(200).json(transactions)
  } catch (error) {
    console.log('Erro ao consultar uma transação:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

app.post('/api/transactions', async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body

    if (!title || !amount || !category || !user_id) {
      return res
        .status(400)
        .json({ message: 'Todos os campos são obrigatórios' })
    }

    const transaction = await sql`
      INSERT INTO transactions(user_id,title,amount,category)
      VALUES (${user_id},${title},${amount},${category})
      RETURNING *
    `

    console.log(transaction)
    res.status(201).json(transaction[0])
  } catch (error) {
    console.log('Erro ao criar uma transação:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'ID inválido de transação' })
    }

    const transactions = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'Transação não encontrada' })
    }

    res.status(200).json({ message: 'Transação deletada com sucesso' })
  } catch (error) {
    console.log('Erro ao deletar uma transação:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

app.get('/api/transactions/summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const [summary] = await sql`
      SELECT
        COALESCE(SUM(amount), 0) AS balance,
        COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END), 0) AS expenses
      FROM transactions
      WHERE user_id = ${userId}
    `

    res.status(200).json({
      balance: summary.balance,
      income: summary.income,
      expenses: summary.expenses,
    })
  } catch (error) {
    console.log('Erro ao consultar o sumário de uma transação:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

initDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server running on PORT:', PORT)
  })
})

// https://www.youtube.com/watch?v=vk13GJi4Vd0
// Parei em 1:14:00

// https://console.neon.tech/app/projects/gentle-glitter-68092320/branches/br-silent-cloud-ac8jp7wu/tables?database=neondb

// https://dashboard.clerk.com/apps/app_30DH0cWteNYVHtNBiYCbdLWk0of/instances/ins_30DH0d8T8v5gxS0wlhW4z7kq2Uh

// https://console.upstash.com/redis/1689acfa-fcb9-43a6-b21d-160aee99b39a?teamid=0
