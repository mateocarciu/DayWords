import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import Header from '@/components/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import authFetch from '@/helpers/authFetch'
import Tabs from '@/components/Tabs'
import TabButton from '@/components/TabButton'
import { Feather } from '@expo/vector-icons'
import { User, FriendRequests } from '@/utils/types'
import Input from '@/components/Input'
import UserCard from '@/components/UserCard'

const Friends = () => {
	const [friends, setFriends] = useState<User[]>([])
	const [friendRequests, setFriendRequests] = useState<FriendRequests[]>([])
	const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends')
	const [searchUsername, setSearchUsername] = useState('')
	const [searchResults, setSearchResults] = useState<User[]>([])

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
			setActiveTab('friends')
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

	const searchUsers = async (username: string) => {
		setSearchUsername(username) // si tu veux garder le terme tapé pour autre chose
		if (username.trim() === '') {
			setSearchResults([]) // vider si pas de recherche
			return
		}

		try {
			const response = await authFetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users/search?searchTerm=${username}`, { method: 'GET' })
			setSearchResults(response) // on stocke le tableau d'utilisateurs
			console.log('Search results:', response)
		} catch (error) {
			console.error('Error searching users:', error)
		}
	}

	const handleAddFriend = async (userId: number) => {
		try {
			await authFetch(`${process.env.EXPO_PUBLIC_API_URL}/api/friends/add/${userId}`, {
				method: 'POST'
			})
			Alert.alert('Demande envoyée !')
			setSearchResults([])
			setSearchUsername('')
		} catch (error) {
			console.error('Erreur en ajoutant cet ami :', error)
			Alert.alert('Erreur', "Impossible d'envoyer la demande.")
		}
	}

	const renderSearchResultItem = ({ item }: { item: User }) => <UserCard username={item.username ?? ''} profileImageUrl={item.profileImageUrl} isFriend={item.isFriend} primaryText={item.isFriend ? 'Friend' : undefined} onPressPrimary={!item.isFriend ? () => handleAddFriend(item.id) : undefined} primaryIcon='user-plus' style={{}} />

	const renderFriendItem = ({ item }: { item: User }) => <UserCard username={item.username ?? ''} profileImageUrl={item.profileImageUrl} bio={item.bio ?? ''} onPressPrimary={() => handleRemoveFriend(item.id)} isFriend={true} primaryIcon='user-x' />

	const renderRequestItem = ({ item }: { item: FriendRequests }) => <UserCard username={item.sender.username ?? ''} date={`Envoyée le ${item.date}`} onPressPrimary={() => handleRequest(item.id, 'accept')} onPressSecondary={() => handleRequest(item.id, 'reject')} primaryIcon='check' secondaryIcon='x' />

	return (
		<ScreenWrapper>
			<View style={styles.tabsContainer}>
				<Header title='Friends' marginBottom={30} reverse={true} />

				<Input height={hp(5)} icon={<Feather name='search' size={25} color={theme.colors.textLight} />} placeholder='Search for a user...' onChangeText={(text) => searchUsers(text)} value={searchUsername} />
			</View>

			{searchUsername.length > 0 ? (
				<FlatList
					data={searchResults}
					keyExtractor={(item) => item.id.toString()}
					renderItem={renderSearchResultItem}
					contentContainerStyle={{
						gap: hp(1.5),
						paddingBottom: hp(2)
					}}
				/>
			) : (
				<>
					<Tabs>
						<TabButton title='Friends' active={activeTab === 'friends'} onPress={() => setActiveTab('friends')} />
						<TabButton title={`Requests (${friendRequests.length})`} active={activeTab === 'requests'} onPress={() => setActiveTab('requests')} />
					</Tabs>

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
				</>
			)}
		</ScreenWrapper>
	)
}

export default Friends

const styles = StyleSheet.create({
	tabsContainer: {
		marginBottom: 20
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
	},
	alreadyFriend: {
		color: theme.colors.green,
		fontWeight: theme.fonts.bold
	},
	addButton: {
		backgroundColor: theme.colors.primary,
		padding: hp(1.2),
		borderRadius: theme.radius.sm
	}
})
