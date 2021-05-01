import { useState, useEffect, useRef } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
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
	Select,
} from '@chakra-ui/react'

function ManagerCreateChainItem(props: any) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	// Set states
	const [ChainItemName, setChainItemName] = useState('')
	const [Quantity, setQuantity] = useState('')
	const [Orderlimit, setOrderlimit] = useState('')
	const [Price, setPrice] = useState('')

	const [createdChainItem, setCreatedChainItem] = useState('')
	const [isDisabled, setIsDisabled] = useState(false)
	var alert

	// Set error types and states
	interface errorsType {
		ChainItemName?: string
		PLUNumber?: string
		Orderlimit?: string
		Quantity?: string
		Price?: string
	}
	const [errors, setErrors]: [errorsType, any] = useState({})

	// graphql queries
	const GET_CHAIN_NAME = gql`
		query getChainName($Username: String!) {
			getChainName(Username: $Username) {
				ChainName
			}
		}
	`
	const GET_ITEMS = gql`
		query getItems($Username: String!) {
			getItems(Username: $Username) {
				ItemName
			}
		}
	`
	const GET_PLU_NUMBER = gql`
		query getLatestPLUNumber($Username: String!) {
			getLatestPLUNumber(Username: $Username) {
				PLUNumber
			}
		}
	`

	const { loading: chainLoading, data: chainData } = useQuery(GET_CHAIN_NAME, {
		variables: { Username },
	})

	const ChainName = chainLoading ? 'Loading' : chainData.getChainName.ChainName

	const { loading: pluLoading, data: pluData } = useQuery(GET_PLU_NUMBER, {
		variables: { Username },
	})

	const PLUNumber = pluLoading
		? 'Loading'
		: pluData.getLatestPLUNumber.PLUNumber + 1

	var itemOptions
	const { loading: itemLoading, data: itemData } = useQuery(GET_ITEMS, {
		variables: { Username },
	})

	if (itemData) {
		itemOptions = itemData.getItems?.map((item: any, i: number) => {
			return (
				<option value={item.ItemName} key={i}>
					{item.ItemName}
				</option>
			)
		})
	}

	// graphql mutation
	const CREATE_CHAIN_ITEM = gql`
		mutation createChainItem(
			$Username: String!
			$ChainItemName: String!
			$ChainName: String!
			$PLUNumber: String!
			$Orderlimit: String!
			$Quantity: String!
			$Price: String!
		) {
			createChainItem(
				Username: $Username
				ChainItemName: $ChainItemName
				ChainName: $ChainName
				PLUNumber: $PLUNumber
				Orderlimit: $Orderlimit
				Quantity: $Quantity
				Price: $Price
			) {
				ChainItemName
			}
		}
	`

	const [createChainItem, { loading: createChainItemLoading }] = useMutation(
		CREATE_CHAIN_ITEM,
		{
			update: (_, data: any) => {
				if (data) {
					setErrors({})
					setCreatedChainItem(data.data.createChainItem.ChainItemName)
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
		createChainItem({
			variables: {
				Username,
				ChainItemName,
				ChainName,
				PLUNumber: PLUNumber.toString(),
				Orderlimit: Orderlimit.toString(),
				Quantity: Quantity.toString(),
				Price: Price.toString(),
			},
		})
	}

	const clickedBack = () => {
		props.history.push('/')
	}

	const exitAlert = () => {
		alert = null
		setCreatedChainItem('')
		setIsDisabled(false)
	}

	// Autofocus Chain Name field without errors
	const itemNameField = useRef(null)
	useEffect(() => {
		setTimeout(function () {
			if (itemNameField.current) {
				//@ts-ignore
				itemNameField.current.focus()
			}
		}, 100)
	}, [])

	// Show alert
	if (createdChainItem !== '') {
		if (!isDisabled) {
			setIsDisabled(true)
		}
		alert = (
			<Stack spacing={3}>
				<Alert status="success" variant="left-accent">
					<AlertIcon />
					Chain Item Sucessfully Created!
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
					<Heading>Chain Manager Create Chain Item</Heading>
				</Box>
				{alert}
				<Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
					<form>
						<FormControl>
							<FormLabel>Chain Name</FormLabel>
							<Input placeholder="Loading" value={ChainName} disabled={true} />
						</FormControl>

						<FormControl
							mt={5}
							isRequired
							isInvalid={errors.ChainItemName != null}
						>
							<FormLabel>Item</FormLabel>
							<Select
								ref={itemNameField}
								placeholder="Select Item"
								onChange={(e) => setChainItemName(e.target.value)}
								value={ChainItemName}
								disabled={itemLoading}
							>
								{itemOptions}
							</Select>
							<FormErrorMessage>{errors.ChainItemName}</FormErrorMessage>
						</FormControl>
						<Flex
							direction="row"
							mt={5}
							alignItems="center"
							justifyContent="center"
						>
							<FormControl isRequired isInvalid={errors.Quantity != null}>
								<FormLabel>Quantity Available</FormLabel>
								<Input
									type="Set Quantity"
									placeholder="100"
									onChange={(e) => setQuantity(e.target.value)}
									value={Quantity}
								/>
								<FormErrorMessage>{errors.Quantity}</FormErrorMessage>
							</FormControl>
							<FormControl
								isRequired
								pl={2}
								isInvalid={errors.Orderlimit != null}
							>
								<FormLabel>Limit Per Order</FormLabel>
								<Input
									type="number"
									placeholder="Set Order Limit"
									onChange={(e) => setOrderlimit(e.target.value)}
									value={Orderlimit}
								/>
								<FormErrorMessage>{errors.Orderlimit}</FormErrorMessage>
							</FormControl>
						</Flex>
						<Flex
							direction="row"
							mt={5}
							alignItems="center"
							justifyContent="center"
						>
							<FormControl isRequired isInvalid={errors.PLUNumber != null}>
								<FormLabel>PLU Number</FormLabel>
								<Input
									type="number"
									placeholder="100"
									value={PLUNumber}
									disabled={true}
								/>
								<FormErrorMessage>{errors.PLUNumber}</FormErrorMessage>
							</FormControl>
							<FormControl isRequired pl={2} isInvalid={errors.Price != null}>
								<FormLabel>Price per Unit</FormLabel>
								<Input
									type="number"
									placeholder="Set Price"
									onChange={(e) => setPrice(e.target.value)}
									value={Price}
								/>
								<FormErrorMessage>{errors.Price}</FormErrorMessage>
							</FormControl>
						</Flex>
						<Button
							width="full"
							mt={4}
							type="submit"
							onClick={submitForm}
							background={buttonBackground}
							disabled={createChainItemLoading || isDisabled}
						>
							Create
						</Button>
					</form>
				</Box>
			</VStack>
		</Box>
	)
}
export default ManagerCreateChainItem
