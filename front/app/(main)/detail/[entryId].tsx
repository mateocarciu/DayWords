import { Feather } from '@expo/vector-icons'
import Header from '@/components/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useLocalSearchParams } from 'expo-router'
import { StyleSheet } from 'react-native'

const Detail = () => {
	const { entryId } = useLocalSearchParams()

	console.log(entryId)

	return (
		<ScreenWrapper autoDismissKeyboard={false}>
			<Header title='Detail' marginBottom={30} />
		</ScreenWrapper>
	)
}

export default Detail

const styles = StyleSheet.create({
	headerContainer: {
		marginBottom: 20
	}
})
