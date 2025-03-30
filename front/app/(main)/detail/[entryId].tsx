import { Feather } from '@expo/vector-icons'
import Header from '@/components/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useLocalSearchParams } from 'expo-router'
import { StyleSheet } from 'react-native'
import EntryList from '@/components/entries/EntryList'

const Detail = () => {
	const { entryId } = useLocalSearchParams()

	return (
		<ScreenWrapper autoDismissKeyboard={false}>
			<Header title='Detail' marginBottom={30} />
			<EntryList entryId={Number(entryId)} onLikeEntry={() => {}} onReplyEntry={() => {}} onDeleteEntry={() => {}} onShareEntry={() => {}} onEditEntry={() => {}} onUserPress={() => {}} showEditDelete={true} />
		</ScreenWrapper>
	)
}

export default Detail

const styles = StyleSheet.create({
	headerContainer: {
		marginBottom: 20
	}
})
