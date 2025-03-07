import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { Stack, useRouter } from 'expo-router'
import React, { useEffect } from 'react'

const RootLayout = () => {
	return (
		<AuthProvider>
			<MainLayout />
		</AuthProvider>
	)
}

const MainLayout = () => {
	const authContext = useAuth()
	const router = useRouter()

	if (!authContext) {
		console.error('AuthContext is not found')
		return null
	}

	const { user } = authContext

	useEffect(() => {
		if (user === null) {
			router.replace('/')
		} else {
			router.replace('/home')
		}
	}, [user])

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name='index' />
			<Stack.Screen name='login' />
			<Stack.Screen name='signup' />
		</Stack>
	)
}
export default RootLayout
