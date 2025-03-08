import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const Friends = (props) => (
	<Svg aria-hidden='true' color='#000000' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' {...props}>
		<Path d='M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' stroke='currentColor' strokeWidth={props.strokeWidth} />
	</Svg>
)

export default Friends
