export interface User {
	id: number
	username?: string
	name?: string
	bio?: string | null
	email: string
	profileImageUrl?: string
	location?: string | null
	created_at?: string | null
	updated_at?: string | null
	token: string | null
}
