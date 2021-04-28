import { useState, useEffect, useRef } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import {
	Box,
	VStack,
	Heading,
	Flex,
	Button,
	useColorModeValue,
	Stack,
	Alert,
	AlertIcon,
	CloseButton,
	FormLabel,
	FormControl,
	FormErrorMessage,
	Select,
	Input,
} from '@chakra-ui/react'

interface AdminCreateDroneProps {
	history: any
}
function AdminCreateDrone(props: AdminCreateDroneProps) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	// set states
	const DroneStatus = 'Available'
	const [DroneID, setDroneID] = useState('')
	const [Zip, setZip] = useState('')
	const [Radius, setRadius] = useState('')
	const [DroneTech, setDroneTech] = useState('')
	const [createdDrone, setCreatedDrone] = useState('')
	const [isDisabled, setIsDisabled] = useState(false)
	var alert

	// set loading states
	interface errorsType {
		DroneStatus?: string
		Zip?: string
		Radius?: string
		DroneTech?: string
	}
	const [errors, setErrors]: [errorsType, any] = useState({})

	// graphql mutations
	const CREATE_DRONE = gql`
		mutation createDrone(
			$Username: String!
			$DroneStatus: String!
			$Zip: String!
			$Radius: String!
			$DroneTech: String!
		) {
			createDrone(
				Username: $Username
				DroneStatus: $DroneStatus
				Zip: $Zip
				Radius: $Radius
				DroneTech: $DroneTech
			) {
				ID
				DroneTech
				Radius
				Zip
			}
		}
	`
	const [createDrone, { loading: createDroneLoading }] = useMutation(
		CREATE_DRONE,
		{
			update: (_, data: any) => {
				if (data) {
					setErrors({})
					setCreatedDrone(data.data.createDrone.ID)
				}
			},
			onError: (err) => {
				console.log(err)
				//@ts-ignore
				setErrors(err.graphQLErrors[0].extensions.errors)
			},
		}
	)

	// graphql queries
	const GET_LATEST_DRONE_ID = gql`
		query getLatestDroneID($Username: String!) {
			getLatestDroneID(Username: $Username)
		}
	`
	const { data: idData } = useQuery(GET_LATEST_DRONE_ID, {
		variables: { Username },
	})
	const VIEW_DRONE_ZIPS = gql`
		query viewDroneZips($Username: String!) {
			viewDroneZips(Username: $Username) {
				Zipcode
			}
		}
	`
	const { loading: zipLoading, data: zipData } = useQuery(VIEW_DRONE_ZIPS, {
		variables: { Username },
	})

	const VIEW_DRONE_TECHS = gql`
		query viewDroneTechs($Username: String!, $Zipcode: String!) {
			viewDroneTechs(Username: $Username, Zipcode: $Zipcode) {
				Username
			}
		}
	`
	const { loading: droneTechLoading, data: droneTechData } = useQuery(
		VIEW_DRONE_TECHS,
		{
			variables: { Username, Zipcode: Zip },
		}
	)

	var zipOptions
	// Get Drone Techs
	if (zipData) {
		zipOptions = zipData.viewDroneZips?.map((DroneTech: any, i: number) => {
			return (
				<option value={DroneTech.Zipcode} key={i}>
					{DroneTech.Zipcode}
				</option>
			)
		})
	}

	var droneTechOptions
	if (droneTechData && droneTechData.viewDroneTechs?.length > 0) {
		droneTechOptions = droneTechData.viewDroneTechs?.map(
			(DroneTech: any, i: number) => {
				return (
					<option value={DroneTech.Username} key={i}>
						{DroneTech.Username}
					</option>
				)
			}
		)
	}

	// Other functions
	const submitForm = (e: any) => {
		e.preventDefault()
		createDrone({
			variables: {
				Username,
				DroneStatus,
				Zip,
				Radius,
				DroneTech,
			},
		})
	}

	const clickedBack = () => {
		props.history.push('/')
	}

	// Auto focus
	const zipField = useRef(null)
	useEffect(() => {
		setTimeout(function () {
			if (zipField.current) {
				//@ts-ignore
				zipField.current.focus()
			}
		}, 100)
	}, [])

	const exitAlert = () => {
		alert = null
		setCreatedDrone('')
		setZip('')
		setRadius('')
		setDroneTech('')
		setIsDisabled(false)
	}

	// Show alert
	if (createdDrone !== '') {
		if (!isDisabled) {
			setIsDisabled(true)
		}
		alert = (
			<Stack spacing={3}>
				<Alert status="success" variant="left-accent">
					<AlertIcon />
					Drone Sucessfully Created!
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

	// Popoulate ID
	if (idData && DroneID === '') {
		setDroneID(idData.getLatestDroneID)
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
					<Heading>Admin Create Drone</Heading>
				</Box>
				{alert}
				<Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
					<form>
						<Flex direction="row" justifyContent="center" alignItems="center">
							<FormControl pr={10}>
								<FormLabel>Drone ID</FormLabel>

								<Input
									value={DroneID ? parseInt(DroneID) + 1 : 'Loading'}
									disabled={true}
								/>
							</FormControl>
							<FormControl isRequired isInvalid={errors.Zip != null}>
								<FormLabel>Associated Zip Code</FormLabel>
								<Select
									ref={zipField}
									placeholder="Select Zip"
									onChange={(e) => setZip(e.target.value)}
									value={Zip}
									disabled={zipLoading}
								>
									{zipOptions}
								</Select>
								<FormErrorMessage>{errors.Zip}</FormErrorMessage>
							</FormControl>
						</Flex>
						<Flex
							direction="row"
							justifyContent="center"
							alignItems="center"
							mt={5}
						>
							<FormControl pr={10}>
								<FormLabel>Status</FormLabel>

								<Input value={DroneStatus} disabled={true} />
							</FormControl>
							<FormControl isRequired isInvalid={errors.Radius != null}>
								<FormLabel>Travel Radius</FormLabel>
								<Input
									placeholder="Enter travel radius"
									onChange={(e) => setRadius(e.target.value)}
									value={Radius}
									disabled={false}
								/>
								<FormErrorMessage>{errors.Radius}</FormErrorMessage>
							</FormControl>
						</Flex>

						<FormControl isRequired isInvalid={errors.DroneTech != null} mt={5}>
							<FormLabel>Store Associate</FormLabel>
							<Select
								placeholder="Select Store Associate"
								onChange={(e) => setDroneTech(e.target.value)}
								value={DroneTech}
								disabled={droneTechLoading}
							>
								{droneTechOptions}
							</Select>
							<FormErrorMessage>{errors.DroneTech}</FormErrorMessage>
						</FormControl>
						<Button
							width="full"
							mt={5}
							type="submit"
							onClick={submitForm}
							background={buttonBackground}
							disabled={createDroneLoading || isDisabled}
						>
							Create
						</Button>
					</form>
				</Box>
			</VStack>
		</Box>
	)
}
export default AdminCreateDrone
