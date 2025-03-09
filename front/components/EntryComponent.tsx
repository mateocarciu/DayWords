import React, { useState, useRef } from 'react'
import { FlatList, View, Text, StyleSheet, TouchableOpacity, Animated, Image, TextInput, Share } from 'react-native'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import Avatar from '@/components/Avatar'
import { Entry, User } from '@/utils/types'
import { Ionicons, Feather } from '@expo/vector-icons'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface EntryComponentProps {
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

const EntryComponent: React.FC<EntryComponentProps> = ({ entries, currentUserId, onRefresh, isRefreshing, onLikeEntry, onReplyEntry, onDeleteEntry, onShareEntry, onEditEntry, onUserPress }) => {
	const [replyText, setReplyText] = useState<{ [key: number]: string }>({})

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const isToday = new Date().toDateString() === date.toDateString()

		if (isToday) {
			return formatDistanceToNow(date, { addSuffix: true, locale: fr })
		} else {
			return format(date, "d MMMM 'à' HH'h'mm", { locale: fr })
		}
	}

	const handleShare = (entry: Entry) => {
		if (onShareEntry) {
			onShareEntry(entry)
		} else {
			Share.share({
				message: `${entry.user.username}: ${entry.text}`,
				title: 'Partager cette entrée'
			})
		}
	}

	const renderActions = (entry: Entry) => {
		const isOwnEntry = entry.user_id === currentUserId

		return (
			<View style={styles.actionsContainer}>
				<TouchableOpacity style={styles.actionButton} onPress={() => onLikeEntry && onLikeEntry(entry.id)}>
					<Feather name='heart' size={hp(2.2)} color={theme.colors.textLight} />
				</TouchableOpacity>

				<TouchableOpacity style={styles.actionButton} onPress={() => onReplyEntry && onReplyEntry(entry)}>
					<Feather name='message-circle' size={hp(2.2)} color={theme.colors.textLight} />
					{entry.child_entries && entry.child_entries.length > 0 && <Text style={styles.actionCount}>{entry.child_entries.length}</Text>}
				</TouchableOpacity>

				<TouchableOpacity style={styles.actionButton} onPress={() => handleShare(entry)}>
					<Feather name='share' size={hp(2.2)} color={theme.colors.textLight} />
				</TouchableOpacity>

				{isOwnEntry && (
					<TouchableOpacity style={styles.actionButton} onPress={() => onEditEntry && onEditEntry(entry)}>
						<Feather name='edit-2' size={hp(2.2)} color={theme.colors.textLight} />
					</TouchableOpacity>
				)}

				{isOwnEntry && (
					<TouchableOpacity style={styles.actionButton} onPress={() => onDeleteEntry && onDeleteEntry(entry.id)}>
						<Feather name='trash-2' size={hp(2.2)} color={theme.colors.textLight} />
					</TouchableOpacity>
				)}
			</View>
		)
	}

	const renderEmotionBadge = (emotion: string | null) => {
		if (!emotion) return null

		const emotionColors: { [key: string]: string } = {
			HAPPY: '#4CAF50',
			SAD: '#5C6BC0',
			ANGRY: '#E53935',
			EXCITED: '#FF9800',
			RELAXED: '#00BCD4'
		}

		const bgColor = emotionColors[emotion] || theme.colors.textLight

		return (
			<View style={[styles.emotionBadge, { backgroundColor: bgColor }]}>
				<Text style={styles.emotionText}>{emotion}</Text>
			</View>
		)
	}

	const renderReplyForm = (entry: Entry) => {
		return (
			<View style={styles.replyForm}>
				<TextInput style={styles.replyInput} placeholder='Écrire une réponse...' value={replyText[entry.id] || ''} onChangeText={(text) => setReplyText((prev) => ({ ...prev, [entry.id]: text }))} multiline />
				<TouchableOpacity
					style={styles.sendButton}
					onPress={() => {
						if (onReplyEntry && replyText[entry.id]) {
							const replyEntry: Entry = {
								...entry,
								id: Math.random(),
								text: replyText[entry.id],
								parent_entry_id: entry.id,
								user_id: currentUserId,
								child_entries: []
							}
							onReplyEntry(replyEntry)

							setReplyText((prev) => ({ ...prev, [entry.id]: '' }))
						}
					}}
				>
					<Ionicons name='send' size={hp(2.2)} color={theme.colors.primary} />
				</TouchableOpacity>
			</View>
		)
	}

	const renderThreadEntry = (item: Entry) => {
		return (
			<View style={[styles.threadEntry]}>
				<View style={styles.entryContent}>
					<Text style={styles.entryText}>{item.text}</Text>
					<Text style={styles.date}>{formatDate(item.created_at)}</Text>
				</View>

				{renderActions(item)}
			</View>
		)
	}

	const renderItem = ({ item }: { item: Entry }) => {
		const isCurrentUser = item.user_id === currentUserId
		const hasThreads = item.child_entries && item.child_entries.length > 0

		return (
			<View style={styles.entryWithThreadsContainer}>
				<View style={[styles.entryContainer, isCurrentUser && styles.currentUserEntry]}>
					<View style={styles.entryHeader}>
						<TouchableOpacity style={styles.userInfoContainer} onPress={() => onUserPress && onUserPress(item.user)}>
							<Avatar username={item.user.username ?? ''} size={hp(5)} rounded={theme.radius.md} />
							<View style={styles.userInfo}>
								<Text style={[styles.username, isCurrentUser && styles.currentUserText]}>{item.user.username}</Text>
								<Text style={styles.date}>{formatDate(item.created_at)}</Text>
							</View>
						</TouchableOpacity>

						{renderEmotionBadge(item.emotion)}
					</View>

					<View style={styles.entryContent}>
						<Text style={styles.entryText}>{item.text}</Text>

						{item.location && (
							<View style={styles.locationContainer}>
								<Feather name='map-pin' size={hp(1.8)} color={theme.colors.textLight} />
								<Text style={styles.locationText}>{item.location}</Text>
							</View>
						)}
					</View>

					{renderActions(item)}
				</View>

				{hasThreads && (
					<View style={styles.threadsContainer}>
						<View style={styles.threadLine} />
						<View style={styles.threadEntries}>
							{item.child_entries.map((childItem) => (
								<View key={childItem.id.toString()}>{renderThreadEntry(childItem)}</View>
							))}
						</View>
					</View>
				)}

				<View style={styles.replyFormContainer}>
					<View />
					{renderReplyForm(item)}
				</View>
			</View>
		)
	}

	return <FlatList data={entries} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent} onRefresh={onRefresh} refreshing={isRefreshing} />
}

export default EntryComponent

const styles = StyleSheet.create({
	listContent: {
		paddingVertical: hp(2)
	},
	entryWithThreadsContainer: {
		marginBottom: hp(3)
	},
	entryContainer: {
		backgroundColor: theme.colors.light,
		borderRadius: theme.radius.md,
		shadowColor: theme.colors.dark,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		padding: hp(2),
		marginBottom: hp(0.5)
	},
	currentUserEntry: {
		borderLeftWidth: 3,
		borderLeftColor: theme.colors.primary
	},
	threadsContainer: {
		flexDirection: 'row',
		marginLeft: wp(8)
	},
	threadLine: {
		width: 2,
		backgroundColor: theme.colors.darkLight,
		marginRight: wp(2),
		borderRadius: 1
	},
	threadEntries: {
		flex: 1
	},
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
	currentUserThreadEntry: {
		backgroundColor: theme.colors.lightDark,
		borderLeftWidth: 2,
		borderLeftColor: theme.colors.primary
	},
	replyFormContainer: {
		flexDirection: 'row',
		marginLeft: wp(8),
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
	emotionBadge: {
		paddingHorizontal: wp(2),
		paddingVertical: hp(0.4),
		borderRadius: theme.radius.lg
	},
	emotionText: {
		color: theme.colors.light,
		fontSize: hp(1.6),
		fontWeight: theme.fonts.medium
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
	actionsContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: wp(5)
	},
	actionCount: {
		marginLeft: wp(1),
		fontSize: hp(1.8),
		color: theme.colors.textLight
	},
	replyForm: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.light,
		borderRadius: theme.radius.md,
		padding: hp(1),
		shadowColor: theme.colors.dark,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1
	},
	replyInput: {
		flex: 1,
		marginHorizontal: wp(2),
		backgroundColor: theme.colors.lightDark,
		borderRadius: theme.radius.md,
		paddingHorizontal: wp(3),
		paddingVertical: hp(1),
		fontSize: hp(1.8),
		maxHeight: hp(10)
	},
	sendButton: {
		padding: hp(1)
	}
})
