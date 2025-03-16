import { Feather } from '@expo/vector-icons'
import Avatar from '@/components/Avatar'
import FloatingButton from '@/components/FloatingButton'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { hp, wp } from '@/helpers/common'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import { Entry } from '@/utils/types'
import authFetch from '@/helpers/authFetch'
import EntryList from '@/components/entry/EntryList'
import useSSE from '@/hooks/useSSE'

const home = () => {
	const authContext = useAuth()
	const router = useRouter()
	const [entries, setEntries] = useState<Entry[]>([])
	const [isRefreshing, setRefreshing] = useState(false)

	if (!authContext) {
		console.error('AuthContext is not found')
		return null
	}
	const { user } = authContext

	useEffect(() => {
		fetchEntries()
	}, [])

	useSSE({
		userId: user?.id,
		onNewEntry: () => {
			fetchEntries()
		}
	})

	const fetchEntries = async () => {
		try {
			const response = await authFetch(`${process.env.EXPO_PUBLIC_API_URL}/api/entries`, {
				method: 'GET'
			})

			setRefreshing(true)

			setTimeout(() => {
				setEntries(response)
				setRefreshing(false)
			}, 1000)

			// console.log('Entries:', response)
		} catch (error: any) {
			console.error('Error fetching entries', error)
			Alert.alert('Error fetching entries', `Code: ${error.status} - ${error.message}`)
		}
	}

	return (
		<ScreenWrapper autoDismissKeyboard={false} scrollEnabled={true}>
			<View style={styles.container}>
				<FloatingButton onPress={() => router.push('/newPost')} />
				<View style={styles.header}>
					<TouchableOpacity onPress={() => router.push('/friends')}>
						<Feather name='users' size={25} color={theme.colors.text} />
					</TouchableOpacity>
					<Text style={styles.title} onPress={fetchEntries}>
						DayWords
					</Text>
					<View style={styles.icons}>
						<TouchableOpacity onPress={() => router.push('/profile')}>
							<Avatar username={user?.username || ''} size={hp(4.3)} rounded={theme.radius.sm} style={{ borderWidth: 2 }} />
						</TouchableOpacity>
					</View>
				</View>
				{user && <EntryList entries={entries} currentUserId={user.id} isRefreshing={isRefreshing} onRefresh={fetchEntries} />}
			</View>
		</ScreenWrapper>
	)
}

export default home

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: wp(4)
		// backgroundColor: 'red'
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10
	},
	title: {
		color: theme.colors.text,
		fontSize: hp(3.2),
		fontWeight: theme.fonts.bold
	},
	avatarImage: {
		height: hp(4.3),
		width: wp(4.3),
		borderRadius: theme.radius.sm,
		borderColor: theme.colors.gray,
		borderWidth: 3
	},
	icons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 18
	},
	listStyle: {
		paddingTop: 10,
		paddingHorizontal: wp(4)
	},
	noPost: {
		fontSize: hp(2),
		textAlign: 'center',
		color: theme.colors.text
	},
	pill: {
		position: 'absolute',
		right: -10,
		top: -4,
		height: hp(2.2),
		width: hp(2.2),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 20,
		backgroundColor: theme.colors.roseLight,
		borderColor: theme.colors.gray,
		borderWidth: 1
	},
	pillText: {
		color: 'white',
		fontSize: hp(1.2),
		fontWeight: theme.fonts.bold
	}
})
