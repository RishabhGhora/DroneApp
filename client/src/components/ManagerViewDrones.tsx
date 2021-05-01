import { useState, useEffect, useRef } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
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
} from '@chakra-ui/react'
import DataTable from '../components/DataTable'

function ManagerViewDrones(props: any) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	type row = {
		DroneID: number
		Operator: string
		Radius: number
		Zipcode: number
		Status: string
	}

	var tableData: row[] = []
	var tableColumns: Column<row>[] = [
		{
			Header: 'Drone ID',
			accessor: 'DroneID',
		},
		{
			Header: 'Operator',
			accessor: 'Operator',
			//@ts-ignore
			disableSortBy: true,
		},
		{
			Header: 'Radius',
			accessor: 'Radius',
		},
		{
			Header: 'Zip Code',
			accessor: 'Zipcode',
		},
		{
			Header: 'Status',
			accessor: 'Status',
		},
	]

	// Set states
	const [ID, setID] = useState('')
	const [Radius, setRadius] = useState('')

	// graphql queries
	const GET_DRONES = gql`
		query managerViewDrones($Username: String!, $ID: String, $Radius: Int) {
			managerViewDrones(Username: $Username, ID: $ID, Radius: $Radius) {
				DroneID
				Operator
				Radius
				Zipcode
				Status
			}
		}
	`
	const [getDrones, { loading: droneLoading, data: droneData }] = useLazyQuery(
		GET_DRONES
	)

	if (droneData) {
		tableData = []
		droneData.managerViewDrones?.map((drone: any) =>
			tableData.push({
				DroneID: drone.DroneID,
				Operator: drone.Operator,
				Radius: drone.Radius,
				Zipcode: drone.Zipcode,
				Status: drone.Status,
			})
		)
	}

	const table = <DataTable columns={tableColumns} data={tableData} />

	// Other functions
	const clickedFilter = (e: any) => {
		e.preventDefault()
		getDrones({ variables: { Username, ID, Radius: parseInt(Radius) } })
	}

	const clickedReset = (e: any) => {
		e.preventDefault()
		setID('')
		setRadius('')
		getDrones({ variables: { Username } })
	}

	const clickedBack = () => {
		props.history.push('/')
	}

	// Autofocus DroneID
	const droneIDField = useRef(null)
	useEffect(() => {
		getDrones({ variables: { Username, ID, Radius: parseInt(Radius) } })

		setTimeout(function () {
			if (droneIDField.current) {
				//@ts-ignore
				droneIDField.current.focus()
			}
		}, 100)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
					<Heading>Chain Manager View Drones</Heading>
				</Box>
				<Flex
					direction="row"
					alignContent="center"
					alignItems="center"
					justifyContent="center"
				>
					<FormControl maxWidth={200}>
						<FormLabel textAlign="center">Drone ID</FormLabel>
						<Input
							ref={droneIDField}
							type="number"
							placeholder="Filter by Drone ID"
							value={ID}
							onChange={(e) => setID(e.target.value)}
						/>
					</FormControl>
					<FormControl maxWidth={200} ml={5}>
						<FormLabel textAlign="center">Radius</FormLabel>
						<Input
							type="number"
							placeholder="Filter by Radius >="
							value={Radius}
							onChange={(e) => setRadius(e.target.value)}
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
							disabled={droneLoading}
						>
							Filter
						</Button>
					</FormControl>
					<FormControl ml={50} maxWidth={10}>
						<FormLabel textAlign="center" opacity="0.0">
							hi
						</FormLabel>
						<Button
							type="submit"
							onClick={clickedReset}
							background="red"
							disabled={droneLoading}
						>
							Reset
						</Button>
					</FormControl>
				</Flex>
				{table}
			</VStack>
		</Box>
	)
}
export default ManagerViewDrones
