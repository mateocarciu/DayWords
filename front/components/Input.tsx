import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'
import { View, StyleSheet, TextInput, TextInputProps } from 'react-native'

interface InputProps extends TextInputProps {
	icon?: React.ReactNode
	inputRef?: React.Ref<TextInput>
	height?: number
	borderWidth?: number
}

const Input: React.FC<InputProps> = ({ height = hp(7.2), borderWidth = 0.4, icon, inputRef, ...props }) => {
	return (
		<View style={[styles.container, { height, borderWidth }]}>
			{icon && icon}
			<TextInput ref={inputRef && inputRef} style={{ flex: 1 }} placeholderTextColor={theme.colors.textLight} {...props} />
		</View>
	)
}

export default Input

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: theme.colors.text,
		borderRadius: theme.radius.sm,
		paddingHorizontal: 18,
		gap: 12
	}
})
