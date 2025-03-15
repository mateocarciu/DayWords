import React, { useRef } from 'react'
import { Animated, Pressable, StyleSheet } from 'react-native'
import { hp, wp } from '@/helpers/common'
import { Feather } from '@expo/vector-icons'
import AntDesign from '@expo/vector-icons/AntDesign'
import { theme } from '@/constants/theme'

interface FloatingButtonProps {
	onPress: () => void
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onPress }) => {
	const scaleValue = useRef(new Animated.Value(1)).current

	const handlePressIn = () => {
		Animated.spring(scaleValue, {
			toValue: 0.9,
			useNativeDriver: true
		}).start()
	}

	const handlePressOut = () => {
		Animated.spring(scaleValue, {
			toValue: 1,
			friction: 3,
			useNativeDriver: true
		}).start()
	}

	return (
		<Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleValue }] }]}>
			<Pressable style={styles.button} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
				<Feather name='edit' size={hp(3)} color='#fff' />
			</Pressable>
		</Animated.View>
	)
}

export default FloatingButton

const styles = StyleSheet.create({
	buttonContainer: {
		position: 'absolute',
		zIndex: 100,
		right: wp(0),
		bottom: hp(4),
		backgroundColor: theme.colors.primary,
		borderRadius: 50,
		elevation: 5
	},
	button: {
		width: hp(6.5),
		height: hp(6.5),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50
	}
})
