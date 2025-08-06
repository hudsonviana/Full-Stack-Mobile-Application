import { useCallback, useState } from 'react'
import { Alert } from 'react-native'
import { API_URL } from '@/constants/api.js'

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  //
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`)
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error('Erro ao pegar as transações:', error)
    }
  }, [userId])

  //
  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`)
      const data = await response.json()
      setSummary(data)
    } catch (error) {
      console.error('Erro ao pegar o sumário:', error)
    }
  }, [userId])

  //
  const loadData = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)

    try {
      await Promise.all([fetchTransactions(), fetchSummary()])
    } catch (error) {
      console.error('Erro ao carregar os dados:', error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchTransactions, fetchSummary, userId])

  //
  const deleteTransacion = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Falha ao deletar transação')
      }

      loadData()
      Alert.alert('Sucesso', 'Transação deletada com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar transação:', error)
      Alert.alert('Erro', error.message)
    }
  }

  return { transactions, summary, isLoading, loadData, deleteTransacion }
}
