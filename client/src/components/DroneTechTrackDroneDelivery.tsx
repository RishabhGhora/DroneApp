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
	Input,
	Select,
} from '@chakra-ui/react'
import DataTable from './DataTable'

function DroneTechTrackDroneDelivery(props: any) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	type row = {
		ID: number
		DroneStatus: string
		Radius: number
	}

	var tableData: row[] = []
	var tableColumns: Column<row>[] = [
		{
			Header: 'Drone ID',
			accessor: 'ID',
		},
		{
			Header: 'Drone Status',
			accessor: 'DroneStatus',
		},
		{
			Header: 'Radius',
			accessor: 'Radius',
		},
	]

	// Set states
	const [DroneID, setDroneID] = useState('')
	const [Status, setStatus] = useState('Any')

	// graphql queries
	const VIEW_ASSIGNED_DRONES = gql`
		query ViewAssignedDrones(
			$Username: String!
			$DroneID: String
			$Status: String
		) {
			viewAssignedDrones(
				Username: $Username
				DroneID: $DroneID
				Status: $Status
			) {
				ID
				DroneStatus
				Radius
			}
		}
	`
	const [
		getAssignedDrones,
		{ loading: dronesLoading, data: dronesData },
	] = useLazyQuery(VIEW_ASSIGNED_DRONES)

	if (dronesData) {
		tableData = []
		//eslint-disable-next-line
		dronesData.viewAssignedDrones?.map((drone: any) => {
			tableData.push({
				ID: drone.ID,
				DroneStatus: drone.DroneStatus,
				Radius: drone.Radius,
			})
		})
	}

	// Other functions
	const clickedBack = () => {
		props.history.push('/')
	}

	const clickedFilter = () => {
		if (DroneID !== '') {
			getAssignedDrones({ variables: { Username, DroneID, Status } })
			return
		}
		getAssignedDrones({ variables: { Username, Status } })
	}

	const clickedReset = () => {
		setDroneID('')
		setStatus('Any')
		getAssignedDrones({ variables: { Username, Status: 'Any' } })
	}

	// Autofocus Chain Name field without errors
	const droneIdField = useRef(null)
	useEffect(() => {
		getAssignedDrones({ variables: { Username, Status } })

		setTimeout(function () {
			if (droneIdField.current) {
				//@ts-ignore
				droneIdField.current.focus()
			}
		}, 100)
		//eslint-disable-next-line
	}, [])

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
					lg: '750',
				}}
			>
				<Box textAlign="center">
					<Heading>My Assigned Drones</Heading>
				</Box>
				<Flex
					direction="row"
					alignContent="center"
					alignItems="center"
					justifyContent="center"
				>
					<Box mr={5}>ID</Box>
					<Input
						ref={droneIdField}
						placeholder="Filter by Drone ID"
						value={DroneID}
						onChange={(e) => setDroneID(e.target.value)}
					/>
					<Box mr={5} ml={5}>
						Status
					</Box>
					<Select value={Status} onChange={(e) => setStatus(e.target.value)}>
						<option value="Any">Any</option>
						<option value="Available">Available</option>
						<option value="Busy">Busy</option>
					</Select>
					<Button
						ml={5}
						maxWidth={100}
						width="full"
						type="submit"
						onClick={clickedFilter}
						background={buttonBackground}
						disabled={dronesLoading}
					>
						Filter
					</Button>
					<Button
						ml={5}
						maxWidth={100}
						width="full"
						type="submit"
						onClick={clickedReset}
						background="red"
						disabled={dronesLoading}
					>
						Reset
					</Button>
				</Flex>
				{table}
			</VStack>
		</Box>
	)
}
export default DroneTechTrackDroneDelivery
