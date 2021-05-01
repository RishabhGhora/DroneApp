import {
	Box,
	VStack,
	Heading,
	useColorModeValue,
	Flex,
	Button,
} from '@chakra-ui/react'

function DroneTechHome(props: any) {
	const FirstName = localStorage.getItem('FirstName')
	const buttonBackground = useColorModeValue('brand.blue', 'lime')

	const clickedSettings = () => {
		props.history.push('/settings')
	}

	const clickedViewStoreOrders = () => {
		props.history.push('/dronetechviewstoreorders')
	}

	const clickedTrackDroneDelivery = () => {
		props.history.push('/dronetechtrackdronedelivery')
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
					<Heading mb={75}>Drone Tech Home</Heading>
				</Box>
				<Flex direction="row" alignItems="center" justifyContent="center">
					<Button
						width="full"
						size="lg"
						type="submit"
						background={buttonBackground}
						onClick={clickedViewStoreOrders}
					>
						View Store Orders
					</Button>
					<Button
						width="full"
						size="lg"
						ml={10}
						type="submit"
						background={buttonBackground}
						onClick={clickedTrackDroneDelivery}
					>
						Track Drone Delivery
					</Button>
				</Flex>
			</VStack>
		</Box>
	)
}
export default DroneTechHome
