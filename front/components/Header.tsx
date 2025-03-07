import { useRouter } from 'expo-router'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import BackButton from './BackButton'
import { hp } from '@/helpers/common'
import { theme } from '@/constants/theme'

interface HeaderProps {
	title: string
	showBackButton?: boolean
	marginBottom?: number
}

const Header: React.FC<HeaderProps> = ({ title = 'Screen', showBackButton = true, marginBottom = 10 }) => {
	const router = useRouter()
	return (
		<View style={[styles.container, { marginBottom: marginBottom }]}>
			{showBackButton && (
				<View style={styles.backButton}>
					<BackButton onPress={() => router.back()} />
				</View>
			)}
			<Text style={styles.title}>{title}</Text>
		</View>
	)
}

export default Header

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 5,
		gap: 10
	},
	backButton: {
		position: 'absolute',
		left: 0
	},
	title: {
		fontSize: hp(2.7),
		fontWeight: theme.fonts.semibold,
		color: theme.colors.textDark
	}
})
