import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'

type TabButtonProps = {
	title: string
	active: boolean
	onPress: () => void
}

const TabButton = ({ title, active, onPress }: TabButtonProps) => {
	return (
		<TouchableOpacity style={[styles.tab, active && styles.activeTab]} onPress={onPress}>
			<Text style={[styles.tabText, active && styles.activeTabText]}>{title}</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	tab: {
		flex: 1,
		paddingVertical: hp(1.2),
		borderBottomWidth: 2,
		borderBottomColor: theme.colors.light,
		alignItems: 'center'
	},
	activeTab: {
		borderBottomColor: theme.colors.primary
	},
	tabText: {
		color: theme.colors.textLight,
		fontSize: hp(1.8),
		fontWeight: theme.fonts.medium
	},
	activeTabText: {
		color: theme.colors.primary,
		fontWeight: theme.fonts.semibold
	}
})

export default TabButton
