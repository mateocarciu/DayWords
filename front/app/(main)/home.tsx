import ScreenWarpper from '@/components/ScreenWrapper'
import React from 'react'
import { View, Text, Pressable, Alert } from 'react-native'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'
import { Button } from 'react-native'
import authFetch from '@/helpers/authFetch'

const home = () => {
	const { user, logout } = useAuth()
	const router = useRouter()

	const submitLogout = async () => {
		try {
			await authFetch(`${process.env.EXPO_PUBLIC_API_URL}/api/logout`, {
				method: 'POST'
			})
			logout()
			router.replace('/')
		} catch (error: any) {
			console.error('Erreur lors du logout:', error)
			Alert.alert('Erreur de déconnexion', `Code: ${error.status} - ${error.message}`)
		}
	}

	return (
		<ScreenWarpper>
			<Text>Home</Text>
			<Button title='Logout' onPress={submitLogout} />
		</ScreenWarpper>
	)
}

export default home
