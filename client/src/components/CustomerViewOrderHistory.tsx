import { useState, useEffect, useRef } from 'react'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
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

function CustomerViewOrderHistory(props: any) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	// Set states
	const [OrderID, setOrderID] = useState('')

	// graphql queries
	const GET_ORDER_IDS = gql`
		query getOrderIDS($Username: String!) {
			getOrderIDS(Username: $Username) {
				ID
			}
		}
	`
	const VIEW_ORDER_HISTORY = gql`
		query viewOrderHistory($Username: String!, $OrderID: String!) {
			viewOrderHistory(Username: $Username, OrderID: $OrderID) {
				TotalAmount
				TotalItems
				DateOfPurchase
				DroneID
				DroneTech
				OrderStatus
			}
		}
	`
	var orderIDS: any
	const { loading: orderIDSLoading, data: orderIDSData } = useQuery(
		GET_ORDER_IDS,
		{
			variables: { Username },
		}
	)

	if (orderIDSData) {
		orderIDS = orderIDSData.getOrderIDS?.map((id: any, i: number) => {
			return (
				<option value={id.ID} key={i}>
					{id.ID}
				</option>
			)
		})
	}

	const placeholder =
		orderIDS && orderIDS.length > 0 ? 'Select Order ID' : 'No Orders Available'

	const [
		getOrderHistory,
		{ loading: orderHistoryLoading, data: orderHistoryData },
	] = useLazyQuery(VIEW_ORDER_HISTORY)

	const TotalAmount = orderHistoryData
		? orderHistoryData.viewOrderHistory?.TotalAmount
		: 'Select Order To see Info'
	const TotalItems = orderHistoryData
		? orderHistoryData.viewOrderHistory?.TotalItems
		: 'Select Order To see Info'

	const DateOfPurchase = orderHistoryData
		? new Date(
				parseInt(orderHistoryData.viewOrderHistory?.DateOfPurchase)
		  ).toDateString()
		: 'Select Order To see Info'
	const DroneID =
		orderHistoryData && orderHistoryData.viewOrderHistory?.DroneID !== 0
			? orderHistoryData.viewOrderHistory?.DroneID
			: 'N/A'
	const DroneTech = orderHistoryData
		? orderHistoryData.viewOrderHistory?.DroneTech
		: 'Select Order to see Info'
	const OrderStatus = orderHistoryData
		? orderHistoryData.viewOrderHistory?.OrderStatus
		: 'Select Order To see Info'

	// Other functions
	const orderIDChanged = (e: any) => {
		e.preventDefault()
		setOrderID(e.target.value)
		getOrderHistory({
			variables: {
				Username,
				OrderID: e.target.value,
			},
		})
	}

	const clickedBack = () => {
		props.history.push('/')
	}

	// Autofocus Chain Name field without errors
	const orderIDField = useRef(null)
	useEffect(() => {
		setTimeout(function () {
			if (orderIDField.current) {
				//@ts-ignore
				orderIDField.current.focus()
			}
		}, 100)
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
					<Heading>Customer View Order History</Heading>
				</Box>
				<Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
					<form>
						<Flex
							direction="row"
							alignContent="center"
							alignItems="center"
							justifyContent="center"
						>
							<FormControl mr={5}>
								<FormLabel textAlign="center">Username</FormLabel>
								<Input
									placeholder="Loading your Username"
									onChange={(e) => {
										// Do nothing
									}}
									//@ts-ignore
									value={Username}
									contentEditable={false}
									disabled={orderIDSLoading}
								/>
							</FormControl>
							<FormControl ml={5}>
								<FormLabel textAlign="center">Order ID</FormLabel>
								<Select
									ref={orderIDField}
									placeholder={placeholder}
									onChange={orderIDChanged}
									value={OrderID}
									disabled={orderHistoryLoading}
								>
									{orderIDS}
								</Select>
							</FormControl>
						</Flex>
						<Flex
							direction="row"
							alignContent="center"
							alignItems="center"
							justifyContent="center"
							mt={5}
						>
							<FormControl mr={5}>
								<FormLabel textAlign="center">Total Amount</FormLabel>
								<Input
									placeholder="N/A"
									onChange={(e) => {
										// Do nothing
									}}
									value={TotalAmount}
									contentEditable={false}
								/>
							</FormControl>
							<FormControl ml={5}>
								<FormLabel textAlign="center">Total Items</FormLabel>
								<Input
									placeholder="N/A"
									onChange={(e) => {
										// Do nothing
									}}
									value={TotalItems}
									contentEditable={false}
								/>
							</FormControl>
						</Flex>
						<Flex
							direction="row"
							alignContent="center"
							alignItems="center"
							justifyContent="center"
							mt={5}
						>
							<FormControl mr={5}>
								<FormLabel textAlign="center">Date of Purchase</FormLabel>
								<Input
									placeholder="N/A"
									onChange={(e) => {
										// Do nothing
									}}
									value={DateOfPurchase}
									contentEditable={false}
								/>
							</FormControl>
							<FormControl ml={5}>
								<FormLabel textAlign="center">Drone ID</FormLabel>
								<Input
									placeholder="N/A"
									onChange={(e) => {
										// Do nothing
									}}
									value={DroneID}
									contentEditable={false}
								/>
							</FormControl>
						</Flex>
						<Flex
							direction="row"
							alignContent="center"
							alignItems="center"
							justifyContent="center"
							mt={5}
						>
							<FormControl mr={5}>
								<FormLabel textAlign="center">Store Associate</FormLabel>
								<Input
									placeholder="N/A"
									onChange={(e) => {
										// Do nothing
									}}
									value={DroneTech}
									contentEditable={false}
								/>
							</FormControl>
							<FormControl ml={5}>
								<FormLabel textAlign="center">Order Status</FormLabel>
								<Input
									placeholder="N/A"
									onChange={(e) => {
										// Do nothing
									}}
									value={OrderStatus}
									contentEditable={false}
								/>
							</FormControl>
						</Flex>
					</form>
				</Box>
			</VStack>
		</Box>
	)
}
export default CustomerViewOrderHistory
