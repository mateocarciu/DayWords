import { useState, useEffect, useCallback } from 'react'
import authFetch from '@/helpers/authFetch'
import { Entry } from '@/utils/types'
import useSSE from '@/hooks/useSSE'

const useEntries = (userId?: number) => {
	const [entries, setEntries] = useState<Entry[]>([])
	const [entry, setEntry] = useState<Entry | null>(null)
	const [isLoading, setLoading] = useState<boolean>(false)
	const [isRefreshing, setRefreshing] = useState<boolean>(false)

	useSSE({
		userId: userId,
		onNewEntry: () => {
			fetchEntries()
		}
	})

	const fetchEntries = useCallback(async () => {
		if (!userId) return
		setRefreshing(true)

		try {
			const response = await authFetch(`${process.env.EXPO_PUBLIC_API_URL}/api/entries`, {
				method: 'GET'
			})
			setEntries(response)
		} catch (error: any) {
			console.error('Error fetching entries', error)
		} finally {
			setTimeout(() => {
				setRefreshing(false)
			}, 1000)
		}
	}, [userId])

	const deleteEntry = async (entryId: number) => {
		try {
			authFetch(`${process.env.EXPO_PUBLIC_API_URL}/api/entries/${entryId}`, {
				method: 'DELETE'
			})
			fetchEntries()
		} catch (error: any) {
			console.error('Error deleting entry', error)
		}
	}

	const fetchEntry = async ($entryId: number) => {
		setRefreshing(true)

		try {
			const response = await authFetch(`${process.env.EXPO_PUBLIC_API_URL}/api/entries/${$entryId}`, {
				method: 'GET'
			})
			setEntry(response)
		} catch (error: any) {
			console.error('Error fetching entry', error)
		} finally {
			setTimeout(() => {
				setRefreshing(false)
			}, 1000)
		}
	}

	useEffect(() => {
		if (userId) {
			setLoading(true)
			fetchEntries().finally(() => setLoading(false))
		}
	}, [userId])

	return {
		entries,
		entry,
		isLoading,
		isRefreshing,
		fetchEntries,
		deleteEntry,
		fetchEntry
	}
}

export default useEntries
