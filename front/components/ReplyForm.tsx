// ReplyForm.tsx
import React from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import { Ionicons } from '@expo/vector-icons'

interface ReplyFormProps {
	replyText: string
	onChangeText: (text: string) => void
	onSend: () => void
}

const ReplyForm: React.FC<ReplyFormProps> = ({ replyText, onChangeText, onSend }) => {
	return (
		<View style={styles.replyForm}>
			<TextInput style={styles.replyInput} placeholder='Écrire une réponse...' value={replyText} onChangeText={onChangeText} multiline />
			<TouchableOpacity style={styles.sendButton} onPress={onSend}>
				<Ionicons name='send' size={hp(2.2)} color={theme.colors.primary} />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	replyForm: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	replyInput: {
		flex: 1,
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

export default ReplyForm
