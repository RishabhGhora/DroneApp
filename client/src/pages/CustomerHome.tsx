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

	const clickedChangeCreditCardInfo = () => {
		props.history.push('/customerchangecreditcardinfo')
	}

	const clickedReviewOrder = () => {
		props.history.push('/customerrevieworder')
	}

	const clickedViewOrderHistory = () => {
		props.history.push('/customervieworderhistory')
	}

	const clickedViewStoreItems = () => {
		props.history.push('/customerviewstoreitems')
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
					<Heading mb={75}>Customer Home</Heading>
				</Box>
				<Flex direction="row" alignItems="center" justifyContent="center">
					<Button
						width="full"
						size="lg"
						type="submit"
						background={buttonBackground}
						onClick={clickedChangeCreditCardInfo}
					>
						Change Credit Card Info
					</Button>
					<Button
						width="full"
						size="lg"
						ml={10}
						type="submit"
						background={buttonBackground}
						onClick={clickedReviewOrder}
					>
						Review Order
					</Button>
				</Flex>
				<Flex direction="row" alignItems="center" justifyContent="center">
					<Button
						width="full"
						size="lg"
						type="submit"
						background={buttonBackground}
						onClick={clickedViewOrderHistory}
					>
						View Order History
					</Button>
					<Button
						width="full"
						size="lg"
						ml={10}
						type="submit"
						background={buttonBackground}
						onClick={clickedViewStoreItems}
					>
						View Store Items
					</Button>
				</Flex>
			</VStack>
		</Box>
	)
}
export default ManagerHome
