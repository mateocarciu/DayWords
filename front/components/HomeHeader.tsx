import { useRouter } from 'expo-router'
import React from 'react'
import { hp, wp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Avatar from '@/components/Avatar'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '@/contexts/AuthContext'

interface HomeHeaderProps {
	reverse?: boolean
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ reverse = false }) => {
	const authContext = useAuth()

	if (!authContext) {
		console.error('AuthContext is not found')
		return null
	}
	const { user } = authContext
	const router = useRouter()
	return (
		<View style={[styles.header, { flexDirection: reverse ? 'row-reverse' : 'row' }]}>
			<TouchableOpacity onPress={() => router.push('/friends')}>
				<Feather name='users' size={25} color={theme.colors.text} />
			</TouchableOpacity>

			<Text style={styles.title}>DayWords</Text>

			<View style={styles.icons}>
				<TouchableOpacity onPress={() => router.push('/profile')}>
					<Avatar username={user?.username || ''} size={hp(4.3)} rounded={theme.radius.sm} style={{ borderWidth: 2 }} />
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default HomeHeader

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10
	},
	title: {
		color: theme.colors.text,
		fontSize: hp(3.2),
		fontWeight: theme.fonts.bold
	},
	avatarImage: {
		height: hp(4.3),
		width: wp(4.3),
		borderRadius: theme.radius.sm,
		borderColor: theme.colors.gray,
		borderWidth: 3
	},
	icons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 18
	}
})
