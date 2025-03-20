import { Feather } from '@expo/vector-icons'
import { theme } from '@/constants/theme'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

interface BackButtonProps {
	size?: number
	onPress?: () => void
	reverse?: boolean
}

const BackButton: React.FC<BackButtonProps> = ({ size = 25, onPress = () => {}, reverse = false }) => {
	return (
		<TouchableOpacity onPress={onPress} style={styles.button}>
			<Feather name={reverse ? 'chevron-right' : 'chevron-left'} strokeWidth={2} size={size} color={theme.colors.text} />
		</TouchableOpacity>
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
