import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export const formatEntryDate = (dateString: string) => {
	const date = new Date(dateString)
	const isToday = new Date().toDateString() === date.toDateString()

	if (isToday) {
		return formatDistanceToNow(date, { addSuffix: true, locale: fr })
	} else {
		return format(date, "d MMMM 'à' HH'h'mm", { locale: fr })
	}
}
