import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { hp } from '@/helpers/common'
import { Entry, User } from '@/utils/types'
import EntryListItem from './EntryListItem'

interface EntryListProps {
	entries: Entry[]
	currentUserId: number
	onRefresh: () => void
	isRefreshing: boolean
	onLikeEntry?: (entryId: number) => void
	onReplyEntry?: (parentEntry: Entry) => void
	onDeleteEntry?: (entryId: number) => void
	onShareEntry?: (entry: Entry) => void
	onEditEntry?: (entry: Entry) => void
	onUserPress?: (user: User) => void
}

const EntryList: React.FC<EntryListProps> = ({ entries, currentUserId, onRefresh, isRefreshing, onLikeEntry, onReplyEntry, onDeleteEntry, onShareEntry, onEditEntry, onUserPress }) => {
	const renderItem = ({ item }: { item: Entry }) => <EntryListItem entry={item} currentUserId={currentUserId} onLikeEntry={onLikeEntry} onReplyEntry={onReplyEntry} onDeleteEntry={onDeleteEntry} onShareEntry={onShareEntry} onEditEntry={onEditEntry} onUserPress={onUserPress} />

	return <FlatList data={entries} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent} onRefresh={onRefresh} refreshing={isRefreshing} />
}

const styles = StyleSheet.create({
	listContent: {
		paddingVertical: hp(2)
	}
})

export default EntryList
