import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'
import { Entry } from '@/utils/types'
import EntryActions from './EntryActions'
import { formatEntryDate } from '@/utils/dateFormatters'

interface ThreadEntryItemProps {
	entry: Entry
	currentUserId: number
	onLikeEntry?: (entryId: number) => void
	onReplyEntry?: (parentEntry: Entry) => void
	onShareEntry?: (entry: Entry) => void
}

const ThreadEntryItem: React.FC<ThreadEntryItemProps> = ({ entry, currentUserId, onLikeEntry, onReplyEntry, onShareEntry }) => {
	const isCurrentUser = entry.user_id === currentUserId

	const handleShare = () => {
		if (onShareEntry) {
			onShareEntry(entry)
		}
	}

	return (
		<View style={[styles.threadEntry]}>
			<View style={styles.entryContent}>
				<Text style={styles.entryText}>{entry.text}</Text>
				<Text style={styles.date}>{formatEntryDate(entry.created_at)}</Text>
			</View>

			<EntryActions entry={entry} isOwnEntry={isCurrentUser} onLikeEntry={onLikeEntry} onReplyEntry={onReplyEntry} onShareEntry={handleShare} />
		</View>
	)
}

const styles = StyleSheet.create({
	threadEntry: {
		backgroundColor: theme.colors.light,
		borderRadius: theme.radius.md,
		shadowColor: theme.colors.dark,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
		padding: hp(1.5),
		marginBottom: hp(1)
	},
	entryContent: {
		marginBottom: hp(1.5)
	},
	entryText: {
		color: theme.colors.text,
		fontSize: hp(2),
		lineHeight: hp(2.8)
	},
	date: {
		color: theme.colors.textLight,
		fontSize: hp(1.6)
	}
})

export default ThreadEntryItem
