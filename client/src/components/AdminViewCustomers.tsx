import {
	Box,
	VStack,
	Heading,
	Flex,
	Button,
	useColorModeValue,
} from '@chakra-ui/react'

interface AdminViewCustomersProps {
	history: any
}
function AdminViewCustomers(props: AdminViewCustomersProps) {
	const buttonBackgrouond = useColorModeValue('brand.blue', 'lime')

	const clickedBack = () => {
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
					background={buttonBackgrouond}
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
					<Heading>Admin View Customers</Heading>
				</Box>
			</VStack>
		</Box>
	)
}
export default AdminViewCustomers
