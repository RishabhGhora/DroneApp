import { UserInputError, AuthenticationError } from 'apollo-server'
import Manager from '../../entity/Manager'
import DroneTech from '../../entity/DroneTech'
import ChainItem from '../../entity/ChainItem'
import { getConnection } from 'typeorm'

export default {
	Query: {
		getChainName: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				// Check if user is Manager
				const manager = await Manager.findOne({
					where: { Username },
				})
				if (!manager) {
					throw new AuthenticationError('Unauthenticated')
				}
				return manager
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		getItems: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				// Check if user is Manager
				const manager = await Manager.findOne({
					where: { Username },
				})
				if (!manager) {
					throw new AuthenticationError('Unauthenticated')
				}
				const items = await getConnection().query(
					`
					select ItemName from ITEM;
					`
				)
				return items
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		getLatestPLUNumber: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				// Check if user is Manager
				const manager = await Manager.findOne({
					where: { Username },
				})
				if (!manager) {
					throw new AuthenticationError('Unauthenticated')
				}
				const ChainName = manager.ChainName
				const PLUNumber = await getConnection().query(
					`
          select PLUNumber 
          from CHAIN_ITEM 
          where ChainName = ?
          order by PLUNumber desc limit 1;
          `,
					[ChainName]
				)
				return PLUNumber[0]
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		managerViewDroneTechs: async (
			_: any,
			args: { Username: string; StoreName: string; droneTechUsername: string }
		) => {
			let { Username, StoreName, droneTechUsername } = args
			try {
				// Check if user is Manager
				const manager = await Manager.findOne({
					where: { Username },
				})
				if (!manager) {
					throw new AuthenticationError('Unauthenticated')
				}

				// Get chain name for manager
				const ChainName = manager.ChainName

				// Check which query to execute
				if (StoreName && droneTechUsername) {
					const droneTechs = await getConnection().query(
						`
            select Username,concat(FirstName," ",LastName) AS Name, StoreName AS Location 
            from DRONE_TECH 
            natural join USERS 
            where ChainName = ? and StoreName = ? and Username like ? ;
            `,
						[ChainName, StoreName, '%' + droneTechUsername + '%']
					)
					return droneTechs
				} else if (StoreName) {
					const droneTechs = await getConnection().query(
						`
            select Username,concat(FirstName," ",LastName) AS Name, StoreName AS Location 
            from DRONE_TECH 
            natural join USERS 
            where ChainName = ? and StoreName = ?;
            `,
						[ChainName, StoreName]
					)
					return droneTechs
				} else if (droneTechUsername) {
					const droneTechs = await getConnection().query(
						`
            select Username,concat(FirstName," ",LastName) AS Name, StoreName AS Location 
            from DRONE_TECH 
            natural join USERS 
            where ChainName = ? and Username like ?;
            `,
						[ChainName, '%' + droneTechUsername + '%']
					)
					return droneTechs
				}
				const droneTechs = await getConnection().query(
					`
          select Username,concat(FirstName," ",LastName) AS Name, StoreName AS Location 
          from DRONE_TECH 
          natural join USERS 
          where ChainName = ? ;
          `,
					[ChainName]
				)
				return droneTechs
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		managerViewDrones: async (
			_: any,
			args: { Username: string; ID: string; Radius: number }
		) => {
			let { Username, ID, Radius } = args
			try {
				// Check if user is Manager
				const manager = await Manager.findOne({
					where: { Username },
				})
				if (!manager) {
					throw new AuthenticationError('Unauthenticated')
				}

				if (ID && Radius) {
					const drones = await getConnection().query(
						`
						select ID as DroneID,DRONE_TECH.Username as Operator, 
						Radius, Zip as Zipcode, DroneStatus as Status
						from MANAGER, DRONE_TECH, DRONE 
						where MANAGER.ChainName = DRONE_TECH.ChainName 
						and DRONE.DroneTech = DRONE_TECH.Username 
						and MANAGER.Username = ? and DRONE.ID like ? and DRONE.Radius >= ?;
						`,
						[Username, '%' + ID + '%', Radius]
					)
					return drones
				} else if (ID) {
					const drones = await getConnection().query(
						`
						select ID as DroneID,DRONE_TECH.Username as Operator, 
						Radius, Zip as Zipcode, DroneStatus as Status
						from MANAGER, DRONE_TECH, DRONE 
						where MANAGER.ChainName = DRONE_TECH.ChainName 
						and DRONE.DroneTech = DRONE_TECH.Username 
						and MANAGER.Username = ? and DRONE.ID like ?;
						`,
						[Username, '%' + ID + '%']
					)
					return drones
				} else if (Radius) {
					const drones = await getConnection().query(
						`
						select ID as DroneID,DRONE_TECH.Username as Operator, 
						Radius, Zip as Zipcode, DroneStatus as Status
						from MANAGER, DRONE_TECH, DRONE 
						where MANAGER.ChainName = DRONE_TECH.ChainName 
						and DRONE.DroneTech = DRONE_TECH.Username 
						and MANAGER.Username = ? and DRONE.Radius >= ?;
						`,
						[Username, Radius]
					)
					return drones
				}

				const drones = await getConnection().query(
					`
					select ID as DroneID,DRONE_TECH.Username as Operator, 
					Radius, Zip as Zipcode, DroneStatus as Status
					from MANAGER, DRONE_TECH, DRONE 
					where MANAGER.ChainName = DRONE_TECH.ChainName 
					and DRONE.DroneTech = DRONE_TECH.Username 
					and MANAGER.Username = ?;
					`,
					[Username]
				)
				return drones
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		getLocations: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				// Check if user is Manager
				const manager = await Manager.findOne({
					where: { Username },
				})
				if (!manager) {
					throw new AuthenticationError('Unauthenticated')
				}
				const ChainName = manager.ChainName
				const locations = await getConnection().query(
					`
          select StoreName 
          from STORE 
          where ChainName = ?;
          `,
					[ChainName]
				)
				return locations
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		managerViewStores: async (
			_: any,
			args: {
				Username: string
				StoreName: string
				minTotal: number
				maxTotal: number
			}
		) => {
			let { Username, StoreName, minTotal, maxTotal } = args
			try {
				// Check if user is Manager
				const manager = await Manager.findOne({
					where: { Username },
				})
				if (!manager) {
					throw new AuthenticationError('Unauthenticated')
				}

				const stores = await getConnection().query(
					`
					SELECT Store.StoreName, 
					concat(Store.Street," ",Store.City,", ",Store.State," ",Store.Zipcode) AS Address, 
					count(distinct ID) AS Orders,
					(count(DISTINCT Drone_Tech.Username) + count(DISTINCT MANAGER.Username)) AS Employees, 
					sum(price*quantity) AS Total
					FROM (SELECT CONTAINS.PLUNumber, CONTAINS.Quantity, Price, DroneStatus, DroneTech, ORDERS.ID, 
					OrderStatus, CustomerUsername, DroneID, STORE.ChainName, Street, City, State, Zipcode, Zip
					FROM CHAIN_ITEM, DRONE, ORDERS, STORE, CONTAINS
					WHERE DRONE.ID = DroneID
					AND ZipCode = Zip
					AND CONTAINS.ChainName = CHAIN_ITEM.ChainName
					AND CONTAINS.PLUNumber = CHAIN_ITEM.PLUNumber
					AND CONTAINS.OrderID = Orders.ID
					AND CONTAINS.ChainName = Store.ChainName) AS TableAlias
					RIGHT OUTER JOIN Drone_Tech ON Username = DroneTech
					LEFT OUTER JOIN MANAGER ON MANAGER.ChainName = Drone_Tech.ChainName
					RIGHT OUTER JOIN Store ON Drone_Tech.StoreName = Store.StoreName
					WHERE  MANAGER.Username = ?
					AND (? IS NULL OR ? = Store.StoreName)
					GROUP BY StoreName, Address
					HAVING (Total IS NOT NULL)
					AND ((? >= Total AND ? IS NULL)
					OR (? <= Total AND ? IS NULL)
					OR (? <= Total AND Total <= ?)
					OR (? IS NULL AND ? IS NULL)); 
					`,
					[
						Username,
						StoreName,
						StoreName,
						maxTotal,
						minTotal,
						minTotal,
						maxTotal,
						minTotal,
						maxTotal,
						minTotal,
						maxTotal,
					]
				)
				return stores
			} catch (err) {
				console.log(err)
				throw err
			}
		},
	},
	Mutation: {
		createChainItem: async (
			_: any,
			args: {
				Username: string
				ChainItemName: string
				PLUNumber: string
				Orderlimit: string
				Quantity: string
				Price: string
			}
		) => {
			let {
				Username,
				ChainItemName,
				PLUNumber,
				Orderlimit,
				Quantity,
				Price,
			} = args
			let errors: any = {}
			try {
				// Check if user is Manager
				const manager = await Manager.findOne({
					where: { Username },
				})
				if (!manager) {
					throw new AuthenticationError('Unauthenticated')
				}

				const ChainName = manager.ChainName
				// Check no input is empty
				if (ChainItemName.trim() === '') {
					errors.ChainItemName = 'Chain Item Name cannot be empty'
				}
				if (PLUNumber.trim() === '') {
					errors.PLUNumber = 'PLUNumber cannot be empty'
				}
				if (Orderlimit.trim() === '') {
					errors.Orderlimit = 'Order Limit cannot be empty'
				}
				if (Quantity.trim() === '') {
					errors.Quantity = 'Quantity cannot be empty'
				}
				if (Price.trim() === '') {
					errors.Price = 'Price cannot be empty'
				}
				if (Object.keys(errors).length > 0) {
					throw errors
				}

				// Check if valid number inputs
				if (parseInt(Orderlimit) < 0) {
					errors.Orderlimit = 'Order Limit must be greater than 0'
				}
				if (parseInt(Quantity) < 0) {
					errors.Quantity = 'Quantity must be greater than 0'
				}
				if (parseInt(Price) < 0) {
					errors.Price = 'Price must be greater than 0'
				}
				if (Object.keys(errors).length > 0) {
					throw errors
				}

				const chainItem = ChainItem.create({
					ChainItemName,
					ChainName,
					PLUNumber: parseInt(PLUNumber),
					Orderlimit: parseInt(Orderlimit),
					Quantity: parseInt(Quantity),
					Price: parseFloat(Price),
				})
				await chainItem.save()
				return chainItem
			} catch (err) {
				console.log(err)
				throw new UserInputError('Bad input', { errors })
			}
		},
		reassignDroneTechnician: async (
			_: any,
			args: {
				Username: string
				droneTechUsername: string
				StoreName: string
			}
		) => {
			let { Username, droneTechUsername, StoreName } = args
			let errors: any = {}
			try {
				// Check if user is Manager
				const manager = await Manager.findOne({
					where: { Username },
				})
				if (!manager) {
					throw new AuthenticationError('Unauthenticated')
				}
				const ChainName = manager.ChainName

				// Get new zip code
				const Zipcode = await getConnection().query(
					`
					select Zipcode 
					from Store 
					where ChainName = ? and StoreName = ?;
					`,
					[ChainName, StoreName]
				)
				if (!Zipcode) {
					errors.StoreName = 'This store does not exist'
					throw new errors()
				}

				const droneTech = await DroneTech.findOne({
					where: { Username: droneTechUsername },
				})
				if (!droneTech) {
					errors.droneTechName = 'This drone tech does not exist'
					throw new errors()
				}

				if (droneTech.StoreName === StoreName) {
					return 0
				}

				const updatingDrones = await getConnection().query(
					`
					update DRONE 
					set Zip = ?
					where DroneTech = ?;
					`,
					[Zipcode[0].Zipcode, droneTechUsername]
				)

				droneTech.StoreName = StoreName
				await droneTech.save()
				return updatingDrones.affectedRows
			} catch (err) {
				console.log(err)
				throw new UserInputError('Bad input', { errors })
			}
		},
	},
}
