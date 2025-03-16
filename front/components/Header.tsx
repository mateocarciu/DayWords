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
	reverse?: boolean
}

const Header: React.FC<HeaderProps> = ({ title = 'Screen', showBackButton = true, marginBottom = 10, reverse = false }) => {
	const router = useRouter()
	return (
		<View style={[styles.container, { marginBottom: marginBottom, flexDirection: reverse ? 'row-reverse' : 'row' }]}>
			{showBackButton && (
				<View style={[styles.backButton, reverse && styles.backButtonReverse]}>
					<BackButton onPress={() => router.back()} reverse={reverse} />
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
	backButtonReverse: {
		left: 'auto',
		right: 0
	},
	title: {
		fontSize: hp(2.7),
		fontWeight: theme.fonts.semibold,
		color: theme.colors.textDark
	}
})
