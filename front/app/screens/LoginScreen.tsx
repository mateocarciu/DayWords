import React, { useState, useEffect } from 'react'
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useUser } from '../hooks/UserContext'

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { setUser } = useUser()

	useEffect(() => {
		const checkUserLoggedIn = async () => {
			try {
				const storedUser = await AsyncStorage.getItem('user')
				if (storedUser) {
					const user = JSON.parse(storedUser)
					setUser(user)
					navigation.navigate('Home')
					navigation.reset({
						index: 0,
						routes: [{ name: 'Home' }]
					})
				}
			} catch (error) {
				console.error('Failed to load user data', error)
			}
		}

		checkUserLoggedIn()
	}, [])

	const handleLogin = async () => {
		try {
			const response = await fetch(`${process.env.API_URL}/api/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password
				})
			})

			if (!response.ok) {
				throw new Error('Failed to log in')
			}

			const data = await response.json()
			const { access_token, user } = data

			// Stocker l'utilisateur et le token dans le contexte et AsyncStorage
			const userToStore = { data: user, token: access_token }
			setUser(userToStore)
			await AsyncStorage.setItem('user', JSON.stringify(userToStore))

			// Rediriger vers la page d'accueil
			navigation.reset({
				index: 0,
				routes: [{ name: 'Home' }]
			})
		} catch (error) {
			Alert.alert('Login Error', 'Invalid credentials. Please try again.')
		}
	}

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			// keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
		>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<Text style={styles.title}>Welcome to DayWords</Text>
				<TextInput placeholder='Email' placeholderTextColor='#aaa' value={email} onChangeText={setEmail} style={styles.input} />
				<TextInput placeholder='Password' placeholderTextColor='#aaa' value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
				<TouchableOpacity style={styles.button} onPress={handleLogin}>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
					<Text style={styles.linkText}>Forgot Password?</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.link} onPress={() => navigation.navigate('SignUp')}>
					<Text style={styles.linkText}>Don't have an account? Sign Up</Text>
				</TouchableOpacity>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#333'
	},
	input: {
		width: '100%',
		padding: 15,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 10,
		backgroundColor: '#fff'
	},
	button: {
		backgroundColor: '#6200ee',
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		alignItems: 'center',
		width: '100%'
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	link: {
		marginTop: 10
	},
	linkText: {
		color: '#6200ee',
		fontSize: 14
	}
})

export default LoginScreen
