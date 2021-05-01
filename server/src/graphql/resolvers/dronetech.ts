import { UserInputError, AuthenticationError } from 'apollo-server'
import { getConnection } from 'typeorm'
import Drone from '../../entity/Drone'
// import ChainItem from '../../entity/ChainItem'
import DroneTech from '../../entity/DroneTech'
import Order from '../../entity/Order'
// import User from '../../entity/User'

export default {
	Query: {
		getAvailableDroneIDS: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				// Check if user is Drone Tech
				const droneTech = await DroneTech.findOne({
					where: { Username },
				})
				if (!droneTech) {
					throw new AuthenticationError('Unauthenticated')
				}
				const droneIDS = await getConnection().query(
					`
					select ID 
					from DRONE 
					where DroneStatus = 'Available' 
					and DroneTech = ?;
					`,
					[Username]
				)
				return droneIDS
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		viewStoreOrders: async (
			_: any,
			args: { Username: string; startDate: string; endDate: string }
		) => {
			let { Username, startDate, endDate } = args
			let errors: any = {}
			try {
				// Check if user is Drone Tech
				const droneTech = await DroneTech.findOne({
					where: { Username },
				})

				if (!droneTech) {
					throw new AuthenticationError('Unauthenticated')
				}

				if (startDate) {
					if (
						startDate.split('-').length !== 3 ||
						startDate.split('-')[0].length !== 4 ||
						startDate.split('-')[1].length > 2 ||
						startDate.split('-')[2].length > 2
					) {
						errors.startDate = 'Date should be in YYYY-MM-dd format'
					}
				}
				if (endDate) {
					if (
						endDate.split('-').length !== 3 ||
						endDate.split('-')[0].length !== 4 ||
						endDate.split('-')[1].length > 2 ||
						endDate.split('-')[2].length > 2
					) {
						errors.endDate = 'Date should be in YYYY-MM-dd format'
					}
				}

				if (Object.keys(errors).length > 0) {
					throw errors
				}

				const StoreName = droneTech.StoreName

				const droneOrders = await getConnection().query(
					`
          select ID, concat(Firstname, ' ', Lastname) as Operator, OrderDate, DroneID, OrderStatus, Total 
          from
          (select ID, Operator, OrderDate, DroneID, OrderStatus,
          Total_for_order as Total
           from (select temp.ID, drone.DroneTech as Operator, OrderDate, DroneID, OrderStatus  from 
          (select ID, temp2.Zipcode, temp2.Chainname, Storename, DroneID, OrderStatus, OrderDate from
           (select ID, Zipcode, Chainname, DroneID, OrderStatus, OrderDate from 
           (select ID, zipcode, DroneID, OrderStatus, OrderDate from orders join users on orders.CustomerUsername = users.Username)
           as temp1
          join
          (select distinct(orderID), chainname from contains order by orderid) as temp
          on temp.orderid = temp1.ID order by ID) as temp2
          join
          store on temp2.zipcode = store.zipcode and temp2.chainname = store.chainname
          order by ID) as temp
          left outer join drone on drone.ID = temp.droneID order by id) as temp
          
          
          join
          
          
            (select *, sum(total_price) as total_for_order 
            from (select OrderID, chain_item.price, contains.chainname,
            contains.quantity, (price*contains.quantity) as total_price 
            from contains 
            join chain_item on chain_item.PLUnumber = contains.PLUNumber and 
            chain_item.chainname = contains.chainname order by orderid) as temp
            group by orderid) as price_temp on temp.ID = price_temp.OrderID
            
            
          where 
          ((temp.OrderDate >= ? or ? is null) and (temp.OrderDate <= ? or ? is null)) and
          (ID in 
          (select ID from
           (select ID, Zipcode, Chainname, DroneID, OrderStatus from 
           (select ID, zipcode, DroneID, OrderStatus from orders join users on orders.CustomerUsername = users.Username)
           as temp1
          join
          (select distinct(orderID), chainname from contains order by orderid) as temp
          on temp.orderid = temp1.ID order by ID) as temp2
          join
          store on temp2.zipcode = store.zipcode and temp2.chainname = store.chainname 
          where storename = ?
          order by ID))
          order by ID) as temp_final2
          
          
          left outer join
          
          users on users.username = temp_final2.Operator
          
          order by ID
          ;
          `,
					[startDate, startDate, endDate, endDate, StoreName]
				)
				return droneOrders
			} catch (err) {
				console.log(err)
				throw new UserInputError('Bad Input', { errors })
			}
		},
		viewOrderDetails: async (_: any, args: { OrderID: string }) => {
			let { OrderID } = args
			let errors: any = {}
			try {
				// Will always be a drone tech
				const orderDetails = await getConnection().query(
					`
					select customer_name as 'CustomerName', temp.ID as 'OrderID',
					total_for_order as 'TotalAmount', total_items as 'TotalItems',
					orderdate as 'DateOfPurchase', DroneID as 'DroneID', 
					concat(firstname, ' ', lastname) as 'StoreAssociate',
					orderstatus as 'Status', Address from 

					(select customer_name , temp.ID ,
					total_for_order , total_items ,
					orderdate , DroneID , dronetech ,
					orderstatus , Address

					 from 
					(select * from (select concat(firstname, ' ', lastname) as Customer_Name, ID, OrderDate,
					DroneID, orderstatus, concat(street, ', ', city, ', ', state, ' ', zipcode) as Address 
					from orders 
					join users on users.username = orders.customerusername 
					where id = ?) as temp
					join
					(select orderid, sum(total_item_price) as total_for_order, sum(quantity) as total_items from (select orderid, contains.plunumber, contains.quantity, 
					price as item_price, price*contains.quantity as total_item_price  from contains 
					join chain_item on chain_item.plunumber = contains.plunumber and 
					chain_item.chainname = contains.chainname order by orderid) as temp 
					group by orderid order by orderid) as temp1
					on temp.ID = temp1.orderid) as temp

					left outer join 

					drone on temp.droneid = drone.id) as temp
					join users on users.username = temp.dronetech
					;
					`,
					[OrderID]
				)

				if (orderDetails.length === 0) {
					// Try
					const orderDetails2 = await getConnection().query(
						`
						select customer_name as 'CustomerName', temp.ID as 'OrderID',
						total_for_order as 'TotalAmount', total_items as 'TotalItems',
						orderdate as 'DateOfPurchase', DroneID as 'DroneID', 
						null as 'StoreAssociate',
						orderstatus as 'Status', Address from 

						(select customer_name , temp.ID ,
						total_for_order , total_items ,
						orderdate , DroneID , dronetech ,
						orderstatus , Address

						 from 
						(select * from (select concat(firstname, ' ', lastname) as Customer_Name, ID, OrderDate,
						DroneID, orderstatus, concat(street, ', ', city, ', ', state, ' ', zipcode) as Address 
						from orders 
						join users on users.username = orders.customerusername 
						where id = ?) as temp
						join
						(select orderid, sum(total_item_price) as total_for_order, sum(quantity) as total_items from (select orderid, contains.plunumber, contains.quantity, 
						price as item_price, price*contains.quantity as total_item_price  from contains 
						join chain_item on chain_item.plunumber = contains.plunumber and 
						chain_item.chainname = contains.chainname order by orderid) as temp 
						group by orderid order by orderid) as temp1
						on temp.ID = temp1.orderid) as temp

						left outer join 

						drone on temp.droneid = drone.id) as temp
						join users limit 1;
						`,
						[OrderID]
					)
					if (!orderDetails2) {
						errors.OrderID = 'Cannot find order'
						throw errors
					}
					return orderDetails2
				}

				if (!orderDetails) {
					errors.OrderID = 'Cannot find order'
					throw errors
				}
				return orderDetails
			} catch (err) {
				console.log(err)
				throw new UserInputError('Bad Input', { errors })
			}
		},
		getOrderDetailItems: async (_: any, args: { OrderID: string }) => {
			let { OrderID } = args
			let errors: any = {}
			try {
				const orderDetailItems = await getConnection().query(
					`
					select ItemName as 'Item', Quantity as 'Count' from contains 
					where orderID = ?;
					`,
					[OrderID]
				)
				if (!orderDetailItems) {
					errors.orderItems = 'Cannot find order items'
					throw errors
				}
				return orderDetailItems
			} catch (err) {
				console.log(err)
				throw new UserInputError('Bad input', { errors })
			}
		},
		viewAssignedDrones: async (
			_: any,
			args: { Username: string; DroneID: string; Status: string }
		) => {
			let { Username, DroneID, Status } = args
			try {
				// Check if user is Drone Tech
				const droneTech = await DroneTech.findOne({
					where: { Username },
				})
				if (!droneTech) {
					throw new AuthenticationError('Unauthenticated')
				}

				const drones = await getConnection().query(
					`
					select ID, DroneStatus, Radius 
					from drone
					where dronetech = ? and 
					(ID like ? or ? is null) and 
					(DroneStatus = ? or ?='Any');
					`,
					[Username, '%' + DroneID + '%', DroneID, Status, Status]
				)
				return drones
			} catch (err) {
				console.log(err)
				throw err
			}
		},
	},
	Mutation: {
		assignOrder: async (
			_: any,
			args: {
				Username: string
				droneUsers: string
				droneIDS: string
				orderStats: string
				orderIDS: string
				isNewUser: string
			}
		) => {
			let {
				Username,
				droneUsers,
				droneIDS,
				orderStats,
				orderIDS,
				isNewUser,
			} = args
			let errors: any = {}
			try {
				// Check if user is Drone Tech
				const droneTech = await DroneTech.findOne({
					where: { Username },
				})
				if (!droneTech) {
					throw new AuthenticationError('Unauthenticated')
				}

				const DroneUsers = droneUsers.split(',')
				const DroneIDS = droneIDS.split(',')
				const OrderStats = orderStats.split(',')
				const OrderIDS = orderIDS.split(',')
				const IsNewUser = isNewUser.split(',')
				for (let i = 0; i < DroneUsers.length - 1; i++) {
					if (
						(DroneUsers[i] === 'N/A' ||
							DroneIDS[i] === 'N/A' ||
							OrderStats[i] === 'Pending') &&
						IsNewUser[i] === 'true'
					) {
						errors.button = 'Could not save. Please check your input'
						throw errors
					}
				}

				for (let i = 0; i < DroneUsers.length - 1; i++) {
					if (IsNewUser[i] === 'true') {
						// New order assignment
						const order = await Order.findOne({
							where: { ID: OrderIDS[i] },
						})
						if (!order) {
							errors.button = 'Count not save'
							throw errors
						}
						order.DroneID = parseInt(DroneIDS[i])
						order.OrderStatus = OrderStats[i]
						await order.save()

						const drone = await Drone.findOne({
							where: { ID: DroneIDS[i] },
						})
						if (!drone) {
							errors.button = 'could not save'
							throw errors
						}
						drone.DroneStatus = 'Busy'
						await drone.save()
					} else if (OrderStats[i] === 'Delivered') {
						// Order is delivered
						const order = await Order.findOne({
							where: { ID: OrderIDS[i] },
						})
						if (!order) {
							errors.button = 'Could not save'
							throw errors
						}
						order.OrderStatus = OrderStats[i]
						await order.save()
						const drone = await Drone.findOne({
							where: { ID: parseInt(DroneIDS[i]) },
						})
						if (!drone) {
							errors.button = 'Could not save'
							throw errors
						}
						drone.DroneStatus = 'Available'
						await drone.save()
					} else {
						// Update previously assigned order
						const order = await Order.findOne({
							where: { ID: OrderIDS[i] },
						})
						if (!order) {
							errors.button = 'Could not save'
							throw errors
						}
						order.OrderStatus = OrderStats[i]
						await order.save()
					}
				}

				return 'Succussfully updated drone assignments'
			} catch (err) {
				console.log(err)
				throw new UserInputError('Bad Input', { errors })
			}
		},
	},
}
