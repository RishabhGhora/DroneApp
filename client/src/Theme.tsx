import { extendTheme, ColorMode } from '@chakra-ui/react'

interface Options {
	initialColorMode?: ColorMode
	useSystemColorMode?: boolean
	colors?: any
	fonts?: any
	components?: any
}

const config: Options = {
	initialColorMode: 'light',
	useSystemColorMode: false,
	colors: {
		brand: {
			blue: '#4F97F8',
			red: '#EB5757',
			lime: '#44bd32',
			grey: { 100: '#F2F2F2', 200: '#d9d9d9', 300: '#4F4F4F' },
			button: {
				50: '#4F97F8',
				100: '#4F97F8',
				500: '#4F97F8', // you need this
			},
		},
	},
	fonts: {
		body: 'Roboto',
		heading: 'Roboto',
	},
	components: {
		Button: {
			defaultProps: {
				colorScheme: 'brand.button',
			},
			baseStyle: {
				_focus: {
					boxShadow: 'none',
				},
			},
		},
		Input: {
			//FIXME: there's still an outline
			baseStyle: {
				_focus: {
					outline: 'none',
				},
			},
		},
	},
}
const theme = extendTheme({ ...config })

export default theme
