import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

interface ProfilePictureProps {
	profileImageUrl?: string
	username: string
	size?: number
	hasMarginRight?: boolean
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ profileImageUrl, username, size = 100, hasMarginRight = false }) => {
	// Fonction pour obtenir les initiales
	const getInitials = (username: string) => {
		if (!username) return '' // Si le nom d'utilisateur est vide
		const nameParts = username.split(' ')
		if (nameParts.length === 1) {
			return nameParts[0][0].toUpperCase() // Si une seule partie, retourne la première lettre
		}
		return (
			nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase() // Retourne les deux premières lettres des noms
		)
	}

	return (
		<View>
			{profileImageUrl ? (
				<Image source={{ uri: process.env.API_URL + profileImageUrl }} style={[styles.profileImage, { width: size, height: size, borderRadius: size / 2, marginRight: hasMarginRight ? 10 : 0 }]} />
			) : (
				<View style={[styles.profilePlaceholder, { width: size, height: size, borderRadius: size / 2, marginRight: hasMarginRight ? 10 : 0 }]}>
					<Text style={styles.profileInitials}>{getInitials(username)}</Text>
				</View>
			)}
		</View>
	)
}

// Styles pour le composant
const styles = StyleSheet.create({
	profileImage: {},
	profilePlaceholder: {
		backgroundColor: '#FF5733', // Couleur de fond par défaut
		alignItems: 'center',
		justifyContent: 'center'
	},
	profileInitials: {
		color: '#FFFFFF', // Couleur du texte
		fontSize: 24,
		fontWeight: 'bold'
	}
})

export default ProfilePicture
