import { useState, useEffect, useRef } from 'react'
import { gql, useMutation } from '@apollo/client'
import {
	Box,
	VStack,
	Heading,
	Flex,
	Button,
	useColorModeValue,
	FormControl,
	Input,
	FormLabel,
	FormErrorMessage,
	Alert,
	AlertIcon,
	Stack,
	CloseButton,
} from '@chakra-ui/react'

interface AdminCreateGroceryChainProps {
	history: any
}
function AdminCreateGroceryChain(props: AdminCreateGroceryChainProps) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')

	const Username = localStorage.getItem('Username')
	const [ChainName, setChainName] = useState('')
	const [createdChainName, setCreatedChainName] = useState('')
	const [isDisabled, setIsDisabled] = useState(false)
	var alert

	interface errorsType {
		ChainName?: string
	}
	const [errors, setErrors]: [errorsType, any] = useState({})

	const CREATE_GROCERY_CHAIN = gql`
		mutation createGroceryChain($Username: String!, $ChainName: String!) {
			createGroceryChain(Username: $Username, ChainName: $ChainName) {
				ChainName
			}
		}
	`

	const [
		createGroceryChain,
		{ loading: createGroceryChainLoading },
	] = useMutation(CREATE_GROCERY_CHAIN, {
		update: (_, data: any) => {
			if (data) {
				setErrors({})
				setCreatedChainName(data.data.createGroceryChain.ChainName)
			}
		},
		onError: (err) => {
			//@ts-ignore
			setErrors(err.graphQLErrors[0].extensions.errors)
		},
	})

	const submitForm = (e: any) => {
		e.preventDefault()
		createGroceryChain({
			variables: {
				Username,
				ChainName,
			},
		})
	}

	const clickedBack = () => {
		props.history.push('/')
	}

	const exitAlert = () => {
		alert = null
		setCreatedChainName('')
		setChainName('')
		setIsDisabled(false)
	}

	// Autofocus Chain Name field without errors
	const chainNameField = useRef(null)
	useEffect(() => {
		setTimeout(function () {
			if (chainNameField.current) {
				//@ts-ignore
				chainNameField.current.focus()
			}
		}, 100)
	}, [])

	// Show alert
	if (createdChainName !== '') {
		if (!isDisabled) {
			setIsDisabled(true)
		}
		alert = (
			<Stack spacing={3}>
				<Alert status="success" variant="left-accent">
					<AlertIcon />
					Grocery Chain Sucessfully Created!
					<CloseButton
						position="absolute"
						right="8px"
						top="8px"
						onClick={exitAlert}
					/>
				</Alert>
			</Stack>
		)
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
					<Heading>Admin Create Grocery Chain</Heading>
				</Box>
				{alert}
				<Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
					<form>
						<FormControl isRequired isInvalid={errors.ChainName != null}>
							<FormLabel>Grocery Chain Name</FormLabel>
							<Input
								ref={chainNameField}
								placeholder="Moss Market"
								onChange={(e) => setChainName(e.target.value)}
								value={ChainName}
								disabled={isDisabled}
							/>
							<FormErrorMessage>{errors.ChainName}</FormErrorMessage>
						</FormControl>
						<Button
							width="full"
							mt={4}
							type="submit"
							onClick={submitForm}
							background={buttonBackground}
							disabled={createGroceryChainLoading || isDisabled}
						>
							Create
						</Button>
					</form>
				</Box>
			</VStack>
		</Box>
	)
}
export default AdminCreateGroceryChain
