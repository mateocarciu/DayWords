import { Stack } from 'expo-router'

export default function Layout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name='home' />
			<Stack.Screen name='profile' />
			<Stack.Screen name='newPost' options={{ animation: 'slide_from_bottom', animationDuration: 200 }} />
		</Stack>
	)
}
