import { UserInputError, AuthenticationError } from 'apollo-server'
import { getConnection } from 'typeorm'
import ChainItem from '../../entity/ChainItem'
import Customer from '../../entity/Customer'
import Order from '../../entity/Order'
import User from '../../entity/User'

export default {
	Query: {
		viewOrderHistory: async (
			_: any,
			args: { Username: string; OrderID: string }
		) => {
			let { Username, OrderID } = args
			try {
				// Check if user is a customer
				const customer = await Customer.findOne({
					where: { Username },
				})
				if (!customer) {
					throw new AuthenticationError('Unauthenticated')
				}

				const orderInfo = await getConnection().query(
					`	
					SELECT 
					SUM(CONTAINS.quantity * chain_item.price) as TotalAmount, 
					SUM(CONTAINS.Quantity) as TotalItems, 
						OrderDate as DateOfPurchase,
						DroneID, 
						DroneTech,
						OrderStatus
						from CONTAINS, CHAIN_ITEM, ORDERS, DRONE
						WHERE 
						DRONE.ID = ORDERS.droneid and
						CONTAINS.OrderID = ? and 
						CONTAINS.ChainName = CHAIN_ITEM.chainname and 
						CONTAINS.ItemName = CHAIN_ITEM.chainitemname and 
						CONTAINS.PLUNumber = CHAIN_ITEM.plunumber and 
						ORDERS.ID = CONTAINS.OrderID and 
								CustomerUsername = ?
					GROUP BY orderid
					`,
					[OrderID, Username]
				)
				if (orderInfo.length !== 0) {
					return orderInfo[0]
				}
				const orderInfo2 = await getConnection().query(
					`
					SELECT 
					SUM(CONTAINS.quantity * chain_item.price) as TotalAmount, 
					SUM(CONTAINS.Quantity) as TotalItems, 
						OrderDate as DateOfPurchase,
						OrderStatus
						from CONTAINS, CHAIN_ITEM, ORDERS
						WHERE 
						CONTAINS.OrderID = ? and 
						CONTAINS.ChainName = CHAIN_ITEM.chainname and 
						CONTAINS.ItemName = CHAIN_ITEM.chainitemname and 
						CONTAINS.PLUNumber = CHAIN_ITEM.plunumber and 
						ORDERS.ID = CONTAINS.OrderID and 
								CustomerUsername = ?
					GROUP BY orderid;
					`,
					[OrderID, Username]
				)
				orderInfo2[0].DroneID = 0
				orderInfo2[0].DroneTech = 'N/A'
				return orderInfo2[0]
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		getOrderIDS: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				// Check if user is a customer
				const customer = await Customer.findOne({
					where: { Username },
				})
				if (!customer) {
					throw new AuthenticationError('Unauthenticated')
				}

				const orderIDS = await getConnection().query(
					`
					select ID 
					from ORDERS 
					where CustomerUsername = ?
					order by OrderDate desc;
					`,
					[Username]
				)
				return orderIDS
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		getNearbyStores: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				// Check if user is a customer
				const customer = await Customer.findOne({
					where: { Username },
				})
				if (!customer) {
					throw new AuthenticationError('Unauthenticated')
				}

				const user = await User.findOne({
					where: { Username },
				})
				const Zipcode = user?.Zipcode
				const nearbyStores = await getConnection().query(
					`
					select StoreName, ChainName 
					from Store 
					where Zipcode = ?;
					`,
					[Zipcode]
				)
				return nearbyStores
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		viewItems: async (
			_: any,
			args: {
				Username: string
				ChainName: string
				StoreName: string
				Category: string
			}
		) => {
			let { Username, ChainName, StoreName, Category } = args
			try {
				// Check if user is a customer
				const customer = await Customer.findOne({
					where: { Username },
				})
				if (!customer) {
					throw new AuthenticationError('Unauthenticated')
				}

				const items = await getConnection().query(
					`
					select distinct ChainItemName, Orderlimit from (
						select ChainItemName, Orderlimit
						from CHAIN_ITEM join STORE 
						on (
							STORE.ChainName = CHAIN_ITEM.ChainName 
							and StoreName = ? 
							and STORE.ChainName = ?
							and STORE.Zipcode = (select Zipcode from USERS where username = ?)
            )        
					) as storeItems, ITEM  
					where storeItems.chainItemName = Item.itemname and 
					ITEM.ItemType = ? or ? = 'ALL';
					`,
					[StoreName, ChainName, Username, Category, Category]
				)
				return items
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		reviewOrder: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				// Check if user is a customer
				const customer = await Customer.findOne({
					where: { Username },
				})
				if (!customer) {
					throw new AuthenticationError('Unauthenticated')
				}

				const order = await getConnection().query(
					`
					SELECT ChainItemName, CHAIN_ITEM.ChainName, CONTAINS.Quantity, Orderlimit, Price
    			from CONTAINS, CHAIN_ITEM, ORDERS
    			where customerUsername = ? and
    			orderid = id and
    			orderStatus = "Creating" and
    			CONTAINS.ItemName = CHAIN_ITEM.chainitemname and
    			CHAIN_ITEM.chainname = CONTAINS.chainname and
    			CHAIN_ITEM.plunumber = CONTAINS.plunumber;
					`,
					[Username]
				)

				return order
			} catch (err) {
				console.log(err)
				throw err
			}
		},
	},
	Mutation: {
		changeCreditCardInfo: async (
			_: any,
			args: {
				Username: string
				TypedUsername: string
				FirstName: string
				LastName: string
				CcNumber: string
				CVV: string
				EXP_DATE: string
			}
		) => {
			let {
				Username,
				TypedUsername,
				FirstName,
				LastName,
				CcNumber,
				CVV,
				EXP_DATE,
			} = args
			let errors: any = {}
			try {
				// Check if user is a customer
				const customer = await Customer.findOne({
					where: { Username },
				})
				if (!customer) {
					throw new AuthenticationError('Unauthenticated')
				}
				// Check if input is empty
				if (TypedUsername.trim() === '') {
					errors.TypedUsername = 'Username cannot be empty'
				}
				if (FirstName.trim() === '') {
					errors.FirstName = 'First Name cannot be empty'
				}
				if (LastName.trim() === '') {
					errors.LastName = 'Last Name cannot be empty'
				}
				if (CcNumber.trim() === '') {
					errors.CcNumber = 'Credit card number cannot be empty'
				}
				if (CVV.trim() === '') {
					errors.CVV = 'CVV cannot be empty'
				}
				if (EXP_DATE.trim() === '') {
					errors.EXP_DATE = 'Expiration date cannot be empty'
				}
				// Check if username matches
				if (Username !== TypedUsername) {
					errors.TypedUsername = 'This is not your username'
				}
				if (Object.keys(errors).length > 0) {
					throw errors
				}

				const user = await User.findOne({
					where: { Username: TypedUsername },
				})
				if (!user) {
					errors.TypedUsername = 'Username does not exist'
					throw errors
				}

				// Check if first name and last name match
				if (FirstName !== user.FirstName) {
					errors.FirstName = 'First Name does not match our records'
				}
				if (LastName !== user.LastName) {
					errors.LastName = 'Last Name does not match our records'
				}
				// Check if valid ccnumber
				if (CcNumber.length !== 16) {
					errors.CcNumber = 'Invalid Credit Card Number'
				}
				// Check if valid CVV
				if (isNaN(CVV as any) || CVV.length !== 3) {
					errors.CCV = 'Invalid CVV Number'
				}
				// Check card exp date
				if (EXP_DATE.split('-').length !== 3) {
					errors.EXP_DATE = 'Date should be in YYYY-MM-dd format'
				} else if (
					EXP_DATE.split('-')[0].length !== 4 ||
					EXP_DATE.split('-')[1].length > 2 ||
					EXP_DATE.split('-')[2].length > 2
				) {
					errors.EXP_DATE = 'Date should be in YYYY-MM-dd format'
				}
				if (Object.keys(errors).length > 0) {
					throw errors
				}

				const year = parseInt(EXP_DATE.split('-')[0])
				const month = parseInt(EXP_DATE.split('-')[1])
				const date = parseInt(EXP_DATE.split('-')[2])
				const exp_date = new Date(year, month, date)
				if (exp_date < new Date()) {
					errors.EXP_DATE = 'Invalid Exp Date'
				}
				if (Object.keys(errors).length > 0) {
					throw errors
				}

				customer.CcNumber = CcNumber
				customer.CVV = parseInt(CVV)
				customer.EXP_DATE = EXP_DATE
				await customer.save()
				return customer
			} catch (err) {
				console.log(err)
				throw new UserInputError('Bad Input', { errors })
			}
		},
		startOrder: async (
			_: any,
			args: {
				Username: string
				ChainName: string
				itemNames: string
				quantities: string
			}
		) => {
			let { Username, ChainName, itemNames, quantities } = args
			let errors: any = {}
			try {
				// Check if user is a customer
				const customer = await Customer.findOne({
					where: { Username },
				})
				if (!customer) {
					throw new AuthenticationError('Unauthenticated')
				}
				const ItemNames = itemNames.split(',')
				const Quantities = quantities.split(',')
				if (!ItemNames || ItemNames.length === 1) {
					errors.orderButton = 'No items selected'
					throw new UserInputError('Bad Input', {
						errors,
					})
				}

				const day = new Date()
				const dd = String(day.getDate()).padStart(2, '0')
				const mm = String(day.getMonth() + 1).padStart(2, '0')
				const yyyy = day.getFullYear()

				const today = yyyy + '-' + mm + '-' + dd
				const order = new Order()
				order.OrderDate = today
				order.OrderStatus = 'Creating'
				order.CustomerUsername = Username
				await order.save()

				const OrderID = order.ID
				for (let i = 0; i < ItemNames.length - 1; i++) {
					await getConnection().query(
						`
						INSERT INTO CONTAINS (OrderID,ItemName,ChainName,PLUNumber,Quantity)
						VALUES (?, ?, ?,
						(select PLUNumber from CHAIN_ITEM where ChainItemName = ? and ChainName = ?), 
						?);
						`,
						[
							OrderID,
							ItemNames[i],
							ChainName,
							ItemNames[i],
							ChainName,
							parseInt(Quantities[i]),
						]
					)
				}

				return order
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		placeOrder: async (
			_: any,
			args: {
				Username: string
				itemNames: string
				quantities: string
			}
		) => {
			let { Username, itemNames, quantities } = args
			let errors: any = {}
			try {
				// Check if user is a customer
				const customer = await Customer.findOne({
					where: { Username },
				})
				if (!customer) {
					throw new AuthenticationError('Unauthenticated')
				}

				const orderRaw = await getConnection().query(
					`
					select ID 
					from ORDERS 
        	where CustomerUsername = ? and orderstatus = "Creating";
					`,
					[Username]
				)

				const orderID = orderRaw[0].ID
				const ItemNames = itemNames.split(',')
				const Quantities = quantities.split(',')

				var notAllZero = false
				for (let j = 0; j < Quantities.length - 1; j++) {
					if (parseInt(Quantities[j]) > 0) {
						notAllZero = true
					}
				}
				if (!notAllZero) {
					// Delete items from CONTAINS
					for (let i = 0; i < ItemNames.length - 1; i++) {
						await getConnection().query(
							`
							DELETE FROM CONTAINS 
							where OrderID = ? and ItemName = ?;
							`,
							[orderID, ItemNames[i]]
						)
					}
					// Delete order
					const order = await Order.findOne({
						where: { ID: orderID },
					})
					if (!order) {
						errors.order = 'order not found'
						throw errors
					}
					order.OrderStatus = 'Cancelled'
					await order.save()
					// Return message
					return 'Sucessfully deleted order'
				}

				// Check Credit Card exp Date
				const day = new Date()
				const dd = String(day.getDate()).padStart(2, '0')
				const mm = String(day.getMonth() + 1).padStart(2, '0')
				const yyyy = day.getFullYear()

				const today = yyyy + '-' + mm + '-' + dd
				if (customer.EXP_DATE.toString().split('T')[0] < today) {
					errors.CcNumber = 'Expired Credit Card'
					throw errors
				}
				for (let i = 0; i < ItemNames.length - 1; i++) {
					if (parseInt(Quantities[i]) === 0) {
						// Delete item from CONTAINS
						await getConnection().query(
							`
							DELETE FROM CONTAINS 
							where OrderID = ? and ItemName = ?;
							`,
							[orderID, ItemNames[i]]
						)
						continue
					}
					// Update Contains
					await getConnection().query(
						`
						UPDATE CONTAINS 
						set Quantity = ?
						where ItemName = ? and OrderID = ?;
						`,
						[Quantities[i], ItemNames[i], orderID]
					)

					const ChainNameRaw = await getConnection().query(
						`
						select ChainName from CONTAINS 
						where orderID = ?
						limit 1;
						`,
						[orderID]
					)
					const ChainName = ChainNameRaw[0].ChainName
					// Update CHAIN_ITEM
					const chainItem = await ChainItem.findOne({
						where: { ChainItemName: ItemNames[i], ChainName },
					})
					if (!chainItem) continue
					const newQuantity = chainItem.Quantity - parseInt(Quantities[i])
					if (newQuantity < 0) {
						// Remove chain item
						await ChainItem.delete({
							ChainItemName: ItemNames[i],
							ChainName,
						})
						continue
					}
					// Save new quantity
					chainItem.Quantity = newQuantity
					await chainItem.save()
				}

				// Change status of order
				await getConnection().query(
					`
					UPDATE ORDERS 
					set OrderStatus = 'Pending'
					where ID = ?;
					`,
					[orderID]
				)
				return 'Sucessfully placed order'
			} catch (err) {
				console.log(err)
				throw new UserInputError('bad user input', { errors })
			}
		},
	},
}
