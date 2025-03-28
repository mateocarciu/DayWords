import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import { Feather } from '@expo/vector-icons'
import { Entry } from '@/utils/types'

interface EntryActionsProps {
	entry: Entry
	isOwnEntry: boolean
	showEditDelete?: boolean
	onLikeEntry?: (entryId: number) => void
	onReplyEntry?: (parentEntry: Entry) => void
	onShareEntry?: () => void
	onEditEntry?: (entry: Entry) => void
	onDeleteEntry?: (entryId: number) => void
}

const EntryActions: React.FC<EntryActionsProps> = ({ entry, isOwnEntry, showEditDelete = false, onLikeEntry, onReplyEntry, onShareEntry, onEditEntry, onDeleteEntry }) => {
	return (
		<View style={styles.actionsContainer}>
			<TouchableOpacity style={styles.actionButton} onPress={() => onLikeEntry && onLikeEntry(entry.id)}>
				<Feather name='heart' size={hp(2.2)} color={theme.colors.textLight} />
			</TouchableOpacity>

			<TouchableOpacity style={styles.actionButton} onPress={() => onReplyEntry && onReplyEntry(entry)}>
				<Feather name='message-circle' size={hp(2.2)} color={theme.colors.textLight} />
				{entry.child_entries && entry.child_entries.length > 0 && <Text style={styles.actionCount}>{entry.child_entries.length}</Text>}
			</TouchableOpacity>

			<TouchableOpacity style={styles.actionButton} onPress={onShareEntry}>
				<Feather name='share' size={hp(2.2)} color={theme.colors.textLight} />
			</TouchableOpacity>

			{isOwnEntry && showEditDelete && (
				<TouchableOpacity style={styles.actionButton} onPress={() => onEditEntry && onEditEntry(entry)}>
					<Feather name='edit-2' size={hp(2.2)} color={theme.colors.textLight} />
				</TouchableOpacity>
			)}

			{isOwnEntry && showEditDelete && (
				<TouchableOpacity style={styles.actionButton} onPress={() => onDeleteEntry && onDeleteEntry(entry.id)}>
					<Feather name='trash-2' size={hp(2.2)} color={theme.colors.textLight} />
				</TouchableOpacity>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
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
	}
})

export default EntryActions
