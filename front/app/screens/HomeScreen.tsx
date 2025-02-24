import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useUser } from '../hooks/UserContext'
import * as Haptics from 'expo-haptics'
import ProfilePicture from '../components/ProfilePicture'
import GetTimeAgo from '../components/GetTimeAgo'
// import useEcho from "../hooks/Echo";
import { RootStackParamList, Entry, FriendEntry } from '../utils/types'
import { StackNavigationProp } from '@react-navigation/stack'
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>

const HomeScreen = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
	const { user } = useUser()
	const [text, setText] = useState('')

	const [userEntries, setUserEntries] = useState<Entry[]>([])
	const [friendsEntries, setFriendsEntries] = useState<FriendEntry[]>([])
	const [isRefreshing, setRefreshing] = useState(false)
	// const [echo, setEcho] = useState(null);

	useEffect(() => {
		if (user?.token) {
			fetchEntries()
		}
	}, [user])

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		setTimeout(() => {
			fetchEntries()
			setRefreshing(false)
		}, 2000)
	}, [user])

	// useEffect(() => {
	//   const echoInstance = useEcho(user.token);
	//   setEcho(echoInstance);
	// }, [user]);

	// useEffect(() => {
	//   if (echo && user && user.data && user.data.id) {
	//     echo.connector.socket.on('connect', () => {
	//       console.log('Connected to WebSocket server');
	//     });

	//     echo.connector.socket.on('disconnect', () => {
	//       console.log('Disconnected from WebSocket server');
	//     });

	//     echo.connector.socket.on('error', (error) => {
	//       console.error('WebSocket Error:', error);
	//     });

	//     const userId = user.data.id;
	//     const channel = echo.private(`newEntry`);
	//     channel.listen('NewEntry', (event) => { // Supprimer le '.' devant NewEntry
	//       Alert.alert(
	//         'Nouvelle entrée',
	//         `${event.sender.username} a posté une nouvelle entrée`
	//       );
	//       fetchEntries();
	//     });

	//     return () => {
	//       channel.stopListening('.NewEntry');
	//       echo.connector.socket.off('connect');
	//       echo.connector.socket.off('disconnect');
	//       echo.connector.socket.off('error');
	//     };
	//   }
	// }, [echo, user]);

	const fetchEntries = async () => {
		try {
			const response = await fetch(`${process.env.API_URL}/api/entries`, {
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${user?.token}`
				}
			})
			const data = await response.json()
			setUserEntries(data.entries)
			setFriendsEntries(data.friend_entries)
		} catch (error) {
			console.error('Error fetching user entries:', error)
			Alert.alert('Error', 'Failed to fetch user entries.')
		}
	}

	const handleSaveEntry = async (parentEntryId: number | null = null) => {
		if (text.trim() === '') {
			Alert.alert('Erreur', 'Please type something before saving.')
			return
		}

		Haptics.selectionAsync()
		const newEntryData = {
			text,
			parent_entry_id: parentEntryId
		}

		try {
			await saveEntry(newEntryData)
			setText('')
			fetchEntries()
		} catch (error) {
			console.error('Error saving entry:', error)
			Alert.alert('Error', 'Could not save entry.')
		}
	}

	const addThreadEntry = () => {
		const parentEntryId = userEntries[0]?.id
		handleSaveEntry(parentEntryId)
	}

	const saveEntry = async (entryData: object) => {
		try {
			const response = await fetch(`${process.env.API_URL}/api/entries`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${user?.token}`
				},
				body: JSON.stringify(entryData)
			})
			return await response.json()
		} catch (error) {
			console.error('Error saving entry:', error)
			Alert.alert('Error', 'Could not save entry.')
			throw new Error('Failed to save entry')
		}
	}

	const navigateToDetail = (entryId: number) => {
		Haptics.selectionAsync()
		navigation.navigate('Detail', { entryId })
	}

	const navigateToUserProfile = (userId: number) => {
		Haptics.selectionAsync()
		navigation.navigate('UserProfile', { userId })
	}

	const renderUserEntry = ({ item: entry }: { item: Entry }) => (
		<TouchableOpacity style={styles.threadContainer} onPress={() => navigateToDetail(entry.id)}>
			<View style={styles.entry}>
				<Text style={styles.entryText}>{entry.text}</Text>
				<FontAwesome name='arrow-right' size={20} color='#6200ee' style={styles.entryIcon} />
			</View>
			<View>
				{entry.child_entries.slice(0, 1).map((child) => (
					<View key={child.id} style={styles.childContainer}>
						<View style={styles.threadLine} />
						<View style={styles.childEntry}>
							<Text style={styles.childEntryText}>{child.text}</Text>
						</View>
					</View>
				))}
				{entry.child_entries.length > 1 && (
					<View style={styles.childContainer}>
						<View style={styles.threadLine} />
						<View style={styles.childEntry}>
							<Text style={styles.childEntryText}>+{entry.child_entries.length - 1}</Text>
						</View>
					</View>
				)}
			</View>
		</TouchableOpacity>
	)

	const renderFriendEntry = ({ item: entry }: { item: FriendEntry }) => (
		<TouchableOpacity style={styles.threadContainer} onPress={() => navigateToDetail(entry.id)}>
			<View style={styles.friendEntry}>
				<TouchableOpacity onPress={() => navigateToUserProfile(entry.user.id)}>
					<ProfilePicture profileImageUrl={entry.user.profileImageUrl} username={entry.user.username} size={50} hasMarginRight />
				</TouchableOpacity>
				<View style={styles.friendTextContainer}>
					<Text style={styles.friendName}>{entry.user.username}</Text>
					<Text style={styles.friendText}>{entry.text || 'No entry today'}</Text>
					<Text style={styles.friendTime}>
						{GetTimeAgo(new Date(entry.created_at))} {entry.location}
					</Text>
				</View>
			</View>
			{entry.child_entries.slice(0, 1).map((child) => (
				<View key={child.id} style={styles.childContainer}>
					<View style={styles.threadLine} />
					<View style={styles.childEntry}>
						<Text style={styles.childEntryText}>{child.text}</Text>
						<Text style={styles.friendTime}>
							{GetTimeAgo(new Date(child.created_at))} {child.location}
						</Text>
					</View>
				</View>
			))}
			{entry.child_entries.length > 1 && (
				<View style={styles.childContainer}>
					<View style={styles.threadLine} />
					<View style={styles.childEntry}>
						<Text style={styles.childEntryText}>+{entry.child_entries.length - 1}</Text>
					</View>
				</View>
			)}
		</TouchableOpacity>
	)

	const renderHeader = () => (
		<>
			<View style={styles.yourWordsContainer}>
				<Text style={styles.yourWordsTitle}>Your Words</Text>
				<FlatList data={userEntries} renderItem={renderUserEntry} keyExtractor={(item) => item.id.toString()} ListEmptyComponent={null} scrollEnabled={false} />
				<View style={styles.inputContainer}>
					<TextInput placeholder={userEntries.length > 0 ? 'Need to type something else ?...' : 'Type something about your day...'} placeholderTextColor='#aaa' value={text} onChangeText={setText} style={styles.textArea} multiline={true} numberOfLines={4} />
					<TouchableOpacity style={[styles.button, text.trim() === '' && styles.buttonDisabled]} onPress={userEntries.length > 0 ? addThreadEntry : () => handleSaveEntry()} disabled={text.trim() === ''}>
						<MaterialIcons name='send' size={24} color='#fff' />
					</TouchableOpacity>
				</View>
			</View>
			<Text style={styles.friendsTitle}>Your Friends Words</Text>
		</>
	)

	const renderEmptyFriends = () => <Text style={styles.friendText}>No friends entries.</Text>

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.profileButton}
					onPress={() => {
						Haptics.selectionAsync()
						navigation.navigate('Profile')
					}}
				>
					<ProfilePicture profileImageUrl={user?.profileImageUrl ?? ''} username={user?.username ?? ''} size={50} />
				</TouchableOpacity>
				<Text style={styles.title} onPress={onRefresh}>
					DayWords
				</Text>
				<TouchableOpacity
					style={styles.friendsButton}
					onPress={() => {
						Haptics.selectionAsync()
						navigation.navigate('Friends')
					}}
				>
					<MaterialIcons name='group' size={28} color='#000000' />
				</TouchableOpacity>
			</View>

			<FlatList
				initialNumToRender={10}
				maxToRenderPerBatch={10}
				style={styles.flatList}
				data={friendsEntries}
				renderItem={renderFriendEntry}
				keyExtractor={(item) => item.id.toString()}
				ListHeaderComponent={renderHeader}
				ListEmptyComponent={renderEmptyFriends}
				showsVerticalScrollIndicator={false}
				refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#6200ee']} tintColor='#6200ee' />}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 20,
		paddingRight: 20
	},
	header: {
		position: 'absolute',
		top: 30,
		left: 0,
		right: 0,
		padding: 10,
		alignItems: 'center',
		zIndex: 1
	},
	friendsButton: {
		position: 'absolute',
		top: 22,
		left: 10,
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	profileButton: {
		position: 'absolute',
		top: 22,
		right: 20,
		width: 50,
		height: 50,
		borderRadius: 25,
		overflow: 'hidden',
		backgroundColor: '#6200ee',
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginVertical: 20,
		textAlign: 'center',
		color: '#333'
	},
	flatList: {
		marginTop: 100
	},
	yourWordsContainer: {
		marginBottom: 25
	},
	yourWordsTitle: {
		fontSize: 16,
		fontWeight: 'bold'
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 10,
		backgroundColor: '#fff',
		paddingHorizontal: 10,
		paddingVertical: 5,
		marginTop: 25
	},
	textArea: {
		flex: 1,
		paddingVertical: 10,
		color: '#333',
		textAlignVertical: 'top'
	},
	button: {
		backgroundColor: '#6200ee',
		padding: 10,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 10
	},
	buttonDisabled: {
		backgroundColor: '#aaa'
	},
	threadContainer: {
		marginTop: 25,
		paddingBottom: 10
	},
	entry: {
		padding: 20,
		borderRadius: 10,
		backgroundColor: '#fff',
		elevation: 5,
		flexDirection: 'row',
		alignItems: 'center'
	},
	entryText: {
		fontSize: 16,
		color: '#333',
		flex: 1
	},
	entryIcon: {
		marginLeft: 10
	},
	childContainer: {
		flexDirection: 'row',
		marginTop: 10
	},
	threadLine: {
		width: 2,
		backgroundColor: '#ddd',
		marginLeft: 28,
		marginTop: -5,
		marginBottom: -5
	},
	childEntry: {
		padding: 10,
		borderRadius: 10,
		backgroundColor: '#f9f9f9',
		marginLeft: 10,
		flex: 1
	},
	childEntryText: {
		fontSize: 14,
		color: '#555'
	},
	friendsTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 25
	},
	friendEntry: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 15,
		backgroundColor: '#fff',
		borderRadius: 10,
		paddingBottom: 15
	},
	friendTextContainer: {
		flex: 1
	},
	friendName: {
		fontSize: 16,
		fontWeight: 'bold'
	},
	friendText: {
		fontSize: 14,
		color: '#666'
	},
	friendTime: {
		fontSize: 12,
		color: '#999'
	}
})

export default HomeScreen
