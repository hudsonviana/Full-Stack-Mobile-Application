import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '@/hooks/useTransactions'
import { useEffect } from 'react'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'

export default function Page() {
  const { user } = useUser()
  const router = useRouter()

  const { transactions, summary, isLoading, loadData, deleteTransacion } =
    useTransactions(user.id)

  useEffect(() => {
    loadData()
  }, [loadData])

  if (isLoading) return <PageLoader />

  return (
    <View style={styles.container}>
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
    </View>
  )
}

// Parei em 2:44:00
// https://www.youtube.com/watch?v=vk13GJi4Vd0
