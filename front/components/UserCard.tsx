import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Avatar from '@/components/Avatar'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'

type Props = {
	username: string
	bio?: string
	date?: string
	profileImageUrl?: string
	isFriend?: boolean
	onPressPrimary?: () => void
	onPressSecondary?: () => void
	primaryIcon?: keyof typeof Feather.glyphMap
	secondaryIcon?: keyof typeof Feather.glyphMap
	primaryIconColor?: string
	secondaryIconColor?: string
	primaryText?: string
	style?: ViewStyle
}

const UserCard = ({ username, bio, date, profileImageUrl, isFriend = false, onPressPrimary, onPressSecondary, primaryIcon, secondaryIcon, primaryIconColor = 'white', secondaryIconColor = 'white', primaryText, style }: Props) => {
	return (
		<View style={[styles.card, style]}>
			<View style={styles.userInfo}>
				<Avatar username={username} uri={profileImageUrl} size={hp(5)} rounded={theme.radius.md} />
				<View style={styles.userTextInfo}>
					<Text style={styles.username}>{username}</Text>
					{!!bio && <Text style={styles.bio}>{bio}</Text>}
					{!!date && <Text style={styles.date}>{date}</Text>}
				</View>
			</View>

			{primaryText ? (
				<Text style={styles.primaryText}>{primaryText}</Text>
			) : (
				<View style={styles.actions}>
					{onPressPrimary && (
						<TouchableOpacity style={[styles.iconButton, { backgroundColor: isFriend ? theme.colors.rose : theme.colors.green }]} onPress={onPressPrimary}>
							<Feather name={primaryIcon} size={hp(2.5)} color={primaryIconColor} />
						</TouchableOpacity>
					)}
					{onPressSecondary && (
						<TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.rose }]} onPress={onPressSecondary}>
							<Feather name={secondaryIcon} size={hp(2.5)} color={secondaryIconColor} />
						</TouchableOpacity>
					)}
				</View>
			)}
		</View>
	)
}

export default UserCard

const styles = StyleSheet.create({
	card: {
		backgroundColor: theme.colors.light,
		borderRadius: theme.radius.md,
		padding: hp(2),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		shadowColor: theme.colors.dark,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	userTextInfo: {
		marginLeft: wp(3)
	},
	username: {
		fontSize: hp(2),
		color: theme.colors.text,
		fontWeight: theme.fonts.semibold
	},
	bio: {
		color: theme.colors.textLight,
		fontSize: hp(1.6)
	},
	date: {
		color: theme.colors.textLight,
		fontSize: hp(1.5)
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: wp(2)
	},
	iconButton: {
		padding: hp(1.2),
		borderRadius: theme.radius.sm
	},
	primaryText: {
		color: theme.colors.green,
		fontWeight: theme.fonts.bold
	}
})
