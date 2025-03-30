import { Stack } from 'expo-router'

export default function Layout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name='index' options={{ animation: 'slide_from_right' }} />
		</Stack>
	)
}
