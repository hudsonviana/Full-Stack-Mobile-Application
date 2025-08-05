import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '@/hooks/useTransactions'
import { useEffect } from 'react'

export default function Page() {
  const { user } = useUser()
  const { transactions, summary, isLoading, loadData, deleteTransacion } =
    useTransactions(user.id)

  useEffect(() => {
    loadData()
  }, [loadData])

  console.log('transactions:', transactions)
  console.log('summary:', summary)

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>

        <Text>Income: {summary.income}</Text>
        <Text>Expenses: {summary.expenses}</Text>
        <Text>Balance: {summary.balance}</Text>
        
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}

// Parei em 2:44:00
// https://www.youtube.com/watch?v=vk13GJi4Vd0
