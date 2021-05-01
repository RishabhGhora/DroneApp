import { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
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
} from '@chakra-ui/react'
import DataTable from './DataTable'

function CustomerReviewOrder(props: any) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')
	const StoreName = localStorage.getItem('StoreName')
		? localStorage.getItem('StoreName')
		: 'N/A'

	type row = {
		ChainItemName: string
		Quantity: any
		Price: number
	}

	var tableData: row[] = []
	var tableColumns: Column<row>[] = [
		{
			Header: 'Items',
			accessor: 'ChainItemName',
			//@ts-ignore
			disableSortBy: true,
		},
		{
			Header: 'Quantity',
			accessor: 'Quantity',
			//@ts-ignore
			disableSortBy: true,
		},
		{
			Header: 'Unit Cost',
			accessor: 'Price',
			//@ts-ignore
			disableSortBy: true,
		},
	]

	var customerOrder: any = {}

	// Set states
	const [total, setTotal] = useState(-1)
	const [ChainName, setChainName] = useState('')
	const [placedOrder, setPlacedOrder] = useState('')
	const [isDisabled, setIsDisabled] = useState(false)
	var alert

	// Set error types and states
	interface errorsType {
		CcNumber?: string
	}
	const [errors, setErrors]: [errorsType, any] = useState({})

	// graphql queries
	const REVIEW_ORDER = gql`
		query reviewOrder($Username: String!) {
			reviewOrder(Username: $Username) {
				ChainItemName
				ChainName
				Quantity
				Orderlimit
				Price
			}
		}
	`

	const { loading: reviewOrderDataLoading, data: reviewOrderData } = useQuery(
		REVIEW_ORDER,
		{
			variables: { Username },
		}
	)

	const updateOrder = (e: any) => {
		const chainItemName = e.target.outerHTML.split('"')[1]
		customerOrder[chainItemName][0] = parseInt(e.target.value)
		let newTotal = 0
		const keys = Object.keys(customerOrder)
		for (let i = 0; i < keys.length; i++) {
			const element = document.getElementById(keys[i])
			//@ts-ignore
			newTotal += element?.value * customerOrder[keys[i]][1]
		}
		setTotal(parseFloat(newTotal.toFixed(2)))
	}

	var noOrder: boolean = false
	if (reviewOrderData && reviewOrderData.reviewOrder?.length === 0) {
		noOrder = true
	} else if (reviewOrderData) {
		let newTotal = 0
		tableData = []
		//eslint-disable-next-line
		reviewOrderData.reviewOrder?.map((item: any) => {
			if (ChainName === '') {
				setChainName(item.ChainName)
			}
			customerOrder[item.ChainItemName] = [item.Quantity, item.Price]
			newTotal += item.Quantity * item.Price
			let quantityOptions = []
			for (let i = 0; i < item.Orderlimit + 1; i++) {
				quantityOptions.push(
					<option key={i} value={i}>
						{i}
					</option>
				)
			}
			tableData.push({
				ChainItemName: item.ChainItemName,
				Quantity: (
					<Select
						disabled={reviewOrderDataLoading}
						id={item.ChainItemName}
						onChange={updateOrder}
						defaultValue={item.Quantity}
					>
						{quantityOptions}
					</Select>
				),
				Price: item.Price,
			})
		})
		if (total === -1) {
			setTotal(parseFloat(newTotal.toFixed(2)))
		}
	}

	// graphql mutation
	const PLACE_ORDER = gql`
		mutation placeOrder(
			$Username: String!
			$itemNames: String!
			$quantities: String!
		) {
			placeOrder(
				Username: $Username
				itemNames: $itemNames
				quantities: $quantities
			)
		}
	`

	const [
		placeOrder,
		{ loading: placeOrderLoading, data: placeOrderData },
	] = useMutation(PLACE_ORDER, {
		update: (_, data: any) => {
			if (data) {
				setErrors({})
				setPlacedOrder(data.data.placeOrder)
			}
		},
		onError: (err) => {
			//@ts-ignore
			setErrors(err.graphQLErrors[0].extensions.errors)
		},
	})

	// Other functions
	const clickedOrder = (e: any) => {
		e.preventDefault()
		var ItemNames: string = ''
		var Quantities: string = ''
		const keys = Object.keys(customerOrder)
		for (let i = 0; i < keys.length; i++) {
			const element = document.getElementById(keys[i])
			ItemNames += keys[i] + ','
			//@ts-ignore
			Quantities += element?.value + ','
		}

		placeOrder({
			variables: {
				Username,
				itemNames: ItemNames,
				quantities: Quantities,
			},
		})
	}

	const clickedBack = () => {
		props.history.push('/')
	}

	const exitAlert = () => {
		alert = null
		setPlacedOrder('')
		setIsDisabled(false)
		localStorage.removeItem('StoreName')
		props.history.push('/')
	}

	// Autofocus Chain Name field without errors
	// const itemNameField = useRef(null)
	// useEffect(() => {
	// 	setTimeout(function () {
	// 		if (itemNameField.current) {
	// 			//@ts-ignore
	// 			itemNameField.current.focus()
	// 		}
	// 	}, 100)
	// }, [])

	// Show alert
	if (placedOrder !== '') {
		if (!isDisabled) {
			setIsDisabled(true)
		}
		alert = (
			<Stack spacing={3}>
				<Alert status="success" variant="left-accent">
					<AlertIcon />
					{placeOrderData?.placeOrder}. Exiting takes you back to home screen.
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

	const table = noOrder ? (
		<Box>You have no order in progress.</Box>
	) : (
		<DataTable columns={tableColumns} data={tableData} />
	)

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
					<Heading>Customer Review Order</Heading>
				</Box>
				<Flex
					direction="row"
					alignContent="center"
					alignItems="center"
					justifyContent="center"
				>
					<Box>Chain</Box>
					<Input
						ml={5}
						onChange={() => {}}
						value={ChainName}
						contentEditable={false}
					></Input>
					<Box ml={5}>Store</Box>
					<Input
						ml={5}
						onChange={() => {}}
						value={StoreName ? StoreName : 'N/A'}
						contentEditable={false}
					></Input>
				</Flex>
				{alert}
				{table}
				<Box fontSize={20} fontWeight={700}>
					Total: $ {noOrder ? 0 : total}
				</Box>
				<FormControl isInvalid={errors.CcNumber != null}>
					<Button
						width="full"
						mt={4}
						type="submit"
						onClick={clickedOrder}
						background={buttonBackground}
						disabled={placeOrderLoading || isDisabled}
					>
						Place Order
					</Button>
					<FormErrorMessage>{errors.CcNumber}</FormErrorMessage>
				</FormControl>
			</VStack>
		</Box>
	)
}
export default CustomerReviewOrder
