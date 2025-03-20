import React from 'react'
import { FlatList, StyleSheet, View, Text, RefreshControl } from 'react-native'
import { hp } from '@/helpers/common'
import { Entry, User } from '@/utils/types'
import EntryListItem from './EntryListItem'
import { Feather } from '@expo/vector-icons'
import useEntries from '@/hooks/useEntries'
import { useAuth } from '@/contexts/AuthContext'

interface EntryListProps {
	onLikeEntry?: (entryId: number) => void
	onReplyEntry?: (parentEntry: Entry) => void
	onDeleteEntry?: (entryId: number) => void
	onShareEntry?: (entry: Entry) => void
	onEditEntry?: (entry: Entry) => void
	onUserPress?: (user: User) => void
}

const EntryList: React.FC<EntryListProps> = ({ onLikeEntry, onReplyEntry, onDeleteEntry, onShareEntry, onEditEntry, onUserPress }) => {
	const authContext = useAuth()

	if (!authContext) {
		console.error('AuthContext is not found')
		return null
	}
	const { user } = authContext
	const { entries, isRefreshing, fetchEntries } = useEntries(user?.id)

	const renderItem = ({ item }: { item: Entry }) => <EntryListItem entry={item} currentUserId={user?.id ?? 0} onLikeEntry={onLikeEntry} onReplyEntry={onReplyEntry} onDeleteEntry={onDeleteEntry} onShareEntry={onShareEntry} onEditEntry={onEditEntry} onUserPress={onUserPress} />

	if (entries.length === 0) {
		return (
			<FlatList
				data={[]}
				renderItem={null}
				keyExtractor={() => 'key'}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.emptyContainer}
				refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={fetchEntries} />}
				ListEmptyComponent={
					<View style={styles.emptyContent}>
						<Feather name='clock' size={40} color='gray' />
						<Text style={styles.emptyText}>You haven't posted yet !</Text>
					</View>
				}
			/>
		)
	}

	return <FlatList data={entries} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={fetchEntries} />} />
}

const styles = StyleSheet.create({
	listContent: {
		paddingVertical: hp(2)
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	emptyContent: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	emptyText: {
		marginTop: 10,
		fontSize: 16,
		color: 'gray'
	},
	loaderContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default EntryList
