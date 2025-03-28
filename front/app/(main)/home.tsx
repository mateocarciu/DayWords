import FloatingButton from '@/components/buttons/FloatingButton'
import ScreenWrapper from '@/components/ScreenWrapper'
import EntryList from '@/components/entries/EntryList'
import HomeHeader from '@/components/HomeHeader'

const home = () => {
	return (
		<ScreenWrapper scrollEnabled={true}>
			<HomeHeader />
			<FloatingButton />
			<EntryList />
		</ScreenWrapper>
	)
}

export default home
