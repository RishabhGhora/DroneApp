import { useEffect, useRef, useState } from 'react'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import {
	Button,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Box,
	VStack,
	Heading,
	Input,
	Link,
	Flex,
	Radio,
	RadioGroup,
	Stack,
	useColorModeValue,
	Select,
} from '@chakra-ui/react'

interface RegisterProps {}
function Register(props: RegisterProps) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')

	// Form states
	const [Username, setUsername] = useState('')
	const [Pass, setPassword] = useState('')
	const [FirstName, setFirstName] = useState('')
	const [LastName, setLastName] = useState('')
	const [ConfirmPass, setConfirmPass] = useState('')
	const [Street, setStreet] = useState('')
	const [City, setCity] = useState('')
	const [State, setState] = useState('')
	const [Zipcode, setZipcode] = useState('')
	const [userType, setUserType] = useState('Customer')
	const [CcNumber, setCcNumber] = useState('')
	const [CVV, setCVV] = useState('')
	const [EXP_DATE, setEXP_DATE] = useState('')
	const [ChainName, setChainName] = useState('')
	const [StoreName, setStoreName] = useState('')

	interface userErrorsType {
		Username?: string
		Pass?: string
		ConfirmPass?: string
		FirstName?: string
		LastName?: string
		Street?: string
		City?: string
		State?: string
		Zipcode?: string
		CcNumber?: string
		CVV?: string
		EXP_DATE?: string
	}

	interface customerErrorsType {
		CcNumber?: string
		CVV?: string
		EXP_DATE?: string
	}

	interface employeeErrorsType {
		ChainName?: string
		StoreName?: string
	}

	// Error states
	const [errors, setErrors]: [userErrorsType, any] = useState({})
	const [customerErrors, setCustomerErrors]: [
		customerErrorsType,
		any
	] = useState({})
	const [employeeErrors, setEmployeeErrors]: [
		employeeErrorsType,
		any
	] = useState({})

	// Graphql Query
	const GET_USER_TYPE = gql`
		query getUserType($Username: String!) {
			getUserType(Username: $Username)
		}
	`
	const [getUserType] = useLazyQuery(GET_USER_TYPE, {
		onError: (err) => {
			alert(err)
		},
		onCompleted: (data) => {
			localStorage.setItem('userType', data.getUserType)
			window.location.href = '/'
		},
	})

	// Graphql mutations
	const REGISTER_CUSTOMER = gql`
		mutation registerCustomer(
			$Username: String!
			$Pass: String!
			$ConfirmPass: String!
			$FirstName: String!
			$LastName: String!
			$Street: String!
			$City: String!
			$State: String!
			$Zipcode: String!
			$CcNumber: String!
			$CVV: String!
			$EXP_DATE: String!
		) {
			registerCustomer(
				Username: $Username
				Pass: $Pass
				ConfirmPass: $ConfirmPass
				FirstName: $FirstName
				LastName: $LastName
				Street: $Street
				City: $City
				State: $State
				Zipcode: $Zipcode
				CcNumber: $CcNumber
				CVV: $CVV
				EXP_DATE: $EXP_DATE
			) {
				Username
			}
		}
	`
	const [registerCustomer, { loading: registerCustomerLoading }] = useMutation(
		REGISTER_CUSTOMER,
		{
			update: (_, data: any) => {
				localStorage.setItem('Username', data.data.registerCustomer.Username)
				getUserType({
					variables: { Username: data.data.registerCustomer.Username },
				})
			},
			onError: (err) => {
				//@ts-ignore
				setErrors(err.graphQLErrors[0].extensions.errors)
				//@ts-ignore
				setCustomerErrors(err.graphQLErrors[0].extensions.errors)
			},
		}
	)

	const REGISTER_EMPLOYEE = gql`
		mutation registerEmployee(
			$Username: String!
			$Pass: String!
			$ConfirmPass: String!
			$FirstName: String!
			$LastName: String!
			$Street: String!
			$City: String!
			$State: String!
			$Zipcode: String!
			$ChainName: String!
			$StoreName: String!
		) {
			registerEmployee(
				Username: $Username
				Pass: $Pass
				ConfirmPass: $ConfirmPass
				FirstName: $FirstName
				LastName: $LastName
				Street: $Street
				City: $City
				State: $State
				Zipcode: $Zipcode
				ChainName: $ChainName
				StoreName: $StoreName
			) {
				Username
			}
		}
	`
	const [registerEmployee, { loading: registerEmployeeLoading }] = useMutation(
		REGISTER_EMPLOYEE,
		{
			update: (_, data: any) => {
				localStorage.setItem('Username', data.data.registerEmployee.Username)
				getUserType({
					variables: { Username: data.data.registerEmployee.Username },
				})
			},
			onError: (err) => {
				//@ts-ignore
				setErrors(err.graphQLErrors[0].extensions.errors)
				//@ts-ignore
				setEmployeeErrors(err.graphQLErrors[0].extensions.errors)
			},
		}
	)

	// On Submit
	const submitForm = (e: any) => {
		e.preventDefault()
		if (userType === 'Customer') {
			registerCustomer({
				variables: {
					Username,
					Pass,
					ConfirmPass,
					FirstName,
					LastName,
					Street,
					City,
					State,
					Zipcode,
					CcNumber,
					CVV,
					EXP_DATE,
				},
			})
		} else {
			registerEmployee({
				variables: {
					Username,
					Pass,
					ConfirmPass,
					FirstName,
					LastName,
					Street,
					City,
					State,
					Zipcode,
					ChainName,
					StoreName,
				},
			})
		}
	}

	// Autofocus First Name field without errors
	const firstNameField = useRef(null)
	useEffect(() => {
		setTimeout(function () {
			if (firstNameField.current) {
				//@ts-ignore
				firstNameField.current.focus()
			}
		}, 100)
	}, [])

	// Set Bottom half of questions
	var bottomHalf
	if (userType === 'Customer') {
		bottomHalf = (
			<div>
				<FormControl
					isRequired
					mt={5}
					isInvalid={customerErrors.CcNumber != null}
				>
					<FormLabel>Card Number</FormLabel>
					<Input
						placeholder="1234 1234 1234 1244"
						onChange={(e) => setCcNumber(e.target.value)}
						value={CcNumber}
					/>
					<FormErrorMessage>{customerErrors.CcNumber}</FormErrorMessage>
				</FormControl>
				<Flex
					direction="row"
					alignItems="center"
					mt={5}
					justifyContent="center"
				>
					<FormControl isRequired isInvalid={customerErrors.CVV != null}>
						<FormLabel>CVV</FormLabel>
						<Input
							placeholder="123"
							onChange={(e) => setCVV(e.target.value)}
							value={CVV}
						/>
						<FormErrorMessage>{customerErrors.CVV}</FormErrorMessage>
					</FormControl>
					<FormControl
						isRequired
						pl={2}
						isInvalid={customerErrors.EXP_DATE != null}
					>
						<FormLabel>Expiration Date</FormLabel>
						<Input
							placeholder="2024-2-01"
							onChange={(e) => setEXP_DATE(e.target.value)}
							value={EXP_DATE}
						/>
						<FormErrorMessage>{customerErrors.EXP_DATE}</FormErrorMessage>
					</FormControl>
				</Flex>
			</div>
		)
	} else {
		bottomHalf = (
			<div>
				<FormControl
					isRequired
					mt={5}
					isInvalid={employeeErrors.ChainName != null}
				>
					<FormLabel>Associated Grocery Chain</FormLabel>
					<Input
						placeholder="Kroger"
						onChange={(e) => setChainName(e.target.value)}
						value={ChainName}
					/>
					<FormErrorMessage>{employeeErrors.ChainName}</FormErrorMessage>
				</FormControl>
				<FormControl
					isRequired
					mt={5}
					isInvalid={employeeErrors.StoreName != null}
				>
					<FormLabel>Associated Store Name</FormLabel>
					<Input
						placeholder="Pleasent Hill"
						onChange={(e) => setStoreName(e.target.value)}
						value={StoreName}
					/>
					<FormErrorMessage>{employeeErrors.StoreName}</FormErrorMessage>
				</FormControl>
			</div>
		)
	}

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
				<Heading>Register</Heading>
			</Box>
			<Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
				<form>
					<Flex direction="row" alignItems="center" justifyContent="center">
						<FormControl isRequired isInvalid={errors.FirstName != null}>
							<FormLabel>First Name</FormLabel>
							<Input
								ref={firstNameField}
								placeholder="First Name"
								onChange={(e) => setFirstName(e.target.value)}
								value={FirstName}
							/>
							<FormErrorMessage>{errors.FirstName}</FormErrorMessage>
						</FormControl>
						<FormControl isRequired pl={2} isInvalid={errors.LastName != null}>
							<FormLabel>Last Name</FormLabel>
							<Input
								placeholder="Last Name"
								onChange={(e) => setLastName(e.target.value)}
								value={LastName}
							/>
							<FormErrorMessage>{errors.LastName}</FormErrorMessage>
						</FormControl>
					</Flex>
					<FormControl isRequired mt={5} isInvalid={errors.Username != null}>
						<FormLabel>Username</FormLabel>
						<Input
							placeholder="Username"
							onChange={(e) => setUsername(e.target.value)}
							value={Username}
						/>
						<FormErrorMessage>{errors.Username}</FormErrorMessage>
					</FormControl>
					<Flex
						direction="row"
						mt={5}
						alignItems="center"
						justifyContent="center"
					>
						<FormControl isRequired isInvalid={errors.Pass != null}>
							<FormLabel>Password</FormLabel>
							<Input
								type="password"
								placeholder="********"
								onChange={(e) => setPassword(e.target.value)}
								value={Pass}
							/>
							<FormErrorMessage>{errors.Pass}</FormErrorMessage>
						</FormControl>
						<FormControl
							isRequired
							pl={2}
							isInvalid={errors.ConfirmPass != null}
						>
							<FormLabel>Confirm Password</FormLabel>
							<Input
								type="password"
								placeholder="********"
								onChange={(e) => setConfirmPass(e.target.value)}
								value={ConfirmPass}
							/>
							<FormErrorMessage>{errors.ConfirmPass}</FormErrorMessage>
						</FormControl>
					</Flex>
					<FormControl isRequired mt={5} isInvalid={errors.Street != null}>
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

					<Flex
						direction="row"
						mt={5}
						alignItems="center"
						justifyContent="center"
					>
						<Box pr={5}>Registering as a: </Box>
						<RadioGroup onChange={setUserType} value={userType}>
							<Stack direction="row">
								<Radio value="Customer">Customer</Radio>
								<Radio value="Employee">Employee</Radio>
							</Stack>
						</RadioGroup>
					</Flex>
					{bottomHalf}
					<Button
						width="full"
						mt={4}
						type="submit"
						onClick={submitForm}
						background={buttonBackground}
						disabled={registerCustomerLoading || registerEmployeeLoading}
					>
						Sign Up
					</Button>
				</form>
			</Box>
			<Box align="center">
				<Link href="/login">{'Already have an account? Sign In'}</Link>
			</Box>
		</VStack>
	)
}

export default Register
