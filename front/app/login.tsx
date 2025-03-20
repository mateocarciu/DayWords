import React, { useRef, useState } from 'react'
import { View, Text, Pressable, Alert } from 'react-native'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { Feather } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import BackButton from '@/components/buttons/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '@/helpers/common'
import Input from '@/components/inputs/Input'
import Button from '@/components/buttons/Button'
import { useAuth } from '@/contexts/AuthContext'

export default function login() {
	const router = useRouter()
	const mailRef = useRef('')
	const passwordRef = useRef('')
	const [loading, setLoading] = useState(false)
	const { login } = useAuth()

	const onSubmit = async () => {
		if (!mailRef.current || !passwordRef.current) {
			Alert.alert('Login', 'Please fill all the fields')
			return
		}

		setLoading(true)

		try {
			const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					email: mailRef.current.trim(),
					password: passwordRef.current.trim()
				})
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || 'Login failed')
			}

			await login(data.access_token, data.user)
			router.replace('/home')
		} catch (error: any) {
			Alert.alert('Login Failed', error.message)
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<ScreenWrapper bg='white'>
			<StatusBar style='dark' />
			<View style={styles.container}>
				<BackButton
					onPress={() => {
						router.back()
					}}
				/>

				<View>
					<Text style={styles.welcomeText}>Welcome Back</Text>
				</View>

				{/* form */}
				<View style={styles.form}>
					<Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>Please login to continue</Text>
					<Input icon={<Feather name='mail' size={25} color={theme.colors.textLight} />} placeholder='Enter your email' onChangeText={(text) => (mailRef.current = text)} />
					<Input icon={<Feather name='lock' size={25} color={theme.colors.textLight} />} placeholder='Enter your password' onChangeText={(text) => (passwordRef.current = text)} />
					<Text style={styles.forgotPassword}>Forgot Password?</Text>
					<Button title='Login' loading={loading} onPress={onSubmit} />
					<View style={styles.footer}>
						<Text style={styles.footerText}>Don't have an account?</Text>
						<Pressable onPress={() => router.push('/signup')}>
							<Text
								style={[
									styles.footerText,
									{
										color: theme.colors.primaryDark,
										fontWeight: theme.fonts.semibold
									}
								]}
							>
								Sign up
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</ScreenWrapper>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 45,
		paddingHorizontal: wp(5)
	},
	welcomeText: {
		fontSize: hp(4),
		fontWeight: theme.fonts.bold,
		color: theme.colors.text
	},
	form: {
		gap: 25
	},
	forgotPassword: {
		textAlign: 'right',
		fontWeight: theme.fonts.semibold,
		color: theme.colors.text
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 5
	},
	footerText: {
		textAlign: 'center',
		color: theme.colors.text,
		fontSize: hp(1.6)
	}
})
