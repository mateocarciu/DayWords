import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import Header from '@/components/Header'
import Avatar from '@/components/Avatar'
import ScreenWrapper from '@/components/ScreenWrapper'
import authFetch from '@/helpers/authFetch'
import Tabs from '@/components/Tabs'
import TabButton from '@/components/TabButton'
import { Feather } from '@expo/vector-icons'
import { User, FriendRequests } from '@/utils/types'

const Friends = () => {
	const [friends, setFriends] = useState<User[]>([])
	const [friendRequests, setFriendRequests] = useState<FriendRequests[]>([])
	const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends')

	useEffect(() => {
		fetchFriends()
	}, [])

	const fetchFriends = async () => {
		try {
			const response = await authFetch(`${process.env.EXPO_PUBLIC_API_URL}/api/friends`, {
				method: 'GET'
			})
			setFriends(response.friends)
			setFriendRequests(response.requests)
		} catch (error: any) {
			console.error('Error fetching friends:', error)
			Alert.alert('Error fetching friends:', `Code: ${error.status} - ${error.message}`)
		}
	}

	const handleRequest = async (requestId: number, action: string) => {
		try {
			await authFetch(`${process.env.EXPO_PUBLIC_API_URL}/api/friends/requests/${requestId}`, {
				method: 'PATCH',
				body: JSON.stringify({ action })
			})
			fetchFriends()
		} catch (error) {
			console.error('Error handling friend request:', error)
			Alert.alert('Error', 'Failed to update friend request.')
		}
	}

	const handleRemoveFriend = async (friendId: number) => {
		Alert.alert('Supprimer cet ami ?', 'Cette action est irréversible.', [
			{ text: 'Annuler', style: 'cancel' },
			{
				text: 'Supprimer',
				style: 'destructive',
				onPress: async () => {
					try {
						await authFetch(`${process.env.EXPO_PUBLIC_API_URL}/api/friends/${friendId}`, {
							method: 'DELETE'
						})
						Alert.alert('Ami supprimé')
						fetchFriends()
					} catch (error: any) {
						console.error('Error deleting friend:', error)
						Alert.alert('Error', error.message)
					}
				}
			}
		])
	}

	const renderFriendItem = ({ item }: { item: User }) => (
		<View style={styles.card}>
			<View style={styles.userInfo}>
				<Avatar username={item.username ?? ''} size={hp(5)} rounded={theme.radius.md} />
				<View style={styles.userTextInfo}>
					<Text style={styles.username}>{item.username}</Text>
					{item.bio && <Text style={styles.bio}>{item.bio}</Text>}
				</View>
			</View>
			<TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFriend(item.id)}>
				<Feather name='user-x' size={hp(2.5)} color={theme.colors.rose} />
			</TouchableOpacity>
		</View>
	)

	const renderRequestItem = ({ item }: { item: FriendRequests }) => (
		<View style={styles.card}>
			<View style={styles.userInfo}>
				<Avatar username={item.sender.username ?? ''} size={hp(5)} rounded={theme.radius.md} />
				<View style={styles.userTextInfo}>
					<Text style={styles.username}>{item.sender.username}</Text>
					<Text style={styles.date}>Envoyée le {item.date}</Text>
				</View>
			</View>
			<View style={styles.requestActions}>
				<TouchableOpacity style={styles.acceptButton} onPress={() => handleRequest(item.id, 'accept')}>
					<Feather name='check' size={hp(2.5)} color='white' />
				</TouchableOpacity>
				<TouchableOpacity style={styles.declineButton} onPress={() => handleRequest(item.id, 'reject')}>
					<Feather name='x' size={hp(2.5)} color='white' />
				</TouchableOpacity>
			</View>
		</View>
	)

	return (
		<ScreenWrapper autoDismissKeyboard={false}>
			<View style={styles.headerContainer}>
				<Header title='Friends' marginBottom={30} reverse={true} />
			</View>
			<Tabs>
				<TabButton title='Friends' active={activeTab === 'friends'} onPress={() => setActiveTab('friends')} />
				<TabButton title={`Requests (${friendRequests.length})`} active={activeTab === 'requests'} onPress={() => setActiveTab('requests')} />
			</Tabs>

			<View style={styles.container}>
				{activeTab === 'friends' ? (
					<FlatList
						data={friends}
						keyExtractor={(item) => item.id.toString()}
						renderItem={renderFriendItem}
						contentContainerStyle={{
							gap: hp(1.5),
							paddingBottom: hp(2)
						}}
						ListEmptyComponent={<Text style={styles.emptyText}>Aucun ami pour l'instant.</Text>}
					/>
				) : (
					<FlatList
						data={friendRequests}
						keyExtractor={(item) => item.id.toString()}
						renderItem={renderRequestItem}
						contentContainerStyle={{
							gap: hp(1.5),
							paddingBottom: hp(2)
						}}
						ListEmptyComponent={<Text style={styles.emptyText}>Aucune demande d'ami en attente.</Text>}
					/>
				)}
			</View>
		</ScreenWrapper>
	)
}

export default Friends

const styles = StyleSheet.create({
	headerContainer: {
		marginBottom: 20,
		paddingHorizontal: wp(4)
	},
	container: {
		flex: 1,
		paddingHorizontal: wp(4)
	},
	card: {
		backgroundColor: theme.colors.light,
		borderRadius: theme.radius.md,
		padding: hp(2),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		shadowColor: theme.colors.dark,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	userTextInfo: {
		marginLeft: wp(3)
	},
	username: {
		fontSize: hp(2),
		color: theme.colors.text,
		fontWeight: theme.fonts.semibold
	},
	bio: {
		color: theme.colors.textLight,
		fontSize: hp(1.6)
	},
	date: {
		color: theme.colors.textLight,
		fontSize: hp(1.5)
	},
	removeButton: {
		padding: hp(1)
	},
	requestActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: wp(2)
	},
	acceptButton: {
		backgroundColor: theme.colors.green,
		padding: hp(1.2),
		borderRadius: theme.radius.sm
	},
	declineButton: {
		backgroundColor: theme.colors.rose,
		padding: hp(1.2),
		borderRadius: theme.radius.sm
	},
	emptyText: {
		textAlign: 'center',
		color: theme.colors.textLight,
		fontSize: hp(1.8),
		marginTop: hp(4)
	}
})
