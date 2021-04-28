import {
	Box,
	VStack,
	Heading,
	Flex,
	Button,
	useColorModeValue,
} from '@chakra-ui/react'

function AdminHome(props: any) {
	const FirstName = localStorage.getItem('FirstName')
	const buttonBackground = useColorModeValue('brand.blue', 'lime')

	const clickedSettings = () => {
		props.history.push('/settings')
	}

	const clickedCreateGroceryChain = () => {
		props.history.push('/admincreategrocerychain')
	}

	const clickedCreateGroceryStore = () => {
		props.history.push('/admincreategrocerystore')
	}

	const clickedCreateDrone = () => {
		props.history.push('/admincreatedrone')
	}

	const clickedCreateItem = () => {
		props.history.push('/admincreateitem')
	}

	const clickedViewCustomers = () => {
		props.history.push('/adminviewcustomers')
	}

	return (
		<Box>
			<Flex direction="row" alignItems="right" justifyContent="flex-end" m={5}>
				<Button
					size="xs"
					type="submit"
					onClick={clickedSettings}
					background={buttonBackground}
				>
					Settings
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
					<Heading>Welcome {FirstName}</Heading>
				</Box>
				<Box textAlign="center">
					<Heading mb={75}>Admin Home</Heading>
				</Box>
				<Flex direction="row" alignItems="center" justifyContent="center">
					<Button
						width="full"
						size="lg"
						type="submit"
						background={buttonBackground}
						onClick={clickedCreateItem}
					>
						Create Item
					</Button>
					<Button
						width="full"
						size="lg"
						ml={10}
						type="submit"
						background={buttonBackground}
						onClick={clickedCreateDrone}
					>
						Create Drone
					</Button>
					<Button
						width="full"
						size="lg"
						ml={10}
						type="submit"
						background={buttonBackground}
						onClick={clickedViewCustomers}
					>
						View Customer Info
					</Button>
				</Flex>
				<Flex direction="row" alignItems="center" justifyContent="center">
					<Button
						width="full"
						size="lg"
						type="submit"
						background={buttonBackground}
						onClick={clickedCreateGroceryChain}
					>
						Create Grocery Chain
					</Button>
					<Button
						width="full"
						size="lg"
						ml={10}
						type="submit"
						background={buttonBackground}
						onClick={clickedCreateGroceryStore}
					>
						Create Store
					</Button>
				</Flex>
			</VStack>
		</Box>
	)
}
export default AdminHome
