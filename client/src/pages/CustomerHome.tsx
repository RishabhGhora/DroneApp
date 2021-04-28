import { Box, VStack, Heading } from '@chakra-ui/react'

interface CustomerHomeProps {}
function CustomerHome(props: CustomerHomeProps) {
	return (
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
				<Heading>Customer Home</Heading>
			</Box>
		</VStack>
	)
}
export default CustomerHome
