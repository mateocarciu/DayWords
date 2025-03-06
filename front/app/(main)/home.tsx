import ScreenWarpper from '@/components/ScreenWrapper'
import React from 'react'
import { View, Text, Button } from 'react-native'
import { useAuth } from '@/contexts/AuthContext'

const home = () => {
	const { logout } = useAuth()
	return (
		<ScreenWarpper>
			<Text>Home</Text>
			<Button title='Logout' onPress={logout} />
		</ScreenWarpper>
	)
}

export default home
