import { useState, useRef, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import {
	Box,
	VStack,
	Heading,
	Flex,
	Button,
	useColorModeValue,
	FormLabel,
	FormControl,
	FormErrorMessage,
	Input,
	Select,
	Stack,
	Alert,
	AlertIcon,
	CloseButton,
} from '@chakra-ui/react'

interface AdminCreateItemProps {
	history: any
}
function AdminCreateItem(props: AdminCreateItemProps) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	// Set states
	const [ItemName, setItemName] = useState('')
	const [ItemType, setItemType] = useState('')
	const [Origin, setOrigin] = useState('')
	const [Organic, setOrganic] = useState('')
	const [isDisabled, setIsDisabled] = useState(false)
	var alert

	const [createdItemName, setCreatedItemName] = useState('')

	// Set error state
	interface errorsType {
		ItemName?: string
		ItemType?: string
		Origin?: string
		Organic?: string
	}

	const [errors, setErrors]: [errorsType, any] = useState({})

	// graphql mutation
	const CREATE_ITEM = gql`
		mutation createItem(
			$Username: String!
			$ItemName: String!
			$ItemType: String!
			$Origin: String!
			$Organic: String!
		) {
			createItem(
				Username: $Username
				ItemName: $ItemName
				ItemType: $ItemType
				Origin: $Origin
				Organic: $Organic
			) {
				ItemName
				ItemType
			}
		}
	`
	const [createItem, { loading: createItemLoading }] = useMutation(
		CREATE_ITEM,
		{
			update: (_, data: any) => {
				if (data) {
					setErrors({})
					setCreatedItemName(data.data.createItem.ItemName)
				}
			},
			onError: (err) => {
				//@ts-ignore
				setErrors(err.graphQLErrors[0].extensions.errors)
			},
		}
	)

	// Auto focus
	const itemNameField = useRef(null)
	useEffect(() => {
		setTimeout(function () {
			if (itemNameField.current) {
				//@ts-ignore
				itemNameField.current.focus()
			}
		}, 100)
	}, [])

	// Other functions
	const clickedBack = () => {
		props.history.push('/')
	}

	const submitForm = (e: any) => {
		e.preventDefault()
		createItem({
			variables: {
				Username,
				ItemName,
				ItemType,
				Organic,
				Origin,
			},
		})
	}

	const exitAlert = () => {
		alert = null
		setCreatedItemName('')
		setItemName('')
		setOrigin('')
		setOrganic('')
		setIsDisabled(false)
	}

	// Show alert
	if (createdItemName !== '') {
		if (!isDisabled) {
			setIsDisabled(true)
		}
		alert = (
			<Stack spacing={3}>
				<Alert status="success" variant="left-accent">
					<AlertIcon />
					Grocery Item Sucessfully Created!
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
					<Heading>Admin Create Item</Heading>
				</Box>
				{alert}
				<Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
					<form>
						<FormControl pt={5} isRequired isInvalid={errors.ItemName != null}>
							<FormLabel>Item Name</FormLabel>
							<Input
								ref={itemNameField}
								placeholder="Enter Item Name"
								onChange={(e) => setItemName(e.target.value)}
								value={ItemName}
							/>
							<FormErrorMessage>{errors.ItemName}</FormErrorMessage>
						</FormControl>
						<FormControl isRequired isInvalid={errors.ItemType != null} mt={5}>
							<FormLabel>Item Type</FormLabel>
							<Select
								placeholder="Select Item Type"
								onChange={(e) => setItemType(e.target.value)}
								value={ItemType}
							>
								<option value={'Dairy'}>Dairy</option>
								<option value={'Bakery'}>Bakery</option>
								<option value={'Meat'}>Meat</option>
								<option value={'Produce'}>Produce</option>
								<option value={'Care'}>Care</option>
								<option value={'Paper Goods'}>Paper Goods</option>
								<option value={'Beverages'}>Beverages</option>
								<option value={'Other'}>Other</option>
							</Select>
							<FormErrorMessage>{errors.ItemType}</FormErrorMessage>
						</FormControl>
						<FormControl isRequired isInvalid={errors.Organic != null} mt={5}>
							<FormLabel>Organic</FormLabel>
							<Select
								placeholder="Organic?"
								onChange={(e) => setOrganic(e.target.value)}
								value={Organic}
							>
								<option value={'Yes'}>Yes</option>
								<option value={'No'}>No</option>
							</Select>
							<FormErrorMessage>{errors.Organic}</FormErrorMessage>
						</FormControl>
						<FormControl pt={5} isRequired isInvalid={errors.Origin != null}>
							<FormLabel>Origin</FormLabel>
							<Input
								placeholder="Enter Item Origin"
								onChange={(e) => setOrigin(e.target.value)}
								value={Origin}
							/>
							<FormErrorMessage>{errors.Origin}</FormErrorMessage>
						</FormControl>
						<Button
							width="full"
							mt={4}
							type="submit"
							onClick={submitForm}
							background={buttonBackground}
							disabled={createItemLoading || isDisabled}
						>
							Create
						</Button>
					</form>
				</Box>
			</VStack>
		</Box>
	)
}
export default AdminCreateItem
