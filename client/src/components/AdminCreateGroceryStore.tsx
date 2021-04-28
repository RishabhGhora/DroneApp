import { useState, useEffect, useRef } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import {
	Box,
	VStack,
	Heading,
	Flex,
	Button,
	useColorModeValue,
	FormErrorMessage,
	FormLabel,
	FormControl,
	Input,
	Select,
	Stack,
	Alert,
	AlertIcon,
	CloseButton,
} from '@chakra-ui/react'

interface AdminCreateGroceryStoreProps {
	history: any
}
function AdminCreateGroceryStore(props: AdminCreateGroceryStoreProps) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	const [ChainName, setChainName] = useState('')
	const [StoreName, setStoreName] = useState('')
	const [Street, setStreet] = useState('')
	const [City, setCity] = useState('')
	const [State, setState] = useState('')
	const [Zipcode, setZipcode] = useState('')
	const [createdStoreName, setCreatedStoreName] = useState('')
	const [isDisabled, setIsDisabled] = useState(false)
	var alert

	interface errorsType {
		ChainName?: string
		StoreName?: string
		Street?: string
		City?: string
		State?: string
		Zipcode?: string
	}

	const [errors, setErrors]: [errorsType, any] = useState({})

	var chainOptions

	const VIEW_CHAINS = gql`
		query viewChains($Username: String!) {
			viewChains(Username: $Username) {
				ChainName
			}
		}
	`

	const { loading: chainLoading, data: chainData } = useQuery(VIEW_CHAINS, {
		variables: { Username },
	})

	const CREATE_GROCERY_STORE = gql`
		mutation createGroceryChain(
			$Username: String!
			$ChainName: String!
			$StoreName: String!
			$Street: String!
			$City: String!
			$State: String!
			$Zipcode: String!
		) {
			createGroceryStore(
				Username: $Username
				ChainName: $ChainName
				StoreName: $StoreName
				Street: $Street
				City: $City
				State: $State
				Zipcode: $Zipcode
			) {
				StoreName
				ChainName
				Zipcode
			}
		}
	`
	const [
		createGroceryStore,
		{ loading: createGroceryStoreLoading },
	] = useMutation(CREATE_GROCERY_STORE, {
		update: (_, data: any) => {
			if (data) {
				setErrors({})
				setCreatedStoreName(data.data.createGroceryStore.StoreName)
			}
		},
		onError: (err) => {
			//@ts-ignore
			setErrors(err.graphQLErrors[0].extensions.errors)
		},
	})

	const submitForm = (e: any) => {
		e.preventDefault()
		createGroceryStore({
			variables: {
				Username,
				ChainName,
				StoreName,
				Street,
				City,
				State,
				Zipcode,
			},
		})
	}

	const clickedBack = () => {
		props.history.push('/')
	}

	// Auto focus
	const chainNameField = useRef(null)
	useEffect(() => {
		setTimeout(function () {
			if (chainNameField.current) {
				//@ts-ignore
				chainNameField.current.focus()
			}
		}, 100)
	}, [])

	if (chainData) {
		chainOptions = chainData.viewChains?.map((chain: any) => {
			return (
				<option value={chain.ChainName} key={chain.ChainName}>
					{chain.ChainName}
				</option>
			)
		})
	}

	const exitAlert = () => {
		alert = null
		setCreatedStoreName('')
		setStoreName('')
		setStreet('')
		setCity('')
		setState('')
		setZipcode('')
		setIsDisabled(false)
	}

	// Show alert
	if (createdStoreName !== '') {
		if (!isDisabled) {
			setIsDisabled(true)
		}
		alert = (
			<Stack spacing={3}>
				<Alert status="success" variant="left-accent">
					<AlertIcon />
					Grocery Store Sucessfully Created!
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
					<Heading>Admin Create New Store</Heading>
				</Box>
				{alert}
				<Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
					<form>
						<FormControl isRequired isInvalid={errors.ChainName != null}>
							<FormLabel>Affiliated Grocery Chain</FormLabel>
							<Select
								ref={chainNameField}
								placeholder="Select Chain"
								onChange={(e) => setChainName(e.target.value)}
								value={ChainName}
								disabled={chainLoading}
							>
								{chainOptions}
							</Select>
							<FormErrorMessage>{errors.ChainName}</FormErrorMessage>
						</FormControl>
						<FormControl pt={5} isRequired isInvalid={errors.StoreName != null}>
							<FormLabel>Grocery Store Location Name</FormLabel>
							<Input
								placeholder="Store Name"
								onChange={(e) => setStoreName(e.target.value)}
								value={StoreName}
							/>
							<FormErrorMessage>{errors.StoreName}</FormErrorMessage>
						</FormControl>
						<FormControl pt={5} isRequired isInvalid={errors.Street != null}>
							<FormLabel>Street</FormLabel>
							<Input
								placeholder="1 North Ave"
								onChange={(e) => setStreet(e.target.value)}
								value={Street}
							/>
							<FormErrorMessage>{errors.Street}</FormErrorMessage>
						</FormControl>
						<Flex
							direction="row"
							mt={5}
							alignItems="center"
							justifyContent="center"
						>
							<FormControl isRequired isInvalid={errors.City != null}>
								<FormLabel>City</FormLabel>
								<Input
									placeholder="Atlanta"
									onChange={(e) => setCity(e.target.value)}
									value={City}
								/>
								<FormErrorMessage>{errors.City}</FormErrorMessage>
							</FormControl>
							<FormControl isRequired pl={2} isInvalid={errors.State != null}>
								<FormLabel>State</FormLabel>
								<Select
									placeholder="Select State"
									onChange={(e) => setState(e.target.value)}
									value={State}
								>
									<option value="AL">AL</option>
									<option value="AK">AK</option>
									<option value="AZ">AZ</option>
									<option value="AR">AR</option>
									<option value="CA">CA</option>
									<option value="CO">CO</option>
									<option value="CT">CT</option>
									<option value="DE">DE</option>
									<option value="DC">DC</option>
									<option value="FL">FL</option>
									<option value="GA">GA</option>
									<option value="HI">HI</option>
									<option value="ID">ID</option>
									<option value="IL">IL</option>
									<option value="IN">IN</option>
									<option value="IA">IA</option>
									<option value="KS">KS</option>
									<option value="KY">KY</option>
									<option value="LA">LA</option>
									<option value="ME">ME</option>
									<option value="MD">MD</option>
									<option value="MA">MA</option>
									<option value="MI">MI</option>
									<option value="MN">MN</option>
									<option value="MS">MS</option>
									<option value="MO">MO</option>
									<option value="MT">MT</option>
									<option value="NE">NE</option>
									<option value="NV">NV</option>
									<option value="NH">NH</option>
									<option value="NJ">NJ</option>
									<option value="NM">NM</option>
									<option value="NY">NY</option>
									<option value="NC">NC</option>
									<option value="ND">ND</option>
									<option value="OH">OH</option>
									<option value="OK">OK</option>
									<option value="OR">OR</option>
									<option value="PA">PA</option>
									<option value="RI">RI</option>
									<option value="SC">SC</option>
									<option value="SD">SD</option>
									<option value="TN">TN</option>
									<option value="TX">TX</option>
									<option value="UT">UT</option>
									<option value="VT">VT</option>
									<option value="VA">VA</option>
									<option value="WA">WA</option>
									<option value="WV">WV</option>
									<option value="WI">WI</option>
									<option value="WY">WY</option>
								</Select>
								<FormErrorMessage>{errors.State}</FormErrorMessage>
							</FormControl>
							<FormControl isRequired pl={2} isInvalid={errors.Zipcode != null}>
								<FormLabel>Zip</FormLabel>
								<Input
									placeholder="30308"
									onChange={(e) => setZipcode(e.target.value)}
									value={Zipcode}
								/>
								<FormErrorMessage>{errors.Zipcode}</FormErrorMessage>
							</FormControl>
						</Flex>

						<Button
							width="full"
							mt={4}
							type="submit"
							onClick={submitForm}
							background={buttonBackground}
							disabled={createGroceryStoreLoading || isDisabled}
						>
							Create
						</Button>
					</form>
				</Box>
			</VStack>
		</Box>
	)
}
export default AdminCreateGroceryStore
