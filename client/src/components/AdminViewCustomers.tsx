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
	FormLabel,
	Input,
} from '@chakra-ui/react'
import DataTable from '../components/DataTable'

interface AdminViewCustomersProps {
	history: any
}
function AdminViewCustomers(props: AdminViewCustomersProps) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	type row = {
		Username: string
		Name: string
		Address: string
	}

	// Set states
	const [FirstName, setFirstName] = useState('')
	const [LastName, setLastName] = useState('')

	var tableData: row[] = []
	var tableColumns: Column<row>[] = [
		{
			Header: 'Username',
			accessor: 'Username',
		},
		{
			Header: 'Name',
			accessor: 'Name',
		},
		{
			Header: 'Address',
			accessor: 'Address',
			//@ts-ignore
			disableSortBy: true,
		},
	]

	// graphql query
	const VIEW_CUSTOMERS = gql`
		query viewCustomers(
			$Username: String!
			$FirstName: String
			$LastName: String
		) {
			viewCustomers(
				Username: $Username
				FirstName: $FirstName
				LastName: $LastName
			) {
				Username
				Name
				Address
			}
		}
	`
	const [
		getCustomers,
		{ loading: customerLoading, data: customerData },
	] = useLazyQuery(VIEW_CUSTOMERS)

	if (customerData) {
		tableData = []
		customerData.viewCustomers?.map((customer: any) =>
			tableData.push({
				Username: customer.Username,
				Name: customer.Name,
				Address: customer.Address,
			})
		)
	}

	// Other functionos
	const clickedBack = () => {
		props.history.push('/')
	}

	const clickedSearch = (e: any) => {
		e.preventDefault()
		getCustomers({ variables: { Username, FirstName, LastName } })
	}

	const clickedReset = (e: any) => {
		e.preventDefault()
		getCustomers({ variables: { Username } })
		setFirstName('')
		setLastName('')
	}

	const table = <DataTable columns={tableColumns} data={tableData} />

	// Auto focus
	const firstNameField = useRef(null)
	useEffect(() => {
		if (!customerLoading) {
			getCustomers({ variables: { Username, FirstName, LastName } })
		}
		setTimeout(function () {
			if (firstNameField.current) {
				//@ts-ignore
				firstNameField.current.focus()
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
					lg: '850',
				}}
			>
				<Box textAlign="center">
					<Heading>Admin View Customers</Heading>
				</Box>
				<Flex direction="row" alignItems="center" justifyContent="center">
					<FormLabel>Customer</FormLabel>
					<Input
						ref={firstNameField}
						placeholder="First"
						onChange={(e) => setFirstName(e.target.value)}
						value={FirstName}
					/>
					<Input
						placeholder="Last"
						onChange={(e) => setLastName(e.target.value)}
						value={LastName}
						ml={5}
					/>
					<Button
						type="submit"
						ml={5}
						width={200}
						onClick={clickedSearch}
						background={buttonBackground}
						disabled={customerLoading}
					>
						Filter
					</Button>
					<Button
						type="submit"
						ml={5}
						width={200}
						onClick={clickedReset}
						background="red"
						disabled={customerLoading}
					>
						Reset
					</Button>
				</Flex>
				{table}
			</VStack>
		</Box>
	)
}
export default AdminViewCustomers
