import React from 'react'
import { Keyboard, StatusBar, TouchableWithoutFeedback, View, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Constants from 'expo-constants'

interface ScreenWrapperProps {
	children: React.ReactNode
	bg?: string
	autoDismissKeyboard?: boolean
	scrollEnabled?: boolean
}

const StatusBarHeight = Constants.statusBarHeight

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, bg = 'white', autoDismissKeyboard = true, scrollEnabled = false }) => {
	const { top } = useSafeAreaInsets()
	const paddingTop = top > 0 ? top + 5 : 30

	// Si le scroll est activé, ne pas utiliser TouchableWithoutFeedback
	const content = scrollEnabled ? (
		<View style={{ flex: 1 }}>{children}</View>
	) : (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!autoDismissKeyboard}>
			<View style={{ flex: 1 }}>{children}</View>
		</TouchableWithoutFeedback>
	)

	if (Platform.OS === 'android') {
		return (
			<View style={{ flex: 1, paddingTop: StatusBarHeight, backgroundColor: bg }}>
				<StatusBar barStyle='dark-content' hidden={false} networkActivityIndicatorVisible={true} />
				{content}
			</View>
		)
	}

	return <View style={{ flex: 1, paddingTop, backgroundColor: bg }}>{content}</View>
}

export default ScreenWrapper
