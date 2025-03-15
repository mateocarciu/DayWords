import React from 'react'
import { FlatList, StyleSheet, View, Text, RefreshControl } from 'react-native'
import { hp } from '@/helpers/common'
import { Entry, User } from '@/utils/types'
import EntryListItem from './EntryListItem'
import { Feather } from '@expo/vector-icons'

interface EntryListProps {
	entries: Entry[]
	currentUserId: number
	onRefresh: () => void
	isRefreshing: boolean
	refreshControl?: React.ReactElement
	onLikeEntry?: (entryId: number) => void
	onReplyEntry?: (parentEntry: Entry) => void
	onDeleteEntry?: (entryId: number) => void
	onShareEntry?: (entry: Entry) => void
	onEditEntry?: (entry: Entry) => void
	onUserPress?: (user: User) => void
}

const EntryList: React.FC<EntryListProps> = ({ entries, currentUserId, onRefresh, isRefreshing, onLikeEntry, onReplyEntry, onDeleteEntry, onShareEntry, onEditEntry, onUserPress }) => {
	const renderItem = ({ item }: { item: Entry }) => <EntryListItem entry={item} currentUserId={currentUserId} onLikeEntry={onLikeEntry} onReplyEntry={onReplyEntry} onDeleteEntry={onDeleteEntry} onShareEntry={onShareEntry} onEditEntry={onEditEntry} onUserPress={onUserPress} />

	if (entries.length === 0) {
		return (
			<FlatList
				data={[]}
				renderItem={null}
				keyExtractor={() => 'key'}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.emptyContainer}
				onRefresh={onRefresh}
				refreshing={isRefreshing}
				ListEmptyComponent={
					<View style={styles.emptyContent}>
						<Feather name='clock' size={40} color='gray' />
						<Text style={styles.emptyText}>You haven't posted yet !</Text>
					</View>
				}
			/>
		)
	}

	return <FlatList data={entries} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent} onRefresh={onRefresh} refreshing={isRefreshing} />
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
	}
})

export default EntryList
