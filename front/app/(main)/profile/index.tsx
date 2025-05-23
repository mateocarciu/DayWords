import { Feather } from '@expo/vector-icons'
import Avatar from '@/components/Avatar'
import Header from '@/components/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { hp } from '@/helpers/common'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import authFetch from '@/helpers/authFetch'

const Profile = () => {
	const router = useRouter()

	const AuthContext = useAuth()
	if (!AuthContext) {
		console.warn('AuthContext is not found')
		return null
	}
	const { user, logout } = AuthContext

	useEffect(() => {
		console.log('Profile Screen - useEffect')
	}, [])

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

	const handleLogout = () => {
		Alert.alert('Youre about to logout', 'Logout ?', [
			{
				text: 'Cancel',
				onPress: () => {},
				style: 'cancel'
			},
			{
				text: 'Logout',
				onPress: () => submitLogout(),
				style: 'destructive'
			}
		])
	}

	return (
		<ScreenWrapper autoDismissKeyboard={false}>
			<View style={styles.headerContainer}>
				<Header title='Profile' marginBottom={30} />
				<TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
					<Feather name='power' color={theme.colors.rose} size={25} />
				</TouchableOpacity>
			</View>
			<View style={{ gap: 15 }}>
				<View style={styles.avatarContainer}>
					<Avatar username={user?.username ?? ''} size={hp(12)} rounded={theme.radius.xxl * 1.4} />
				</View>

				<View style={{ alignItems: 'center', gap: 2 }}>
					<Text style={styles.userName}>{user?.username || ''}</Text>
				</View>

				<View style={{ gap: 10 }}>
					<View style={styles.info}>
						<Feather name='user' size={20} color={theme.colors.textLight} />
						<Text style={styles.infoText}>{user?.name}</Text>
					</View>
					<View style={styles.info}>
						<Feather name='mail' size={20} color={theme.colors.textLight} />
						<Text style={styles.infoText}>{user?.email || ''}</Text>
					</View>
					<View style={styles.info}>
						<Feather name='info' size={20} color={theme.colors.textLight} />
						<Text style={styles.infoText}>{user?.bio}</Text>
					</View>
				</View>
			</View>
		</ScreenWrapper>
	)
}

export default Profile

const styles = StyleSheet.create({
	headerContainer: {
		marginBottom: 20
	},
	avatarContainer: {
		height: hp(12),
		width: hp(12),
		alignSelf: 'center'
	},
	userName: {
		fontSize: hp(3),
		fontWeight: theme.fonts.medium,
		color: theme.colors.textDark
	},
	info: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10
	},
	infoText: {
		fontSize: hp(1.5),
		fontWeight: theme.fonts.medium,
		color: theme.colors.textLight
	},
	logoutBtn: {
		position: 'absolute',
		right: 0,
		padding: 5,
		borderRadius: theme.radius.sm,
		backgroundColor: theme.colors.light
	}
})
