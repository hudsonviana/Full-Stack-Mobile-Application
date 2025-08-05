import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { styles } from '../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants/colors'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    Alert.alert('Sair', 'Tem certeza que deseja fechar o app?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Fechar', style: 'destructive', onPress: signOut },
    ])
  }

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.text} />
    </TouchableOpacity>
  )
}
