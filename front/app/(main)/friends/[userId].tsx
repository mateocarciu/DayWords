import { Feather } from '@expo/vector-icons'
import Header from '@/components/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useLocalSearchParams } from 'expo-router'
import { StyleSheet } from 'react-native'

const User = () => {
	const { entryId } = useLocalSearchParams()

	console.log(entryId)

	return (
		<ScreenWrapper autoDismissKeyboard={false}>
			<Header title='User' marginBottom={30} />
		</ScreenWrapper>
	)
}

export default User

const styles = StyleSheet.create({
	headerContainer: {
		marginBottom: 20
	}
})
