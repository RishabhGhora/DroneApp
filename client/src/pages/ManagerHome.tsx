import {
	Box,
	VStack,
	Heading,
	Flex,
	Button,
	useColorModeValue,
} from '@chakra-ui/react'

function ManagerHome(props: any) {
	const FirstName = localStorage.getItem('FirstName')
	const buttonBackground = useColorModeValue('brand.blue', 'lime')

	const clickedSettings = () => {
		props.history.push('/settings')
	}

	const clickedViewDroneTechs = () => {
		props.history.push('/managerviewdronetechnicians')
	}

	const clickedViewDrones = () => {
		props.history.push('/managerviewdrones')
	}

	const clickedCreateChainItem = () => {
		props.history.push('/managercreatechainitem')
	}

	const clickedManageStores = () => {
		props.history.push('/managermanagestores')
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
					<Heading mb={75}>Chain Manager Home</Heading>
				</Box>
				<Flex direction="row" alignItems="center" justifyContent="center">
					<Button
						width="full"
						size="lg"
						type="submit"
						background={buttonBackground}
						onClick={clickedViewDroneTechs}
					>
						View Drone Technicians
					</Button>
					<Button
						width="full"
						size="lg"
						ml={10}
						type="submit"
						background={buttonBackground}
						onClick={clickedViewDrones}
					>
						View Drones
					</Button>
				</Flex>
				<Flex direction="row" alignItems="center" justifyContent="center">
					<Button
						width="full"
						size="lg"
						type="submit"
						background={buttonBackground}
						onClick={clickedCreateChainItem}
					>
						Create Chain Item
					</Button>
					<Button
						width="full"
						size="lg"
						ml={10}
						type="submit"
						background={buttonBackground}
						onClick={clickedManageStores}
					>
						Manage Stores
					</Button>
				</Flex>
			</VStack>
		</Box>
	)
}
export default ManagerHome
