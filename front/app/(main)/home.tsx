import FloatingButton from '@/components/FloatingButton'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useRouter } from 'expo-router'
import EntryList from '@/components/entry/EntryList'
import HomeHeader from '@/components/HomeHeader'

const home = () => {
	const router = useRouter()

	return (
		<ScreenWrapper scrollEnabled={true}>
			<HomeHeader />
			<FloatingButton onPress={() => router.push('/newPost')} />
			<EntryList />
		</ScreenWrapper>
	)
}

export default home
