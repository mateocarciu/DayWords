import { useEffect, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import EventSource from 'react-native-sse'

type Props = {
	userId: number | undefined
	onNewEntry?: (entryData: any) => void
}

const useSSE = ({ userId, onNewEntry }: Props) => {
	const appState = useRef(AppState.currentState)
	const eventSourceRef = useRef<EventSource | null>(null)

	useEffect(() => {
		if (!userId) return

		// const handleAppStateChange = (nextAppState: string) => {
		// 	console.log('📱 AppState changed:', nextAppState)

		// 	if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
		// 		console.log('🔌 App active ➜ open SSE')
		// 		openSSE()
		// 	}

		// 	if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
		// 		console.log('⛔ App background ➜ close SSE')
		// 		closeSSE()
		// 	}

		// 	appState.current = nextAppState as AppStateStatus
		// }

		// const openSSE = () => {
		// if (eventSourceRef.current) {
		// 	console.log('⚠️ SSE already open')
		// 	return
		// }

		const eventSource = new EventSource(`http://127.0.0.1:4000/sse/${userId}`)

		eventSourceRef.current = eventSource

		eventSource.addEventListener('open', () => {
			console.log('✅ SSE Connection opened')
		})

		eventSource.addEventListener('newEntry', (event) => {
			const messageEvent = event as MessageEvent
			console.log('📥 newEntry event received:', messageEvent.data)
			try {
				const data = JSON.parse(messageEvent.data)
				onNewEntry?.(data)
			} catch (error) {
				console.error('❌ Error parsing newEntry event', error)
			}
		})

		eventSource.addEventListener('error', (err) => {
			console.error('🚨 SSE Error:', err)
			eventSource.close()
			eventSourceRef.current = null
		})
		// }

		const closeSSE = () => {
			if (eventSourceRef.current) {
				console.log('🔌 Closing SSE connection')
				eventSourceRef.current.close()
				eventSourceRef.current = null
			}
		}

		// const subscription = AppState.addEventListener('change', handleAppStateChange)

		// Ouvre direct si l'app est active
		// if (AppState.currentState === 'active') {
		// 	openSSE()
		// }

		return () => {
			// subscription.remove()
			closeSSE()
		}
	}, [userId, onNewEntry])
}

export default useSSE
