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
}

export interface Entry {
	id: number
	text: string
	location: string | null
	emotion: string | null
	mediaUrl: string | null
	public: boolean | null
	user_id: number
	parent_entry_id: number | null
	created_at: string
	updated_at: string
	child_entries: Entry[]
}
