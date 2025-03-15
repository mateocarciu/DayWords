import { Feather } from '@expo/vector-icons'
import { theme } from '@/constants/theme'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

interface BackButtonProps {
	size?: number
	onPress?: () => void
}

const BackButton: React.FC<BackButtonProps> = ({ size = 25, onPress = () => {} }) => {
	return (
		<Pressable onPress={onPress} style={styles.button}>
			<Feather name='chevron-left' strokeWidth={2} size={size} color={theme.colors.text} />
		</Pressable>
	)
}

export default BackButton

const styles = StyleSheet.create({
	button: {
		alignSelf: 'flex-start',
		padding: 5,
		borderRadius: theme.radius.sm,
		backgroundColor: 'rgba(0,0,0,0.07)'
	}
})
