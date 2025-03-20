import { Feather } from '@expo/vector-icons'
import Avatar from '@/components/Avatar'
import Button from '@/components/buttons/Button'
import Header from '@/components/Header'
import RichTextEditor from '@/components/inputs/RichTextEditor'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { hp } from '@/helpers/common'
import { useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Keyboard } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { RichEditorProps } from 'react-native-pell-rich-editor'
import authFetch from '@/helpers/authFetch'

const newPosts = () => {
	const AuthContext = useAuth()
	if (!AuthContext) {
		console.warn('AuthContext is not found')
		return null
	}
	const { user } = AuthContext
	const text = useRef('')
	const editorRef = useRef<RichEditorProps | any>(null)
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [file, setFile] = useState<ImagePicker.ImagePickerAsset | string>()
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)

	const onPickFile = async (isImage: boolean) => {
		const mediaPickImageConfig: ImagePicker.ImagePickerOptions = {
			mediaTypes: ['images'],
			quality: 0.7
		}
		const mediaPickVideoConfig: ImagePicker.ImagePickerOptions = {
			mediaTypes: ['videos'],
			allowsEditing: true,
			quality: 0.5
		}
		let result = await ImagePicker.launchImageLibraryAsync(isImage ? mediaPickImageConfig : mediaPickVideoConfig)

		if (!result.canceled) {
			const fileSize = result.assets[0].fileSize ? result.assets[0].fileSize : 0
			if (fileSize <= 10485760 * 4) {
				setFile(result.assets[0])
			} else {
				Alert.alert('Post', 'File size must be less than or equal to 40MB')
			}
		}
	}

	const onSubmit = async () => {
		if (!text.current) {
			Alert.alert('Post', 'Please fill in the content you wannt to post')
			return
		}
		setLoading(true)

		try {
			await authFetch(`${process.env.EXPO_PUBLIC_API_URL}/api/entries`, {
				method: 'POST',
				body: JSON.stringify({
					text: text.current
				})
			})
			setTimeout(() => {
				router.back()
			}, 1000)
		} catch (error: any) {
			setLoading(false)
			console.error('Error posting entries', error)
			Alert.alert('Error posting entries', `Code: ${error.status} - ${error.message}`)
		}
	}

	useEffect(() => {
		const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
			setIsKeyboardShow(true)
		})

		const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			setIsKeyboardShow(false)
		})
		return () => {
			showSubscription.remove()
			hideSubscription.remove()
		}
	}, [])

	return (
		<ScreenWrapper autoDismissKeyboard={false}>
			<Header title='Create a new post' />
			<ScrollView contentContainerStyle={{ gap: 20, marginTop: 30 }} showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Avatar username={user?.username ?? ''} size={hp(6.5)} rounded={theme.radius.xl} />
					<View style={{ gap: 2 }}>
						<Text style={styles.username}>{user && user?.username}</Text>
						<Text style={styles.location}>{user?.location}</Text>
					</View>
				</View>

				<View style={styles.textEditor}>
					<RichTextEditor editorRef={editorRef} onChange={(body) => (text.current = body)} />
				</View>
				<View style={styles.media}>
					<Text style={styles.addImageText}>Add an image or a video</Text>
					<View style={styles.mediaIcons}>
						<TouchableOpacity onPress={() => onPickFile(true)}>
							<Feather name='image' size={30} color={theme.colors.dark} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => onPickFile(false)}>
							<Feather name='video' size={33} color={theme.colors.dark} />
						</TouchableOpacity>
					</View>
				</View>

				<Button buttonStyle={{ height: hp(6.2) }} title='Post' loading={loading} hasShadow={false} onPress={onSubmit} />

				{isKeyboardShow && <View style={{ height: hp(35) }}></View>}
			</ScrollView>
		</ScreenWrapper>
	)
}

export default newPosts

const styles = StyleSheet.create({
	title: {
		marginBottom: 10,
		fontSize: hp(2.5),
		fontWeight: theme.fonts.semibold,
		textAlign: 'center',
		color: theme.colors.text
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12
	},
	username: {
		fontSize: hp(2.2),
		fontWeight: theme.fonts.semibold,
		color: theme.colors.text
	},
	avatar: {
		height: hp(6.5),
		width: hp(6.5),
		borderRadius: theme.radius.xl,
		borderCurve: 'continuous',
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.1)'
	},
	location: {
		fontSize: hp(1.7),
		fontWeight: theme.fonts.medium,
		color: theme.colors.textLight
	},
	textEditor: {
		// marginTop: 10,
	},
	media: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: 1.5,
		padding: 12,
		paddingHorizontal: 18,
		borderRadius: theme.radius.xl,
		borderCurve: 'continuous',
		borderColor: theme.colors.gray
	},
	mediaIcons: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 15
	},
	addImageText: {
		fontSize: hp(1.9),
		color: theme.colors.dark,
		fontWeight: theme.fonts.bold
	},
	file: {
		height: hp(30),
		width: '100%',
		borderRadius: theme.radius.xl,
		overflow: 'hidden',
		borderCurve: 'continuous'
	},
	closeIcon: {
		position: 'absolute',
		top: 10,
		right: 10,
		backgroundColor: theme.colors.rose,
		padding: 5,
		borderRadius: 50
	}
})
