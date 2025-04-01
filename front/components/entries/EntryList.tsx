import React, { useEffect } from 'react'
import { FlatList, StyleSheet, View, Text, RefreshControl } from 'react-native'
import { hp } from '@/helpers/common'
import { Entry, User } from '@/utils/types'
import EntryListItem from './EntryListItem'
import { Feather } from '@expo/vector-icons'
import useEntries from '@/hooks/useEntries'
import { useAuth } from '@/contexts/AuthContext'
import { Keyboard } from 'react-native'

interface EntryListProps {
	onLikeEntry?: (entryId: number) => void
	onReplyEntry?: (parentEntry: Entry) => void
	onDeleteEntry?: (entryId: number) => void
	onShareEntry?: (entry: Entry) => void
	onEditEntry?: (entry: Entry) => void
	onUserPress?: (user: User) => void
	showEditDelete?: boolean
	entryId?: number
}

const EntryList: React.FC<EntryListProps> = ({ onLikeEntry, onReplyEntry, onDeleteEntry, onShareEntry, onEditEntry, onUserPress, showEditDelete = false, entryId }) => {
	const authContext = useAuth()

	if (!authContext) {
		console.error('AuthContext is not found')
		return null
	}
	const { user } = authContext
	const { entries, entry, isRefreshing, fetchEntries, deleteEntry, fetchEntry } = useEntries(user?.id)

	onDeleteEntry = async (entryId: number) => {
		await deleteEntry(entryId)
	}

	useEffect(() => {
		if (entryId) {
			fetchEntry(entryId)
		} else {
			fetchEntries()
		}
	}, [entryId])

	const renderItem = ({ item }: { item: Entry }) => <EntryListItem entry={item} currentUserId={user?.id ?? 0} onLikeEntry={onLikeEntry} onReplyEntry={onReplyEntry} onDeleteEntry={onDeleteEntry} onShareEntry={onShareEntry} onEditEntry={onEditEntry} onUserPress={onUserPress} showEditDelete={showEditDelete} />

	return <FlatList data={entryId ? (entry ? [entry] : []) : entries} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={entryId ? () => fetchEntry(entryId) : fetchEntries} />} onScrollBeginDrag={Keyboard.dismiss} />
}

const styles = StyleSheet.create({
	listContent: {
		// paddingVertical: hp(2)
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
