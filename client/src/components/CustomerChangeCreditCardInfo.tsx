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

function CustomerChangeCreditCardInfo(props: any) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	// Set states
	const [TypedUsername, setTypedUsername] = useState('')
	const [FirstName, setFirstName] = useState('')
	const [LastName, setLastName] = useState('')
	const [CcNumber, setCcNumber] = useState('')
	const [CVV, setCVV] = useState('')
	const [EXP_DATE, setEXP_DATE] = useState('')

	const [changedCreditCard, setChangedCreditCard] = useState('')
	const [isDisabled, setIsDisabled] = useState(false)
	var alert

	// Set error types and states
	interface errorsType {
		TypedUsername?: string
		FirstName?: string
		LastName?: string
		CcNumber?: string
		CVV?: string
		EXP_DATE?: string
	}
	const [errors, setErrors]: [errorsType, any] = useState({})

	// graphql queries

	// graphql mutation
	const CHANGE_CREDIT_CARD = gql`
		mutation changeCreditCardInfo(
			$Username: String!
			$TypedUsername: String!
			$FirstName: String!
			$LastName: String!
			$CcNumber: String!
			$CVV: String!
			$EXP_DATE: String!
		) {
			changeCreditCardInfo(
				Username: $Username
				TypedUsername: $TypedUsername
				FirstName: $FirstName
				LastName: $LastName
				CcNumber: $CcNumber
				CVV: $CVV
				EXP_DATE: $EXP_DATE
			) {
				Username
				CcNumber
				CVV
				EXP_DATE
			}
		}
	`

	const [changeCreditCard, { loading: changeCreditCardLoading }] = useMutation(
		CHANGE_CREDIT_CARD,
		{
			update: (_, data: any) => {
				if (data) {
					setErrors({})
					setChangedCreditCard(data.data.changeCreditCardInfo.CcNumber)
				}
			},
			onError: (err) => {
				//@ts-ignore
				setErrors(err.graphQLErrors[0].extensions.errors)
			},
		}
	)

	// Other functions
	const submitForm = (e: any) => {
		e.preventDefault()
		changeCreditCard({
			variables: {
				Username,
				TypedUsername,
				FirstName,
				LastName,
				CcNumber,
				CVV,
				EXP_DATE,
			},
		})
	}

	const clickedBack = () => {
		props.history.push('/')
	}

	const exitAlert = () => {
		alert = null
		setTypedUsername('')
		setFirstName('')
		setLastName('')
		setCcNumber('')
		setCVV('')
		setEXP_DATE('')
		setChangedCreditCard('')
		setIsDisabled(false)
	}

	// Autofocus Chain Name field without errors
	const usernameField = useRef(null)
	useEffect(() => {
		setTimeout(function () {
			if (usernameField.current) {
				//@ts-ignore
				usernameField.current.focus()
			}
		}, 100)
	}, [])

	// Show alert
	if (changedCreditCard !== '') {
		if (!isDisabled) {
			setIsDisabled(true)
		}
		alert = (
			<Stack spacing={3}>
				<Alert status="success" variant="left-accent">
					<AlertIcon />
					Sucessfully Changed Credit Card Info!
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
					lg: '850',
				}}
			>
				<Box textAlign="center">
					<Heading>Change Credit Card Information</Heading>
				</Box>
				{alert}
				<Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
					<form>
						<Flex
							direction="row"
							alignContent="center"
							alignItems="center"
							justifyContent="center"
						>
							<FormControl
								mr={5}
								isRequired
								isInvalid={errors.TypedUsername != null}
							>
								<FormLabel textAlign="center">Username</FormLabel>
								<Input
									ref={usernameField}
									placeholder="Enter your Username"
									value={TypedUsername}
									onChange={(e) => setTypedUsername(e.target.value)}
								/>
								<FormErrorMessage>{errors.TypedUsername}</FormErrorMessage>
							</FormControl>
							<FormControl
								ml={5}
								isRequired
								isInvalid={errors.FirstName != null}
							>
								<FormLabel textAlign="center">First Name</FormLabel>
								<Input
									placeholder="Enter your First Name"
									value={FirstName}
									onChange={(e) => setFirstName(e.target.value)}
								/>
								<FormErrorMessage>{errors.FirstName}</FormErrorMessage>
							</FormControl>
						</Flex>
						<Flex
							direction="row"
							alignContent="center"
							alignItems="center"
							justifyContent="center"
							mt={5}
						>
							<FormControl
								mr={5}
								isRequired
								isInvalid={errors.LastName != null}
							>
								<FormLabel textAlign="center">Last Name</FormLabel>
								<Input
									placeholder="Enter your Last Name"
									value={LastName}
									onChange={(e) => setLastName(e.target.value)}
								/>
								<FormErrorMessage>{errors.LastName}</FormErrorMessage>
							</FormControl>
							<FormControl
								ml={5}
								isRequired
								isInvalid={errors.CcNumber != null}
							>
								<FormLabel textAlign="center">Credit Card Number</FormLabel>
								<Input
									type="number"
									placeholder="1234123412341234"
									value={CcNumber}
									onChange={(e) => setCcNumber(e.target.value)}
								/>
								<FormErrorMessage>{errors.CcNumber}</FormErrorMessage>
							</FormControl>
						</Flex>

						<Flex
							mt={5}
							direction="row"
							alignContent="center"
							alignItems="center"
							justifyContent="center"
						>
							<FormControl mr={5} isRequired isInvalid={errors.CVV != null}>
								<FormLabel textAlign="center">CVV</FormLabel>
								<Input
									type="number"
									placeholder="123"
									value={CVV}
									onChange={(e) => setCVV(e.target.value)}
								/>
								<FormErrorMessage>{errors.CVV}</FormErrorMessage>
							</FormControl>
							<FormControl
								ml={5}
								isRequired
								isInvalid={errors.EXP_DATE != null}
							>
								<FormLabel textAlign="center">Expiration Date</FormLabel>
								<Input
									placeholder="2024-02-01"
									value={EXP_DATE}
									onChange={(e) => setEXP_DATE(e.target.value)}
								/>
								<FormErrorMessage>{errors.EXP_DATE}</FormErrorMessage>
							</FormControl>
						</Flex>
						<Button
							width="full"
							mt={4}
							type="submit"
							onClick={submitForm}
							background={buttonBackground}
							disabled={changeCreditCardLoading || isDisabled}
						>
							Approve
						</Button>
					</form>
				</Box>
			</VStack>
		</Box>
	)
}
export default CustomerChangeCreditCardInfo
