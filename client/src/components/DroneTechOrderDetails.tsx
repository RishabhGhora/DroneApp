import { gql, useQuery } from '@apollo/client'
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
import DataTable from './DataTable'

function DroneTechOrderDetails(props: any) {
	const OrderID = props.location.state.key
	const buttonBackground = useColorModeValue('brand.blue', 'lime')

	type row = {
		Item: string
		Count: number
	}

	var tableData: row[] = []
	var tableColumns: Column<row>[] = [
		{
			Header: 'Item',
			accessor: 'Item',
		},
		{
			Header: 'Count',
			accessor: 'Count',
		},
	]

	// graphql queries
	const VIEW_ORDER_DETAILS = gql`
		query viewOrderDetails($OrderID: String!) {
			viewOrderDetails(OrderID: $OrderID) {
				CustomerName
				OrderID
				TotalAmount
				TotalItems
				DateOfPurchase
				DroneID
				StoreAssociate
				Status
				Address
			}
		}
	`

	const { data: orderDetailsData } = useQuery(VIEW_ORDER_DETAILS, {
		variables: { OrderID },
	})

	const CustomerName = orderDetailsData
		? orderDetailsData.viewOrderDetails[0].CustomerName
		: 'Loading'
	const TotalAmount = orderDetailsData
		? orderDetailsData.viewOrderDetails[0].TotalAmount
		: 'Loading'
	const TotalItems = orderDetailsData
		? orderDetailsData.viewOrderDetails[0].TotalItems
		: 'Loading'
	const DateOfPurchase = orderDetailsData
		? new Date(
				parseInt(orderDetailsData.viewOrderDetails[0].DateOfPurchase)
		  ).toDateString()
		: 'Loading'
	const DroneID =
		orderDetailsData && orderDetailsData.viewOrderDetails[0].DroneID
			? orderDetailsData.viewOrderDetails[0].DroneID
			: 'N/A'
	const StoreAssociate =
		orderDetailsData && orderDetailsData.viewOrderDetails[0].StoreAssociate
			? orderDetailsData.viewOrderDetails[0].StoreAssociate
			: 'N/A'
	const Status = orderDetailsData
		? orderDetailsData.viewOrderDetails[0].Status
		: 'Loading'
	const Address = orderDetailsData
		? orderDetailsData.viewOrderDetails[0].Address
		: 'Loading'

	const GET_ITEMS = gql`
		query getOrderDetailItems($OrderID: String!) {
			getOrderDetailItems(OrderID: $OrderID) {
				Item
				Count
			}
		}
	`

	const { data: orderDetailItemsData } = useQuery(GET_ITEMS, {
		variables: { OrderID },
	})

	if (orderDetailItemsData) {
		tableData = []
		//eslint-disable-next-line
		orderDetailItemsData.getOrderDetailItems?.map((order: any) => {
			tableData.push({
				Item: order.Item,
				Count: order.Count,
			})
		})
	}

	// Other functions
	const clickedBack = () => {
		props.history.push('/dronetechviewstoreorders')
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
					lg: '750',
				}}
			>
				<Box textAlign="center">
					<Heading>Order Details</Heading>
				</Box>
				<Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
					<form>
						<Flex
							direction="row"
							alignContent="center"
							alignItems="center"
							justifyContent="center"
						>
							<FormControl maxWidth={200}>
								<FormLabel>Customer Name</FormLabel>
								<Input
									onChange={() => {}}
									value={CustomerName}
									contentEditable={false}
								/>
							</FormControl>
							<FormControl ml={5}>
								<FormLabel>Address</FormLabel>
								<Input
									onChange={() => {}}
									value={Address}
									contentEditable={false}
								/>
							</FormControl>
						</Flex>
						<Flex
							mt={5}
							direction="row"
							alignContent="center"
							alignItems="center"
							justifyContent="center"
						>
							<FormControl>
								<FormLabel>Order ID</FormLabel>
								<Input
									onChange={() => {}}
									value={OrderID}
									contentEditable={false}
								/>
							</FormControl>
							<FormControl ml={5}>
								<FormLabel>Total Amount</FormLabel>
								<Input
									onChange={() => {}}
									value={TotalAmount}
									contentEditable={false}
								/>
							</FormControl>
							<FormControl ml={5}>
								<FormLabel>Total Items</FormLabel>
								<Input
									onChange={() => {}}
									value={TotalItems}
									contentEditable={false}
								/>
							</FormControl>
						</Flex>
						<Flex
							mt={5}
							direction="row"
							alignContent="center"
							alignItems="center"
							justifyContent="center"
						>
							<FormControl>
								<FormLabel>Date of Purchase</FormLabel>
								<Input
									onChange={() => {}}
									value={DateOfPurchase}
									contentEditable={false}
								/>
							</FormControl>
							<FormControl ml={5}>
								<FormLabel>Status</FormLabel>
								<Input
									onChange={() => {}}
									value={Status}
									contentEditable={false}
								/>
							</FormControl>
						</Flex>
						<Flex
							mt={5}
							direction="row"
							alignContent="center"
							alignItems="center"
							justifyContent="center"
						>
							<FormControl>
								<FormLabel>Drone ID</FormLabel>
								<Input
									onChange={() => {}}
									value={DroneID}
									contentEditable={false}
								/>
							</FormControl>
							<FormControl ml={5}>
								<FormLabel>Store Associate</FormLabel>
								<Input
									onChange={() => {}}
									value={StoreAssociate}
									contentEditable={false}
								/>
							</FormControl>
						</Flex>
					</form>
				</Box>
				<Box>Items</Box>
				{table}
			</VStack>
		</Box>
	)
}
export default DroneTechOrderDetails
