import { useState, useEffect, useRef } from 'react'
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { Column } from 'react-table'
import {
	Box,
	VStack,
	Heading,
	Flex,
	Button,
	useColorModeValue,
	FormControl,
	FormErrorMessage,
	Input,
	FormLabel,
	Alert,
	AlertIcon,
	Stack,
	CloseButton,
	Select,
} from '@chakra-ui/react'
import DataTable from './DataTable'

function CustomerViewStoreItems(props: any) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const Username = localStorage.getItem('Username')

	type row = {
		ChainItemName: string
		Orderlimit: any
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
			accessor: 'Orderlimit',
			//@ts-ignore
			disableSortBy: true,
		},
	]

	var customerOrder: any = {}

	// Error types and states
	interface errorsType {
		orderButton?: string
	}

	// Error states
	const [errors, setErrors]: [errorsType, any] = useState({})

	// Set states
	const [ChainName, setChainName] = useState('')
	const [StoreName, setStoreName] = useState('')
	const [Category, setCategory] = useState('All')
	const [createdOrder, setCreatedOrder] = useState('')
	const [isDisabled, setIsDisabled] = useState(false)
	var alert

	// graphql queries
	const REVIEW_ORDER = gql`
		query reviewOrder($Username: String!) {
			reviewOrder(Username: $Username) {
				ChainItemName
				Quantity
				Price
			}
		}
	`

	const { data: reviewOrderData } = useQuery(REVIEW_ORDER, {
		variables: { Username },
	})

	var orderInProgress: boolean = false
	if (reviewOrderData && reviewOrderData.reviewOrder?.length !== 0) {
		orderInProgress = true
	}

	const GET_STORES = gql`
		query getNearbyStores($Username: String!) {
			getNearbyStores(Username: $Username) {
				StoreName
				ChainName
			}
		}
	`
	const VIEW_ITEMS = gql`
		query viewItems(
			$Username: String!
			$ChainName: String!
			$StoreName: String!
			$Category: String!
		) {
			viewItems(
				Username: $Username
				ChainName: $ChainName
				StoreName: $StoreName
				Category: $Category
			) {
				ChainItemName
				Orderlimit
			}
		}
	`

	var ChainNames: any
	var StoreNames: any
	const { loading: StoresLoading, data: StoresData } = useQuery(GET_STORES, {
		variables: { Username },
	})

	if (StoresData) {
		ChainNames = StoresData.getNearbyStores?.map((store: any, i: number) => {
			return (
				<option value={store.ChainName} key={i}>
					{store.ChainName}
				</option>
			)
		})
		StoreNames = StoresData.getNearbyStores?.map((store: any, i: number) => {
			return (
				<option value={store.StoreName} key={i}>
					{store.StoreName}
				</option>
			)
		})
	}

	const chainPlaceholder =
		ChainNames && ChainNames.length > 0 ? 'Select Chain' : 'No Chains Available'

	const storePlaceholder =
		StoreNames && StoreNames.length > 0 ? 'Select Store' : 'No Stores Available'

	const [getItems, { loading: itemsLoading, data: itemsData }] = useLazyQuery(
		VIEW_ITEMS
	)

	const updateOrder = (e: any) => {
		const chainItemName = e.target.outerHTML.split('"')[1]
		customerOrder[chainItemName][0] = parseInt(e.target.value)
	}

	if (itemsData) {
		tableData = []
		//eslint-disable-next-line
		itemsData.viewItems?.map((item: any) => {
			customerOrder[item.ChainItemName] = [0, item.Orderlimit]
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
				Orderlimit: (
					<Select
						disabled={itemsLoading}
						id={item.ChainItemName}
						onChange={updateOrder}
						defaultValue={0}
					>
						{quantityOptions}
					</Select>
				),
			})
		})
	}

	// graphql mutations
	const START_ORDER = gql`
		mutation startOrder(
			$Username: String!
			$ChainName: String!
			$itemNames: String!
			$quantities: String!
		) {
			startOrder(
				Username: $Username
				ChainName: $ChainName
				itemNames: $itemNames
				quantities: $quantities
			) {
				ID
			}
		}
	`

	const [startOrder, { loading: startOrderLoading }] = useMutation(
		START_ORDER,
		{
			update: (_, data: any) => {
				if (data) {
					setCreatedOrder(data.data.startOrder.ID)
					setErrors({})
				}
			},
			onError: (err) => {
				//@ts-ignore
				setErrors(err.graphQLErrors[0].extensions.errors)
			},
		}
	)

	// Other functions
	const clickedOrder = (e: any) => {
		e.preventDefault()
		var ItemNames: string = ''
		var Quantities: string = ''
		const chainItemNames = Object.keys(customerOrder)
		for (let i = 0; i < chainItemNames.length; i++) {
			if (customerOrder[chainItemNames[i]][0] > 0) {
				ItemNames += chainItemNames[i] + ','
				Quantities += customerOrder[chainItemNames[i]][0] + ','
			}
		}

		startOrder({
			variables: {
				Username,
				ChainName,
				itemNames: ItemNames,
				quantities: Quantities,
			},
		})
	}

	const clickedBack = () => {
		props.history.push('/')
	}

	const clickedReviewOrder = () => {
		props.history.push('/customerrevieworder')
	}

	const clickedView = (e: any) => {
		e.preventDefault()
		getItems({
			variables: {
				Username,
				ChainName,
				StoreName,
				Category,
			},
		})
	}

	const exitAlert = () => {
		alert = null
		setCreatedOrder('')
		setIsDisabled(false)
		localStorage.setItem('StoreName', StoreName)
		props.history.push('/customerrevieworder')
	}

	// Autofocus Chain Name field without errors
	const chainNameField = useRef(null)
	useEffect(() => {
		setTimeout(function () {
			if (chainNameField.current) {
				//@ts-ignore
				chainNameField.current.focus()
			}
		}, 200)
	}, [])

	// Show alert
	if (createdOrder !== '') {
		if (!isDisabled) {
			setIsDisabled(true)
		}
		alert = (
			<Stack spacing={3}>
				<Alert status="success" variant="left-accent">
					<AlertIcon />
					Close to review order.
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

	const table = orderInProgress ? (
		<Box>You already have an order in progress.</Box>
	) : (
		<DataTable columns={tableColumns} data={tableData} />
	)

	const button = orderInProgress ? (
		<Button
			width="full"
			mt={4}
			type="submit"
			onClick={clickedReviewOrder}
			background={buttonBackground}
			disabled={startOrderLoading || isDisabled}
		>
			Review Order
		</Button>
	) : (
		<FormControl isInvalid={errors.orderButton != null}>
			<Button
				width="full"
				type="submit"
				mr={5}
				onClick={clickedOrder}
				background={buttonBackground}
				disabled={startOrderLoading || isDisabled}
			>
				Place Order
			</Button>
			<FormErrorMessage>{errors.orderButton}</FormErrorMessage>
		</FormControl>
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
					<Heading>Customer View Store Items</Heading>
				</Box>
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
							disabled={StoresLoading}
						/>
					</FormControl>
					<FormControl ml={5}>
						<FormLabel textAlign="center">Chain Name</FormLabel>
						<Select
							ref={chainNameField}
							placeholder={chainPlaceholder}
							onChange={(e) => setChainName(e.target.value)}
							value={ChainName}
							disabled={StoresLoading}
						>
							{ChainNames}
						</Select>
					</FormControl>
				</Flex>
				<Flex
					direction="row"
					alignContent="center"
					alignItems="center"
					justifyContent="center"
				>
					<FormControl mr={5}>
						<FormLabel textAlign="center">Category</FormLabel>
						<Select
							onChange={(e) => setCategory(e.target.value)}
							value={Category}
						>
							<option value="All">All</option>
							<option value="Dairy">Dairy</option>
							<option value="Bakery">Bakery</option>
							<option value="Meat">Meat</option>
							<option value="Produce">Produce</option>
							<option value="Personal Care">Personal Care</option>
							<option value="Paper Goods">Paper Goods</option>
							<option value="Beverages">Beverages</option>
							<option value="Other">Other</option>
						</Select>
					</FormControl>
					<FormControl ml={5}>
						<FormLabel textAlign="center">Store Name</FormLabel>
						<Select
							placeholder={storePlaceholder}
							onChange={(e) => setStoreName(e.target.value)}
							value={StoreName}
							disabled={StoresLoading}
						>
							{StoreNames}
						</Select>
					</FormControl>
				</Flex>
				<Flex
					direction="row"
					alignContent="center"
					alignItems="center"
					justifyContent="center"
					maxWidth={750}
				>
					<Button
						width="full"
						mr={15}
						type="submit"
						onClick={clickedView}
						background={buttonBackground}
						disabled={itemsLoading || isDisabled}
					>
						View Items
					</Button>
					{button}
				</Flex>

				{alert}
				{table}
			</VStack>
		</Box>
	)
}
export default CustomerViewStoreItems
