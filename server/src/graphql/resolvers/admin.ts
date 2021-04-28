import { UserInputError, AuthenticationError } from 'apollo-server'
import Admin from '../../entity/Admin'
import Chain from '../../entity/Chain'
import Store from '../../entity/Store'
import Drone from '../../entity/Drone'
import Item from '../../entity/Item'
import { getConnection } from 'typeorm'

export default {
	Query: {
		viewCustomers: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				// Check if user is Admin
				const check = await Admin.findOne({
					where: { Username },
				})
				if (!check) {
					throw new AuthenticationError('Unauthenticated')
				}

				const customers = await getConnection().query(
					`
					select CUSTOMER.Username, CONCAT(USERS.FirstName, ' ', USERS.LastName) as Name, 
					CONCAT(USERS.Street, ', ', USERS.City, ', ', USERS.State,', ',USERS.Zipcode) as Address
					from CUSTOMER
					join USERS
					on CUSTOMER.Username = USERS.Username;
					`
				)
				return customers
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		viewFilteredCustomers: async (
			_: any,
			args: { Username: string; FirstName: string; LastName: string }
		) => {
			let { Username, FirstName, LastName } = args
			try {
				// Check if user is Admin
				const check = await Admin.findOne({
					where: { Username },
				})
				if (!check) {
					throw new AuthenticationError('Unauthenticated')
				}

				const customers = await getConnection().query(
					`
					select CUSTOMER.Username, CONCAT(USERS.FirstName, ' ', USERS.LastName) as Name, 
					CONCAT(USERS.Street, ', ', USERS.City, ', ', USERS.State,', ',USERS.Zipcode) as Address
					from CUSTOMER
					join USERS
					on CUSTOMER.Username = USERS.Username
					where USERS.FirstName = ? or USERS.LastName = ?;
					`,
					[FirstName, LastName]
				)
				return customers
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		viewChains: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				// Check if user is Admin
				const check = await Admin.findOne({
					where: { Username },
				})
				if (!check) {
					throw new AuthenticationError('Unauthenticated')
				}
				const chains = await getConnection().query(
					`
					select ChainName 
					from CHAIN
					`
				)
				return chains
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		viewDroneZips: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				// Check if user is Admin
				const check = await Admin.findOne({
					where: { Username },
				})
				if (!check) {
					throw new AuthenticationError('Unauthenticated')
				}
				const droneZips = await getConnection().query(
					`
					select Zipcode 
					from Store
					`
				)
				return droneZips
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		viewDroneTechs: async (
			_: any,
			args: { Username: string; Zipcode: string }
		) => {
			let { Username, Zipcode } = args
			try {
				// Check if user is Admin
				const check = await Admin.findOne({
					where: { Username },
				})
				if (!check) {
					throw new AuthenticationError('Unauthenticated')
				}
				const droneTechs = await getConnection().query(
					`
					select Username 
					from DRONE_TECH 
					join STORE 
					on DRONE_TECH.StoreName = STORE.StoreName 
					and DRONE_TECH.ChainName = STORE.ChainName and zipcode = ?;
					`,
					[Zipcode]
				)
				return droneTechs
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		getLatestDroneID: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				// Check if user is Admin
				const check = await Admin.findOne({
					where: { Username },
				})
				if (!check) {
					throw new AuthenticationError('Unauthenticated')
				}
				const droneID = await getConnection().query(
					`
					select ID from DRONE order by ID desc limit 1;
					`
				)
				return droneID[0].ID
			} catch (err) {
				console.log(err)
				throw err
			}
		},
	},
	Mutation: {
		createGroceryChain: async (
			_: any,
			args: {
				Username: string
				ChainName: string
			}
		) => {
			let { Username, ChainName } = args
			let errors: any = {}

			try {
				// Check if user is Admin
				const check = await Admin.findOne({
					where: { Username },
				})
				if (!check) {
					throw new AuthenticationError('Unauthenticated')
				}

				// Check no input is empty
				if (ChainName.trim() === '') {
					errors.ChainName = 'Chain Name cannot be empty'
				}
				if (Object.keys(errors).length > 0) {
					throw new UserInputError('Bad input', { errors })
				}

				// Check grocery chain does not already exist
				const check2 = await Chain.findOne({
					where: { ChainName },
				})

				if (check2) {
					errors.ChainName = 'The Chain already exists!'
					throw new UserInputError('The Chain already exists!', {
						errors,
					})
				}

				const chain = Chain.create({
					ChainName,
				})
				await chain.save()
				return chain
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		createGroceryStore: async (
			_: any,
			args: {
				Username: string
				ChainName: string
				StoreName: string
				Street: string
				City: string
				State: string
				Zipcode: string
			}
		) => {
			let {
				Username,
				ChainName,
				StoreName,
				Street,
				City,
				State,
				Zipcode,
			} = args
			let errors: any = {}
			try {
				// Check if user is Admin
				const check = await Admin.findOne({
					where: { Username },
				})
				if (!check) {
					throw new AuthenticationError('Unauthenticated')
				}

				// Check no input is empty
				if (ChainName.trim() === '') {
					errors.ChainName = 'Chain Name cannot be empty'
				}
				if (StoreName.trim() === '') {
					errors.StoreName = 'Store Name cannot be empty'
				}
				if (Street.trim() === '') {
					errors.Street = 'Street cannot be empty'
				}
				if (City.trim() === '') {
					errors.City = 'City cannot be empty'
				}
				if (State.trim() === '') {
					errors.State = 'State cannot be empty'
				}
				if (Zipcode.trim() === '') {
					errors.Zipcode = 'Zipcode cannot be empty'
				}
				// Check zipcode length
				if (Zipcode.length !== 5) {
					errors.Zipcode = 'Zip code must be 5 digits'
				}
				// Check state abbrev length
				if (State.length !== 2) {
					errors.State = 'State must be 2 digits'
				}
				if (Object.keys(errors).length > 0) {
					throw new UserInputError('Bad input', { errors })
				}

				// Check if chain name exists
				const check2 = await Chain.findOne({
					where: { ChainName },
				})
				if (!check2) {
					errors.ChainName = 'The selected Chain does not exist'
					throw new UserInputError('The selected Chain does not exist', {
						errors,
					})
				}

				// Check if chain has another store with the same Zip code
				const check3 = await Store.findOne({
					where: { ChainName, Zipcode },
				})
				if (check3) {
					errors.Zipcode =
						'The selected Chain already has a store in this zip code'
					throw new UserInputError(
						'The selected Chain already has a store in this zip code',
						{
							errors,
						}
					)
				}

				// Check if chain + store name already exist
				const check4 = await Store.findOne({
					where: { ChainName, StoreName },
				})
				if (check4) {
					errors.StoreName = 'The selected chain and store name already exist'
					throw new UserInputError(
						'The selected chain and store name already exist',
						{
							errors,
						}
					)
				}

				const zip = parseInt(Zipcode)
				const store = Store.create({
					StoreName,
					ChainName,
					Zipcode: zip,
					Street,
					City,
					State,
				})
				await store.save()
				return store
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		createDrone: async (
			_: any,
			args: {
				Username: string
				DroneStatus: string
				Zip: string
				Radius: string
				DroneTech: string
			}
		) => {
			let { Username, DroneStatus, Zip, Radius, DroneTech } = args
			let errors: any = {}
			try {
				// Check if user is Admin
				const check = await Admin.findOne({
					where: { Username },
				})
				if (!check) {
					throw new AuthenticationError('Unauthenticated')
				}
				// Check no input is empty
				if (Zip.trim() === '') {
					errors.Zip = 'Associated Zip Code cannot be empty'
				}
				if (Radius.trim() === '') {
					errors.Radius = 'Travel Radius cannot be empty'
				}
				if (DroneTech.trim() === '') {
					errors.DroneTech = 'Store Associate cannot be empty'
				}
				if (Object.keys(errors).length > 0) {
					throw new UserInputError('Bad input', { errors })
				}

				// Check if valid Radius
				if (isNaN(Radius as any)) {
					errors.Radius = 'Radius must be a number'
					throw new UserInputError('Radius must be a number', { errors })
				}

				const drone = new Drone()
				drone.DroneStatus = DroneStatus
				drone.Zip = parseInt(Zip)
				drone.Radius = parseInt(Radius)
				drone.DroneTech = DroneTech
				await drone.save()
				return drone
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		createItem: async (
			_: any,
			args: {
				Username: string
				ItemName: string
				ItemType: string
				Origin: string
				Organic: string
			}
		) => {
			let { Username, ItemName, ItemType, Origin, Organic } = args
			let errors: any = {}
			try {
				// Check if user is Admin
				const check = await Admin.findOne({
					where: { Username },
				})
				if (!check) {
					throw new AuthenticationError('Unauthenticated')
				}

				// Check if input is empty
				if (ItemName.trim() === '') {
					errors.ItemName = 'Name cannot be empty'
				}
				if (Origin.trim() === '') {
					errors.Origin = 'Origin cannot be empty'
				}
				if (Object.keys(errors).length > 0) {
					throw new UserInputError('Bad input', { errors })
				}

				// Check if name already exists
				const check2 = await Item.findOne({
					where: { ItemName },
				})
				if (check2) {
					errors.ItemName = 'This Item already exists'
					throw new UserInputError('This Item already exists', { errors })
				}

				const item = Item.create({
					ItemName,
					ItemType,
					Origin,
					Organic,
				})
				await item.save()
				return item
			} catch (err) {
				console.log(err)
				throw err
			}
		},
	},
}
