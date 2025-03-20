import React from 'react'
import { View, StyleSheet } from 'react-native'
import { theme } from '@/constants/theme'
import { wp } from '@/helpers/common'
import { Entry } from '@/utils/types'
import ThreadEntryItem from './ThreadEntryItem'

interface ThreadEntriesProps {
	entries: Entry[]
	currentUserId: number
	onLikeEntry?: (entryId: number) => void
	onReplyEntry?: (parentEntry: Entry) => void
	onShareEntry?: (entry: Entry) => void
}

const ThreadEntries: React.FC<ThreadEntriesProps> = ({ entries, currentUserId, onLikeEntry, onReplyEntry, onShareEntry }) => {
	return (
		<View style={styles.threadsContainer}>
			<View style={styles.threadLine} />
			<View style={styles.threadEntries}>
				{entries.map((entry) => (
					<ThreadEntryItem key={entry.id.toString()} entry={entry} currentUserId={currentUserId} onLikeEntry={onLikeEntry} onReplyEntry={onReplyEntry} onShareEntry={onShareEntry} />
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
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
	}
})

export default ThreadEntries
