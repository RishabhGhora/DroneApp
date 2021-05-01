import { useState, useEffect, useRef } from 'react'
import { gql, useMutation, useQuery, useLazyQuery } from '@apollo/client'
import { Column } from 'react-table'
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
	Alert,
	AlertIcon,
	Stack,
	CloseButton,
	Select,
} from '@chakra-ui/react'
import DataTable from '../components/DataTable'

function ManagerViewDroneTechs(props: any) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	type row = {
		Username: string
		Name: string
		Location: any
	}

	var tableData: row[] = []
	var tableColumns: Column<row>[] = [
		{
			Header: 'Username',
			accessor: 'Username',
			//@ts-ignore
			disableSortBy: true,
		},
		{
			Header: 'Name',
			accessor: 'Name',
			//@ts-ignore
			disableSortBy: true,
		},
		{
			Header: 'Location',
			accessor: 'Location',
			//@ts-ignore
			disableSortBy: true,
		},
	]

	var droneTechs: any = {}

	// Set states
	const [StoreName, setStoreName] = useState('')
	const [droneTechUsername, setdroneTechUsername] = useState('')
	const [useFilter, setUseFilter] = useState(false)
	const [finishedChanges, setfinishedChanges] = useState(false)
	const [isDisabled, setIsDisabled] = useState(false)
	var alert

	// graphql queries
	const GET_CHAIN_NAME = gql`
		query getChainName($Username: String!) {
			getChainName(Username: $Username) {
				ChainName
			}
		}
	`
	const GET_LOCATIONS = gql`
		query getLocations($Username: String!) {
			getLocations(Username: $Username) {
				StoreName
			}
		}
	`
	const GET_DRONE_TECHS = gql`
		query managerViewDroneTechs(
			$Username: String!
			$StoreName: String
			$droneTechUsername: String
		) {
			managerViewDroneTechs(
				Username: $Username
				StoreName: $StoreName
				droneTechUsername: $droneTechUsername
			) {
				Username
				Name
				Location
			}
		}
	`

	const { loading: chainLoading, data: chainData } = useQuery(GET_CHAIN_NAME, {
		variables: { Username },
	})

	const ChainName = chainLoading ? 'Loading' : chainData.getChainName.ChainName

	var locationOptions: any
	const { loading: locationsLoading, data: locationData } = useQuery(
		GET_LOCATIONS,
		{
			variables: { Username },
		}
	)

	if (locationData) {
		locationOptions = locationData.getLocations?.map((loc: any, i: number) => {
			return (
				<option value={loc.StoreName} key={i}>
					{loc.StoreName}
				</option>
			)
		})
	}

	const [
		getDroneTechs,
		{ loading: droneLoading, data: droneData },
	] = useLazyQuery(GET_DRONE_TECHS)

	const updateLocations = (e: any) => {
		const droneUser = e.target.outerHTML.split('"')[1]
		droneTechs[droneUser] = e.target.value
	}

	if (droneData) {
		tableData = []
		//eslint-disable-next-line
		droneData.managerViewDroneTechs?.map((droneTech: any) => {
			droneTechs[droneTech.Username] = droneTech.Location
			tableData.push({
				Username: droneTech.Username,
				Name: droneTech.Name,
				Location: (
					<Select
						disabled={droneLoading}
						id={droneTech.Username}
						onChange={updateLocations}
						defaultValue={droneTech.Location}
					>
						{locationOptions}
					</Select>
				),
			})
		})
	}

	// graphql mutation
	const REASSIGN_DRONE_TECHNICIAN = gql`
		mutation reassignDroneTechnician(
			$Username: String!
			$droneTechUsername: String!
			$StoreName: String!
		) {
			reassignDroneTechnician(
				Username: $Username
				droneTechUsername: $droneTechUsername
				StoreName: $StoreName
			)
		}
	`

	const [
		reassignDroneTech,
		{ loading: reassignDroneTechLoading },
	] = useMutation(REASSIGN_DRONE_TECHNICIAN, {
		update: (_, data: any) => {
			if (data) {
			}
		},
		onError: (err) => {
			//@ts-ignore
			setErrors(err.graphQLErrors[0].extensions.errors)
		},
	})

	// Other functions
	const clickedFilter = (e: any) => {
		e.preventDefault()
		setUseFilter(true)
		getDroneTechs({ variables: { Username, StoreName, droneTechUsername } })
	}

	const clickedSave = (e: any) => {
		e.preventDefault()
		const keys = Object.keys(droneTechs)
		for (let i = 0; i < keys.length; i++) {
			const dtu = keys[i]
			const sn = droneTechs[keys[i]]
			reassignDroneTech({
				variables: { Username, StoreName: sn, droneTechUsername: dtu },
			})
		}
		setfinishedChanges(true)
	}

	const clickedBack = () => {
		props.history.push('/')
	}

	const exitAlert = () => {
		alert = null
		setfinishedChanges(false)
		setIsDisabled(false)
	}

	const clickedReset = () => {
		setStoreName('')
		setdroneTechUsername('')
		getDroneTechs({ variables: { Username } })
	}

	//Autofocus
	const locField = useRef(null)
	useEffect(() => {
		if (!useFilter) {
			getDroneTechs({ variables: { Username, StoreName, droneTechUsername } })
		}
		setTimeout(function () {
			if (locField.current) {
				//@ts-ignore
				locField.current.focus()
			}
		}, 100)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Show alert
	if (finishedChanges) {
		if (!isDisabled) {
			setIsDisabled(true)
		}
		alert = (
			<Stack spacing={3}>
				<Alert status="success" variant="left-accent">
					<AlertIcon />
					Sucessfully reassinged Drone Technicians and Drones!
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

	const table = <DataTable columns={tableColumns} data={tableData} />

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
					<Heading>Chain Manager View Drone Technicians</Heading>
				</Box>
				<Flex
					direction="row"
					alignContent="center"
					alignItems="center"
					justifyContent="center"
				>
					<FormControl maxWidth={200}>
						<FormLabel textAlign="center">Chain</FormLabel>
						<Input
							placeholder="Loading Chain Name"
							value={ChainName}
							disabled={true}
						/>
					</FormControl>
					<FormControl ml={5} maxWidth={200}>
						<FormLabel textAlign="center">Location</FormLabel>

						<Select
							ref={locField}
							placeholder="Filter by Location"
							onChange={(e) => setStoreName(e.target.value)}
							value={StoreName}
							disabled={locationsLoading}
						>
							{locationOptions}
						</Select>
					</FormControl>

					<FormControl ml={5}>
						<FormLabel textAlign="center">Username</FormLabel>

						<Input
							placeholder="Filter by Drone Technician userame"
							onChange={(e) => setdroneTechUsername(e.target.value)}
							value={droneTechUsername}
						/>
					</FormControl>
					<FormControl ml={5} maxWidth={10}>
						<FormLabel textAlign="center" opacity="0.0">
							hi
						</FormLabel>
						<Button
							type="submit"
							onClick={clickedFilter}
							background={buttonBackground}
							disabled={reassignDroneTechLoading || isDisabled}
						>
							Filter
						</Button>
					</FormControl>
				</Flex>
				{alert}
				{table}
				<Flex direction="row" mt={5} justifyContent="center">
					<Button
						width="full"
						type="submit"
						mr={10}
						onClick={clickedReset}
						background="red"
						disabled={reassignDroneTechLoading || isDisabled}
					>
						Reset
					</Button>
					<Button
						width="full"
						type="submit"
						onClick={clickedSave}
						background={buttonBackground}
						disabled={reassignDroneTechLoading || isDisabled}
					>
						Save
					</Button>
				</Flex>
			</VStack>
		</Box>
	)
}
export default ManagerViewDroneTechs
