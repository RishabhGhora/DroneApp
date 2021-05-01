import {
	Box,
	VStack,
	Heading,
	Flex,
	Button,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react'

interface SettingsProps {
	history: any
}
function Settings(props: SettingsProps) {
	const { toggleColorMode } = useColorMode()
	const buttonBackground = useColorModeValue('brand.blue', 'lime')

	const clickedBack = () => {
		props.history.push('/')
	}

	const logoutClicked = () => {
		localStorage.removeItem('Username')
		localStorage.removeItem('userType')
		localStorage.removeItem('FirstName')
		props.history.push('/')
	}
	return (
		<Box>
			<Flex
				direction="row"
				alignItems="right"
				justifyContent="flex-start"
				m={5}
			>
				<Button
					size="xs"
					type="submit"
					onClick={clickedBack}
					background={buttonBackground}
				>
					Back
				</Button>
			</Flex>
			<VStack
				align="stretch"
				textAlign="center"
				mx="auto"
				p={10}
				pl={4}
				pr={4}
				spacing={8}
				maxW={{
					lg: '750',
				}}
			>
				<Box textAlign="center">
					<Heading>Settings</Heading>
					<Button
						width="full"
						background="black"
						mt={40}
						type="submit"
						color="white"
						onClick={toggleColorMode}
					>
						Toggle Color Mode
					</Button>
					<Button
						width="full"
						background="red"
						mt={10}
						type="submit"
						color="white"
						onClick={logoutClicked}
					>
						Log out
					</Button>
				</Box>
			</VStack>
		</Box>
	)
}
export default Settings
