const getTimeAgo = (date: Date): string => {
	const now = new Date()
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
	const diffInMinutes = Math.floor(diffInSeconds / 60)

	if (diffInSeconds < 60) {
		return `${diffInSeconds} seconds ago`
	} else if (diffInMinutes < 60) {
		return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
	} else {
		return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`
	}
}
export default getTimeAgo
