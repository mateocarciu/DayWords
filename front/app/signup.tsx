import React, { useRef, useState } from 'react'
import { View, Text, Pressable, Alert } from 'react-native'
import ScreenWarpper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import Icon from '@/assets/icons'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import BackButton from '@/components/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '@/helpers/common'
import Input from '@/components/Input'
import Button from '@/components/Button'

export default function signUp() {
	const router = useRouter()
	const mailRef = useRef('')
	const passwordRef = useRef('')
	const nameRef = useRef('')
	const [loading, setLoading] = useState(false)

	const onSubmit = async () => {
		if (!mailRef.current || !passwordRef.current || !nameRef.current) {
			Alert.alert('Sign Up', 'Please fill all the fields')
			return
		}

		setLoading(true)

		try {
			const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: nameRef.current.trim(),
					email: mailRef.current.trim(),
					password: passwordRef.current.trim()
				})
			})

			const data = await response.json()

			if (!response.ok) {
				console.error(data)
				throw new Error(data.message || 'Registration failed')
			}
			router.navigate('/login')
		} catch (error: any) {
			Alert.alert('Registration Failed', error.message)
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<ScreenWarpper bg='white'>
			<StatusBar style='dark' />
			<View style={styles.container}>
				<BackButton
					onPress={() => {
						router.back()
					}}
				/>

				{/* Welcome Text */}
				<View>
					<Text style={styles.welcomeText}>Let's</Text>
					<Text style={styles.welcomeText}>Get Started</Text>
				</View>

				{/* form */}
				<View style={styles.form}>
					<Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>Please fill the details to create an account</Text>
					<Input icon={<Icon name='user' size={26} strokeWidth={1.6} />} placeholder='Enter your username' onChangeText={(text) => (nameRef.current = text)} />
					<Input icon={<Icon name='mail' size={26} strokeWidth={1.6} />} placeholder='Enter your email' onChangeText={(text) => (mailRef.current = text)} />
					<Input icon={<Icon name='lock' size={26} strokeWidth={1.6} />} placeholder='Enter your password' onChangeText={(text) => (passwordRef.current = text)} />
					<Button title='Sign Up' loading={loading} onPress={onSubmit} />
					<View style={styles.footer}>
						<Text style={styles.footerText}>Already have an account!</Text>
						<Pressable onPress={() => router.push('/login')}>
							<Text
								style={[
									styles.footerText,
									{
										color: theme.colors.primaryDark,
										fontWeight: theme.fonts.semibold
									}
								]}
							>
								Login
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</ScreenWarpper>
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
