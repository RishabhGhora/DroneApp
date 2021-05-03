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
	FormErrorMessage,
	Alert,
	AlertIcon,
	Stack,
	CloseButton,
	Select,
	IconButton,
} from '@chakra-ui/react'
import DataTable from './DataTable'
import { ExternalLinkIcon } from '@chakra-ui/icons'

function DroneTechViewStoreOrders(props: any) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	type row = {
		ID: number
		Operator: any
		OrderDate: string
		DroneID: any
		OrderStatus: any
		Total: number
		OrderDetails: any
	}

	var tableData: row[] = []
	var tableColumns: Column<row>[] = [
		{
			Header: 'ID',
			accessor: 'ID',
		},
		{
			Header: 'Operator',
			accessor: 'Operator',
			//@ts-ignore
			disableSortBy: true,
		},
		{
			Header: 'Date',
			accessor: 'OrderDate',
		},
		{
			Header: 'Drone ID',
			accessor: 'DroneID',
		},
		{
			Header: 'Status',
			accessor: 'OrderStatus',
		},
		{
			Header: 'Total',
			accessor: 'Total',
		},
		{
			Header: 'Order Details',
			accessor: 'OrderDetails',
		},
	]

	var droneTechOrder: any = {}
	// Set states
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [assignedOrder, setAssignedOrder] = useState('')
	const [isDisabled, setIsDisabled] = useState(false)
	var alert

	// Set error types and states
	interface errorsType {
		startDate?: string
		endDate?: string
		Orderlimit?: string
		Quantity?: string
		Price?: string
	}
	interface assignErrorsType {
		button?: string
	}
	var errors: errorsType = {}

	const [assignErrors, setAssignErrors]: [assignErrorsType, any] = useState({})

	// graphql queries
	const GET_FULL_NAME = gql`
		query getFullName($Username: String!) {
			getFullName(Username: $Username)
		}
	`

	const { data: fullname } = useQuery(GET_FULL_NAME, {
		variables: { Username },
	})

	const GET_AVAILABLE_DRONE_IDS = gql`
		query getAvailableDroneIDS($Username: String!) {
			getAvailableDroneIDS(Username: $Username) {
				ID
			}
		}
	`

	const { data: droneIDSData } = useQuery(GET_AVAILABLE_DRONE_IDS, {
		variables: { Username },
	})

	var droneOptions: any = []
	if (droneIDSData) {
		droneOptions.push(
			<option key="default" value="N/A">
				N/A
			</option>
		)
		droneIDSData.getAvailableDroneIDS?.map((drone: any, i: number) =>
			droneOptions.push(
				<option key={i} value={drone.ID}>
					{drone.ID}
				</option>
			)
		)
	}

	const VIEW_STORE_ORDERS = gql`
		query viewStoreOrders(
			$Username: String!
			$startDate: String
			$endDate: String
		) {
			viewStoreOrders(
				Username: $Username
				startDate: $startDate
				endDate: $endDate
			) {
				ID
				Operator
				OrderDate
				DroneID
				OrderStatus
				Total
			}
		}
	`

	const [
		getStoreOrders,
		{
			loading: storeOrdersLoading,
			data: storeOrdersData,
			error: storeOrdersErrors,
		},
	] = useLazyQuery(VIEW_STORE_ORDERS)

	if (storeOrdersErrors && storeOrdersErrors.graphQLErrors[0].extensions) {
		errors = storeOrdersErrors.graphQLErrors[0].extensions.errors
	}

	const changedStatus = (e: any) => {
		const key = e.target.outerHTML.split('"')[1]
		droneTechOrder[key][2] = e.target.value
	}
	const changedDroneID = (e: any) => {
		const key = e.target.outerHTML.split('"')[1]
		droneTechOrder[key][1] = e.target.value
	}
	const changedOperator = (e: any) => {
		const key = e.target.outerHTML.split('"')[1]
		droneTechOrder[key][0] = e.target.value
	}
	const clickedOrderDetails = (e: any) => {
		const key = e.target.value
		if (key === undefined || key === null || key === '') {
			return
		}
		props.history.push({
			pathname: '/dronetechorderdetails',
			state: { key: key },
		})
	}
	if (storeOrdersData) {
		const FullName = fullname.getFullName
		tableData = []
		//eslint-disable-next-line
		storeOrdersData.viewStoreOrders?.map((order: any) => {
			if (order.Operator === FullName || order.OrderStatus === 'Pending') {
				if (order.OrderStatus === 'Pending') {
					droneTechOrder[order.ID] = [
						order.Operator,
						order.DroneID,
						order.OrderStatus,
						'true',
					]
					// Row with 3 selects
					tableData.push({
						ID: order.ID,
						Operator: (
							<Select minWidth={150} id={order.ID} onChange={changedOperator}>
								<option value={'N/A'}>N/A</option>
								<option value={FullName}>{FullName}</option>
							</Select>
						),
						OrderDate: new Date(parseInt(order.OrderDate))
							.toISOString()
							.split('T')[0],
						DroneID: (
							<Select
								minWidth={100}
								id={order.ID}
								onChange={changedDroneID}
								defaultValue={'N/A'}
							>
								{droneOptions}
							</Select>
						),
						OrderStatus: (
							<Select
								minWidth={150}
								defaultValue="Pending"
								id={order.ID}
								onChange={changedStatus}
							>
								<option value="Pending">Pending</option>
								<option value="Drone Assigned">Drone Assigned</option>
							</Select>
						),
						Total: order.Total,
						OrderDetails: (
							<IconButton
								onClick={clickedOrderDetails}
								background={buttonBackground}
								aria-label="Order Details"
								value={order.ID}
								icon={<ExternalLinkIcon />}
							/>
						),
					})
					return 'hi'
				}
				if (order.OrderStatus !== 'Delivered') {
					droneTechOrder[order.ID] = [
						order.Operator,
						order.DroneID,
						order.OrderStatus,
						'false',
					]
					// Row with 1 select
					tableData.push({
						ID: order.ID,
						Operator: order.Operator,
						OrderDate: new Date(parseInt(order.OrderDate))
							.toISOString()
							.split('T')[0],
						DroneID: order.DroneID,
						OrderStatus: (
							<Select
								id={order.ID}
								defaultValue={order.OrderStatus}
								onChange={changedStatus}
							>
								<option value="Drone Assigned">Drone Assigned</option>
								<option value="In Transit">In Transit</option>
								<option value="Delivered">Delivered</option>
							</Select>
						),
						Total: order.Total,
						OrderDetails: (
							<IconButton
								onClick={clickedOrderDetails}
								background={buttonBackground}
								aria-label="Order Details"
								value={order.ID}
								icon={<ExternalLinkIcon />}
							/>
						),
					})
					return 'hi'
				}
			}
			tableData.push({
				ID: order.ID,
				Operator: order.Operator,
				OrderDate: new Date(parseInt(order.OrderDate))
					.toISOString()
					.split('T')[0],
				DroneID: order.DroneID,
				OrderStatus: order.OrderStatus,
				Total: order.Total,
				OrderDetails: (
					<IconButton
						onClick={clickedOrderDetails}
						background={buttonBackground}
						aria-label="Order Details"
						disabled={storeOrdersLoading}
						value={order.ID}
						icon={<ExternalLinkIcon />}
					/>
				),
			})
		})
	}

	// graphql mutation
	const ASSIGN_ORDER = gql`
		mutation assignOrder(
			$Username: String!
			$droneUsers: String!
			$droneIDS: String!
			$orderStats: String!
			$orderIDS: String!
			$isNewUser: String!
		) {
			assignOrder(
				Username: $Username
				droneUsers: $droneUsers
				droneIDS: $droneIDS
				orderStats: $orderStats
				orderIDS: $orderIDS
				isNewUser: $isNewUser
			)
		}
	`

	const [assignOrder, { loading: assignOrderLoading }] = useMutation(
		ASSIGN_ORDER,
		{
			update: (_, data: any) => {
				if (data) {
					errors = {}
					setAssignErrors({})
					setAssignedOrder(data.data.assignOrder)
				}
			},
			onError: (err) => {
				//@ts-ignore
				setAssignErrors(err.graphQLErrors[0].extensions.errors)
			},
		}
	)

	// Other functions
	const submitForm = (e: any) => {
		e.preventDefault()
		const keys = Object.keys(droneTechOrder)
		var droneUsers: string = ''
		var droneIDS: string = ''
		var orderStats: string = ''
		var orderIDS: string = ''
		var isNewUser: string = ''
		for (let i = 0; i < keys.length; i++) {
			if (droneTechOrder[keys[i]][0] !== null) {
				droneUsers += droneTechOrder[keys[i]][0] + ','
			} else {
				droneUsers += 'N/A,'
			}
			if (droneTechOrder[keys[i]][1] !== null) {
				droneIDS += droneTechOrder[keys[i]][1] + ','
			} else {
				droneIDS += 'N/A,'
			}
			orderStats += droneTechOrder[keys[i]][2] + ','
			orderIDS += keys[i] + ','
			isNewUser += droneTechOrder[keys[i]][3] + ','
		}
		assignOrder({
			variables: {
				Username,
				droneUsers,
				droneIDS,
				orderStats,
				orderIDS,
				isNewUser,
			},
		})
	}

	const clickedBack = () => {
		props.history.push('/')
	}

	const clickedFilter = (e: any) => {
		e.preventDefault()
		if (endDate !== '' && startDate !== '') {
			getStoreOrders({ variables: { Username, startDate, endDate } })
		} else if (endDate !== '') {
			getStoreOrders({ variables: { Username, endDate } })
		} else if (startDate !== '') {
			getStoreOrders({ variables: { Username, startDate } })
		} else {
			getStoreOrders({ variables: { Username } })
		}
	}

	const clickedReset = (e: any) => {
		e.preventDefault()
		errors = {}
		setStartDate('')
		setEndDate('')
		getStoreOrders({ variables: { Username } })
	}

	const exitAlert = () => {
		alert = null
		setAssignedOrder('')
		setIsDisabled(false)
		getStoreOrders({ variables: { Username } })
	}

	// Autofocus Chain Name field without errors
	const startDateField = useRef(null)
	useEffect(() => {
		getStoreOrders({ variables: { Username } })

		setTimeout(function () {
			if (startDateField.current) {
				//@ts-ignore
				startDateField.current.focus()
			}
		}, 100)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Show alert
	if (assignedOrder !== '') {
		if (!isDisabled) {
			setIsDisabled(true)
		}
		alert = (
			<Stack spacing={3}>
				<Alert status="success" variant="left-accent">
					<AlertIcon />
					Succesfully reassigned orders!
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
					lg: '1100',
				}}
			>
				<Box textAlign="center">
					<Heading>View Store Orders</Heading>
				</Box>
				<Flex
					direction="row"
					alignContent="center"
					alignItems="center"
					justifyContent="center"
					width={750}
				>
					<Box>Dates: </Box>
					<FormControl isInvalid={errors.startDate != null}>
						<Input
							ref={startDateField}
							textAlign="center"
							placeholder="filter by start date"
							onChange={(e) => setStartDate(e.target.value)}
							value={startDate}
							maxWidth={200}
						/>
						<FormErrorMessage>{errors.startDate}</FormErrorMessage>
					</FormControl>
					<Box>-</Box>
					<FormControl isInvalid={errors.endDate != null}>
						<Input
							textAlign="center"
							placeholder="filter by end date"
							onChange={(e) => setEndDate(e.target.value)}
							value={endDate}
							maxWidth={200}
						/>
						<FormErrorMessage>{errors.endDate}</FormErrorMessage>
					</FormControl>
					<Button
						maxWidth={100}
						width="full"
						type="submit"
						onClick={clickedFilter}
						background={buttonBackground}
						disabled={storeOrdersLoading}
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
						disabled={storeOrdersLoading}
					>
						Reset
					</Button>
				</Flex>
				{alert}
				{table}
				<FormControl isInvalid={assignErrors.button != null}>
					<Button
						minWidth={200}
						mt={4}
						type="submit"
						onClick={submitForm}
						background={buttonBackground}
						disabled={assignOrderLoading || isDisabled}
					>
						Save
					</Button>
					<FormErrorMessage justifyContent="center">
						{assignErrors.button}
					</FormErrorMessage>
				</FormControl>
			</VStack>
		</Box>
	)
}
export default DroneTechViewStoreOrders
