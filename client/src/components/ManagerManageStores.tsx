import { useState, useEffect, useRef } from 'react'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
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
	Select,
} from '@chakra-ui/react'
import DataTable from '../components/DataTable'

function ManagerMangageStores(props: any) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	type row = {
		StoreName: string
		Address: string
		Orders: number
		Employees: number
		Total: number
	}

	var tableData: row[] = []
	var tableColumns: Column<row>[] = [
		{
			Header: 'Name',
			accessor: 'StoreName',
		},
		{
			Header: 'Address',
			accessor: 'Address',
		},
		{
			Header: 'Orders',
			accessor: 'Orders',
		},
		{
			Header: 'Employees',
			accessor: 'Employees',
		},
		{
			Header: 'Total',
			accessor: 'Total',
		},
	]

	// Set states
	const [StoreName, setStoreName] = useState('')
	const [minTotalAmount, setMinTotalAmount] = useState('')
	const [maxTotalAmount, setMaxTotalAmount] = useState('')

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

	const GET_STORES = gql`
		query managerViewStores(
			$Username: String!
			$StoreName: String
			$minTotal: Float
			$maxTotal: Float
		) {
			managerViewStores(
				Username: $Username
				StoreName: $StoreName
				minTotal: $minTotal
				maxTotal: $maxTotal
			) {
				StoreName
				Address
				Orders
				Employees
				Total
			}
		}
	`

	const [
		getStores,
		{ loading: storesLoading, data: storesData },
	] = useLazyQuery(GET_STORES)

	if (storesData) {
		tableData = []
		storesData.managerViewStores?.map((store: any) =>
			tableData.push({
				StoreName: store.StoreName,
				Address: store.Address,
				Orders: store.Orders,
				Employees: store.Employees,
				Total: store.Total,
			})
		)
	}

	const table = <DataTable columns={tableColumns} data={tableData} />

	// Other functions
	const clickedFilter = (e: any) => {
		e.preventDefault()
		if (StoreName === '') {
			getStores({
				variables: {
					Username,
					minTotal: parseFloat(minTotalAmount),
					maxTotal: parseFloat(maxTotalAmount),
				},
			})
			return
		}
		getStores({
			variables: {
				Username,
				StoreName,
				minTotal: parseFloat(minTotalAmount),
				maxTotal: parseFloat(maxTotalAmount),
			},
		})
	}

	const clickedReset = (e: any) => {
		e.preventDefault()
		setStoreName('')
		setMinTotalAmount('')
		setMaxTotalAmount('')
		getStores({ variables: { Username } })
	}

	const clickedBack = () => {
		props.history.push('/')
	}

	// Autofocus DroneID
	const locField = useRef(null)
	useEffect(() => {
		getStores({
			variables: { Username },
		})

		setTimeout(function () {
			if (locField.current) {
				//@ts-ignore
				locField.current.focus()
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
					<Heading>Manage Chain's Stores</Heading>
				</Box>
				<Flex
					direction="row"
					alignContent="center"
					alignItems="center"
					justifyContent="center"
				>
					<FormControl maxWidth={200}>
						<FormLabel textAlign="center">Chain</FormLabel>
						<Input placeholder="Loading" value={ChainName} disabled={true} />
					</FormControl>

					<FormControl maxWidth={200} ml={5}>
						<FormLabel textAlign="center">Name</FormLabel>
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
				</Flex>
				<Flex
					direction="row"
					alignContent="center"
					alignItems="center"
					justifyContent="center"
				>
					<Box>Total Range</Box>
					<Input
						type="number"
						maxWidth={200}
						ml={5}
						placeholder="Min Total Amount"
						onChange={(e) => setMinTotalAmount(e.target.value)}
						value={minTotalAmount}
					/>
					<Box ml={5}>---</Box>
					<Input
						type="number"
						maxWidth={200}
						ml={5}
						placeholder="Max Total Amount"
						onChange={(e) => setMaxTotalAmount(e.target.value)}
						value={maxTotalAmount}
					/>
				</Flex>
				{table}
				<Flex
					direction="row"
					alignContent="center"
					alignItems="center"
					justifyContent="center"
				>
					<FormControl ml={5}>
						<FormLabel textAlign="center" opacity="0.0">
							hi
						</FormLabel>
						<Button
							width="full"
							type="submit"
							onClick={clickedReset}
							background="red"
							disabled={storesLoading}
						>
							Reset
						</Button>
					</FormControl>
					<FormControl ml={5}>
						<FormLabel textAlign="center" opacity="0.0">
							hi
						</FormLabel>
						<Button
							width="full"
							type="submit"
							onClick={clickedFilter}
							background={buttonBackground}
							disabled={storesLoading}
						>
							Filter
						</Button>
					</FormControl>
				</Flex>
			</VStack>
		</Box>
	)
}
export default ManagerMangageStores
