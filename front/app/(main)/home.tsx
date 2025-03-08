import Icon from '@/assets/icons'
import Avatar from '@/components/Avatar'
import FloatingButton from '@/components/FloatingButton'
import ScreenWarpper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { hp, wp } from '@/helpers/common'
import { useRouter } from 'expo-router'
import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, Alert, Pressable, FlatList } from 'react-native'
// import PostCard from "@/components/PostCard";
import Loading from '@/components/Loading'
import { Entry } from '@/utils/types'
import authFetch from '@/helpers/authFetch'

const home = () => {
	const authContext = useAuth()
	const router = useRouter()
	const [userEntries, setUserEntries] = useState<Entry[]>([])
	const [friendsEntries, setFriendsEntries] = useState<Entry[]>([])
	const [isRefreshing, setRefreshing] = useState(false)

	if (!authContext) {
		console.error('AuthContext is not found')
		return null
	}
	const { user } = authContext

	useEffect(() => {
		console.log('Home Screen - useEffect')
		refresh()
	}, [])

	const refresh = useCallback(async () => {
		setRefreshing(true)
		await fetchEntries()
		setRefreshing(false)
	}, [])

	const fetchEntries = async () => {
		try {
			const response = await authFetch(`${process.env.EXPO_PUBLIC_API_URL}/api/entries`, {
				method: 'GET'
			})
			setUserEntries(response.entries)
			setFriendsEntries(response.friend_entries)
		} catch (error: any) {
			console.error('Error fetching entries', error)
			Alert.alert('Error fetching entries', `Code: ${error.status} - ${error.message}`)
		}
	}

	return (
		<ScreenWarpper autoDismissKeyboard={false}>
			<View style={styles.container}>
				<FloatingButton onPress={() => router.push('/newPost')} />
				{/* header */}
				<View style={styles.header}>
					<Pressable>
						<Icon name='friends' size={hp(4.3)} strokeWidth={1.5} color={theme.colors.text} />
					</Pressable>
					<Text style={styles.title}>DayWords</Text>
					<View style={styles.icons}>
						<Pressable onPress={() => router.push('/profile')}>
							<Avatar username={user?.username || ''} size={hp(4.3)} rounded={theme.radius.sm} style={{ borderWidth: 2 }} />
						</Pressable>
					</View>
				</View>

				<FlatList
					data={userEntries}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<View>
							<Text>{item.text}</Text>
						</View>
					)}
					refreshing={isRefreshing}
					onRefresh={refresh}
				/>
			</View>
		</ScreenWarpper>
	)
}

export default home

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: wp(4)
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
