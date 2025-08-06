import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '@/hooks/useTransactions'
import { useEffect, useState } from 'react'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { BalanceCard } from '../../components/BalanceCard'
import { TransactionItem } from '../../components/TransactionItem'
import NoTransactionsFound from '../../components/NoTransactionsFound'

export default function Page() {
  const { user } = useUser()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const { transactions, summary, isLoading, loadData, deleteTransacion } =
    useTransactions(user.id)

  const onRefreshing = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleDelete(id) {
    Alert.alert('Excluir', 'Tem certeza que deseja excluir essa transação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => deleteTransacion(id),
      },
    ])
  }

  if (isLoading && !refreshing) return <PageLoader />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* left */}

          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Bem-vindo,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split('@')[0]}
              </Text>
            </View>
          </View>

          {/* right */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/create')}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Novo</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Transações recentes</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />
        }
      />
    </View>
  )
}

// Parei em 2:44:00
// https://www.youtube.com/watch?v=vk13GJi4Vd0
