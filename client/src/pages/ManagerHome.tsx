import { Box, VStack, Heading } from '@chakra-ui/react'

interface ManagerHomeProps {}
function ManagerHome(props: ManagerHomeProps) {
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
				<Heading>Chain Manager Home</Heading>
			</Box>
		</VStack>
	)
}
export default ManagerHome
