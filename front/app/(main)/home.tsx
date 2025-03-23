import FloatingButton from '@/components/buttons/FloatingButton'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useRouter, useFocusEffect } from 'expo-router'
import EntryList from '@/components/entries/EntryList'
import HomeHeader from '@/components/HomeHeader'
import { useCallback, useState } from 'react'

const home = () => {
	const router = useRouter()
	const [refreshKey, setRefreshKey] = useState(0)

	useFocusEffect(
		useCallback(() => {
			setRefreshKey((prev) => prev + 1)
		}, [])
	)

	return (
		<ScreenWrapper scrollEnabled={true}>
			<HomeHeader />
			<FloatingButton onPress={() => router.push('/newPost')} />
			<EntryList key={refreshKey} />
		</ScreenWrapper>
	)
}

export default home
