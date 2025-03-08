import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'
import React, { useRef } from 'react'
import { View, Text, StyleProp, ViewStyle, TextStyle, Pressable, StyleSheet, Animated } from 'react-native'
import Loading from './Loading'

interface ButtonProps {
	buttonStyle?: StyleProp<ViewStyle>
	textStyle?: StyleProp<TextStyle>
	title?: string
	onPress?: () => void
	loading?: boolean
	hasShadow?: boolean
}

const Button: React.FC<ButtonProps> = ({ buttonStyle, textStyle, title = '', onPress = () => {}, loading = false, hasShadow = true }) => {
	const shadowStyle: StyleProp<ViewStyle> = {
		shadowColor: theme.colors.dark,
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4
	}
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

	if (loading) {
		return (
			<View style={[styles.button, buttonStyle, { backgroundColor: 'white' }]}>
				<Loading />
			</View>
		)
	}
	return (
		<Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
			<Pressable style={[styles.button, buttonStyle, hasShadow && shadowStyle]} onPress={onPress} disabled={loading} onPressIn={handlePressIn} onPressOut={handlePressOut}>
				<View>
					<Text style={[styles.text, textStyle]}>{loading ? 'Loading...' : title}</Text>
				</View>
			</Pressable>
		</Animated.View>
	)
}

export default Button

const styles = StyleSheet.create({
	button: {
		backgroundColor: theme.colors.primary,
		height: hp(6.6),
		justifyContent: 'center',
		alignItems: 'center',
		borderCurve: 'continuous',
		borderRadius: theme.radius.xl
	},
	text: {
		fontSize: hp(2.5),
		color: 'white',
		fontWeight: theme.fonts.bold
	}
})
