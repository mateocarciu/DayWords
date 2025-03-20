// EmotionBadge.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'

interface EmotionBadgeProps {
	emotion: string | null
}

const EmotionBadge: React.FC<EmotionBadgeProps> = ({ emotion }) => {
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

const styles = StyleSheet.create({
	emotionBadge: {
		paddingHorizontal: wp(2),
		paddingVertical: hp(0.4),
		borderRadius: theme.radius.lg
	},
	emotionText: {
		color: theme.colors.light,
		fontSize: hp(1.6),
		fontWeight: theme.fonts.medium
	}
})

export default EmotionBadge
