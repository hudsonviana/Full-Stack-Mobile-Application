import { sql } from '../config/db.js'

export async function getTransactionsById(req, res) {
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
}

export async function createTransaction(req, res) {
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
}

export async function deleteTransaction(req, res) {
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
}

export async function getSummaryByUserId(req, res) {
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
}
