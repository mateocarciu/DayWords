import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import Avatar from '@/components/Avatar'
import { Entry, User } from '@/utils/types'
import { Feather } from '@expo/vector-icons'
import ThreadEntries from './ThreadEntries'
import ReplyForm from '../inputs/ReplyForm'
import EmotionBadge from './EmotionBadge'
import EntryActions from './EntryActions'
import { formatEntryDate } from '@/utils/dateFormatters'

interface EntryListItemProps {
	entry: Entry
	currentUserId: number
	showEditDelete?: boolean
	onLikeEntry?: (entryId: number) => void
	onReplyEntry?: (parentEntry: Entry) => void
	onDeleteEntry?: (entryId: number) => void
	onShareEntry?: (entry: Entry) => void
	onEditEntry?: (entry: Entry) => void
	onUserPress?: (user: User) => void
}

const EntryListItem: React.FC<EntryListItemProps> = ({ entry, currentUserId, showEditDelete, onLikeEntry, onReplyEntry, onDeleteEntry, onShareEntry, onEditEntry, onUserPress }) => {
	const [replyText, setReplyText] = useState<string>('')
	const isCurrentUser = entry.user_id === currentUserId
	const hasThreads = entry.child_entries && entry.child_entries.length > 0

	const handleShare = () => {
		if (onShareEntry) {
			onShareEntry(entry)
		} else {
			Share.share({
				message: `${entry.user.username}: ${entry.text}`,
				title: 'Partager cette entrée'
			})
		}
	}

	const handleReply = () => {
		if (onReplyEntry && replyText) {
			const replyEntry: Entry = {
				...entry,
				id: Math.random(),
				text: replyText,
				parent_entry_id: entry.id,
				user_id: currentUserId,
				child_entries: []
			}
			onReplyEntry(replyEntry)
			setReplyText('')
		}
	}

	return (
		<TouchableOpacity onPress={() => onUserPress && onUserPress(entry.user)}>
			<View style={styles.entryWithThreadsContainer}>
				<View style={[styles.entryContainer, isCurrentUser && styles.currentUserEntry]}>
					<View style={styles.entryHeader}>
						<TouchableOpacity style={styles.userInfoContainer} onPress={() => onUserPress && onUserPress(entry.user)}>
							<Avatar username={entry.user.username ?? ''} size={hp(5)} rounded={theme.radius.md} />
							<View style={styles.userInfo}>
								<Text style={[styles.username, isCurrentUser && styles.currentUserText]}>{entry.user.username}</Text>
								<Text style={styles.date}>{formatEntryDate(entry.created_at)}</Text>
							</View>
						</TouchableOpacity>

						<EmotionBadge emotion={entry.emotion} />
					</View>

					<View style={styles.entryContent}>
						<Text style={styles.entryText}>{entry.text}</Text>

						{entry.location && (
							<View style={styles.locationContainer}>
								<Feather name='map-pin' size={hp(1.8)} color={theme.colors.textLight} />
								<Text style={styles.locationText}>{entry.location}</Text>
							</View>
						)}
					</View>

					<EntryActions entry={entry} isOwnEntry={isCurrentUser} onLikeEntry={onLikeEntry} onReplyEntry={onReplyEntry} onShareEntry={handleShare} onEditEntry={onEditEntry} onDeleteEntry={onDeleteEntry} showEditDelete={showEditDelete} />
				</View>

				{hasThreads && <ThreadEntries entries={entry.child_entries} currentUserId={currentUserId} onLikeEntry={onLikeEntry} onReplyEntry={onReplyEntry} onShareEntry={onShareEntry} />}

				<View style={styles.replyFormContainer}>
					{entry.more_entries > 0 && (
						<TouchableOpacity style={styles.moreEntriesChip} onPress={() => onReplyEntry && onReplyEntry(entry)}>
							<Text style={styles.moreEntriesChipText}>+{entry.more_entries} posts</Text>
						</TouchableOpacity>
					)}
					{!isCurrentUser && <ReplyForm replyText={replyText} onChangeText={setReplyText} onSend={handleReply} />}
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	entryWithThreadsContainer: {
		marginBottom: hp(3)
	},
	entryContainer: {
		backgroundColor: theme.colors.light,
		borderRadius: theme.radius.md,
		borderWidth: 1,
		borderColor: theme.colors.lightDark,
		padding: hp(2),
		marginBottom: hp(0.5),
		overflow: 'hidden'
	},
	currentUserEntry: {
		borderLeftWidth: 3,
		borderLeftColor: theme.colors.primary
	},
	replyFormContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: hp(0.5)
	},
	entryHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: hp(1.5)
	},
	userInfoContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	userInfo: {
		marginLeft: wp(2)
	},
	username: {
		fontWeight: theme.fonts.semibold,
		color: theme.colors.text,
		fontSize: hp(2)
	},
	currentUserText: {
		color: theme.colors.primary
	},
	date: {
		color: theme.colors.textLight,
		fontSize: hp(1.6)
	},
	entryContent: {
		marginBottom: hp(1.5)
	},
	entryText: {
		color: theme.colors.text,
		fontSize: hp(2),
		lineHeight: hp(2.8)
	},
	locationContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: hp(1)
	},
	locationText: {
		color: theme.colors.textLight,
		fontSize: hp(1.6),
		marginLeft: wp(1)
	},
	moreEntriesChip: {
		marginRight: wp(2),
		paddingVertical: hp(1),
		paddingHorizontal: wp(3),
		backgroundColor: theme.colors.light,
		borderRadius: theme.radius.md
		// borderWidth: 1
		// borderColor: theme.colors.lightDark
	},
	moreEntriesChipText: {
		color: theme.colors.primary,
		fontSize: hp(1.6),
		fontWeight: theme.fonts.medium
	}
})

export default EntryListItem
