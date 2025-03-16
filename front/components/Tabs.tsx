import React from 'react'
import { View, StyleSheet } from 'react-native'

type TabsProps = {
	children: React.ReactNode
}

const Tabs = ({ children }: TabsProps) => {
	return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		marginBottom: 20
	}
})

export default Tabs
