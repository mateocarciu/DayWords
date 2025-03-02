import React, { createContext, useContext } from 'react'
import { User } from '@/utils/types'

interface AuthContextType {
	user: User | null
	setAuth: (authUser: Pick<User, 'id' | 'username' | 'email' | 'token'> | null) => void
	setUserData: (data: Omit<User, 'id' | 'username' | 'email' | 'token'>) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = React.useState<User | null>(null)

	const setAuth = (authUser: Pick<User, 'id' | 'username' | 'email' | 'token'> | null) => {
		if (authUser === null) {
			setUser(null)
		} else {
			setUser((prev) => ({
				...prev,
				id: authUser.id,
				username: authUser.username,
				email: authUser.email,
				token: authUser.token
			}))
		}
	}

	const setUserData = (data: Omit<User, 'id' | 'name' | 'email' | 'token'>) => {
		setUser((prev) => (prev ? { ...prev, ...data } : prev))
	}

	return <AuthContext.Provider value={{ user, setAuth, setUserData }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
