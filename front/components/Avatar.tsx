import React from 'react'
import { StyleProp, StyleSheet, View, Text, ViewStyle } from 'react-native'
import { Image, ImageStyle } from 'expo-image'
import { theme } from '@/constants/theme'

interface AvatarProps {
	uri?: string | undefined | null
	username: string
	size?: number
	rounded?: number
	style?: StyleProp<ViewStyle>
}

const Avatar: React.FC<AvatarProps> = ({ uri, size = 50, rounded = 25, style, username }) => {
	if (!uri) {
		return (
			<View style={[styles.placeholder, { width: size, height: size, borderRadius: rounded }, style]}>
				<Text style={[styles.initial, { fontSize: size / 2 }]}>{username.charAt(0).toUpperCase()}</Text>
			</View>
		)
	} else {
		return <Image source={uri} transition={100} style={[styles.avatar, { width: size, height: size, borderRadius: rounded }]} />
	}
}

export default Avatar

const styles = StyleSheet.create({
	avatar: {
		borderCurve: 'continuous',
		borderColor: theme.colors.darkLight,
		borderWidth: 1
	},
	placeholder: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.light,
		borderColor: theme.colors.darkLight,
		borderWidth: 1
	},
	initial: {
		color: theme.colors.dark,
		fontWeight: 'bold'
	}
})
