import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '@/utils/types'

interface AuthContextType {
	user: User | null
	loading: boolean
	login: (token: string, user: User) => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const loadUserData = async () => {
			const storedUser = await AsyncStorage.getItem('user')
			if (storedUser) setUser(JSON.parse(storedUser))
			setLoading(false)
		}
		loadUserData()
	}, [])

	const login = async (token: string, userData: User) => {
		await AsyncStorage.setItem('token', token)
		await AsyncStorage.setItem('user', JSON.stringify(userData))
		setUser(userData)
	}

	const logout = async () => {
		await AsyncStorage.removeItem('token')
		await AsyncStorage.removeItem('user')
		setUser(null)
	}

	return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) throw new Error('useAuth must be used within an AuthProvider')
	return context
}
