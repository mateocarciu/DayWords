import React, { createContext, useState, useContext, useMemo, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const UserContext = createContext({
	user: { data: null, token: null },
	setUser: async (userData: any) => {},
	logout: async () => {}
})

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState({
		data: null,
		token: null
	})

	useEffect(() => {
		const loadUserData = async () => {
			try {
				const userData = await AsyncStorage.getItem('user')
				if (userData) {
					setUser(JSON.parse(userData))
				}
			} catch (e) {
				console.error('Failed to load user data', e)
			}
		}

		loadUserData()
	}, [])

	const saveUser = async (userData: { data: any; token: string | null }) => {
		try {
			await AsyncStorage.setItem('user', JSON.stringify(userData))
			setUser(userData)
		} catch (e) {
			console.error('Failed to save user data', e)
		}
	}

	const logout = async () => {
		try {
			await AsyncStorage.removeItem('user')
			setUser({ data: null, token: null })
		} catch (e) {
			console.error('Failed to logout', e)
		}
	}

	const value = useMemo(() => ({ user, setUser: saveUser, logout }), [user])

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
