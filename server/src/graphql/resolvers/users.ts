import { UserInputError, AuthenticationError } from 'apollo-server'
import User from '../../entity/User'
import Customer from '../../entity/Customer'
import Manager from '../../entity/Manager'
import Admin from '../../entity/Admin'
import Employee from '../../entity/Employee'
import DroneTech from '../../entity/DroneTech'
import Chain from '../../entity/Chain'
import Store from '../../entity/Store'
import md5 from 'md5'

export default {
	Query: {
		getFullName: async (_: any, args: { Username: string }) => {
			let { Username } = args
			try {
				const user = await User.findOne({
					where: { Username },
				})
				if (!user) {
					throw new AuthenticationError('Unauthenticated')
				}

				return user.FirstName + ' ' + user.LastName
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		login: async (_: any, args: { Username: string; Pass: string }) => {
			const { Username, Pass } = args
			let errors: any = {}
			try {
				if (Username.trim() === '') errors.Username = 'Username cannot be empty'
				if (Pass === '') errors.Pass = 'Password cannot be empty'

				if (Object.keys(errors).length > 0) {
					throw new UserInputError('Bad input', { errors })
				}

				const user = await User.findOne({
					where: { Username },
				})

				if (!user) {
					errors.Username = 'This user does not exist'
					throw new UserInputError('This user does not exist', { errors })
				}

				const correctPassword = md5(Pass) === user.Pass

				if (!correctPassword) {
					errors.Pass = 'password is incorrect'
					throw new UserInputError('password is incorrect', { errors })
				}

				return {
					...user,
				}
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		getUserType: async (_: any, args: { Username: string }) => {
			try {
				let { Username } = args
				const isCustomer = await Customer.findOne({
					where: { Username },
				})
				if (isCustomer) return 'Customer'

				const isDroneTech = await DroneTech.findOne({
					where: { Username },
				})
				if (isDroneTech) return 'DroneTech'

				const isManager = await Manager.findOne({
					where: { Username },
				})
				if (isManager) return 'Manager'

				const isAdmin = await Admin.findOne({
					where: { Username },
				})
				if (isAdmin) return 'Admin'

				throw new AuthenticationError('Unautheneticated')
			} catch (err) {
				console.log(err)
				throw err
			}
		},
	},
	Mutation: {
		registerCustomer: async (
			_: any,
			args: {
				Username: string
				Pass: string
				ConfirmPass: string
				FirstName: string
				LastName: string
				Street: string
				City: string
				State: string
				Zipcode: string
				CcNumber: string
				CVV: string
				EXP_DATE: string
			}
		) => {
			let {
				Username,
				Pass,
				ConfirmPass,
				FirstName,
				LastName,
				Street,
				City,
				State,
				Zipcode,
				CcNumber,
				CVV,
				EXP_DATE,
			} = args
			let errors: any = {}

			try {
				// Check no input is empty
				if (Username.trim() === '') {
					errors.Username = 'Username cannot be empty'
				}
				if (Pass.trim() === '') {
					errors.Pass = 'Password cannot be empty'
				}
				if (FirstName.trim() === '') {
					errors.FirstName = 'First Name cannot be empty'
				}
				if (LastName.trim() === '') {
					errors.LastName = 'Last Name cannot be empty'
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
					errors.Zipcode = 'Zip code cannot be empty'
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
				if (Object.keys(errors).length > 0) {
					throw errors
				}

				// Check password length
				if (Pass.length < 8) {
					errors.Pass = 'Password must be at least 8 characters'
				}
				// Check confirm password
				if (ConfirmPass !== Pass) {
					errors.ConfirmPass = 'Confirm password and password do not match'
				}
				// Check zipcode length
				if (isNaN(Zipcode as any) || Zipcode.length !== 5) {
					errors.Zipcode = 'Zip code must be 5 digits'
				}
				// Check state abbrev length
				if (State.length !== 2) {
					errors.State = 'State must be 2 digits'
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

				// Check if username already exist
				const check = await User.findOne({
					where: { Username },
				})
				if (check) {
					errors.Username = 'This username already exists'
					throw new UserInputError('This username already exists', { errors })
				}

				// Check if credit card is unique
				const check2 = await Customer.findOne({
					where: { CcNumber },
				})
				if (check2) {
					errors.CcNumber = 'This credit card number is already in the system'
					throw new UserInputError(
						'This credit card number is already in the system',
						{ errors }
					)
				}

				const password = md5(Pass)
				const zip = parseInt(Zipcode)
				const user = User.create({
					Username,
					Pass: password,
					FirstName,
					LastName,
					Street,
					City,
					State,
					Zipcode: zip,
				})
				await user.save()

				const cvv = parseInt(CVV)
				const customer = Customer.create({
					Username,
					CcNumber,
					CVV: cvv,
					EXP_DATE,
				})
				await customer.save()
				return user
			} catch (err) {
				console.log(err)
				throw new UserInputError('Bad Input', { errors })
			}
		},
		registerEmployee: async (
			_: any,
			args: {
				Username: string
				Pass: string
				ConfirmPass: string
				FirstName: string
				LastName: string
				Street: string
				City: string
				State: string
				Zipcode: string
				ChainName: string
				StoreName: string
			}
		) => {
			let {
				Username,
				Pass,
				ConfirmPass,
				FirstName,
				LastName,
				Street,
				City,
				State,
				Zipcode,
				ChainName,
				StoreName,
			} = args
			let errors: any = {}

			try {
				// Check no input is empty
				if (Username.trim() === '') {
					errors.Username = 'Username cannot be empty'
				}
				if (Pass.trim() === '') {
					errors.Pass = 'Password cannot be empty'
				}
				if (FirstName.trim() === '') {
					errors.FirstName = 'First Name cannot be empty'
				}
				if (LastName.trim() === '') {
					errors.LastName = 'Last Name cannot be empty'
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
					errors.Zipcode = 'Zip code cannot be empty'
				}
				if (ChainName.trim() === '') {
					errors.ChainName = 'Chain Name cannot be empty'
				}
				if (Object.keys(errors).length > 0) {
					throw errors
				}

				// Check password length
				if (Pass.length < 8) {
					errors.Pass = 'Password must be at least 8 characters'
				}
				// Check confirm password
				if (ConfirmPass !== Pass) {
					errors.ConfirmPass = 'Confirm password and password do not match'
				}
				// Check zipcode length
				if (isNaN(Zipcode as any) || Zipcode.length !== 5) {
					errors.Zipcode = 'Zip code must be 5 digits'
				}
				// Check state abbrev length
				if (State.length !== 2) {
					errors.State = 'State must be 2 digits'
				}
				if (Object.keys(errors).length > 0) {
					throw errors
				}

				// Check if username already exist
				const check = await User.findOne({
					where: { Username },
				})

				if (check) {
					errors.Username = 'This username already exists'
					throw new UserInputError('This username already exists', { errors })
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

				if (StoreName === '') {
					// Register Manager

					// Check if Chain already has a manager
					const check3 = await Manager.findOne({
						where: { ChainName },
					})

					if (check3) {
						errors.ChainName = 'The selected Chain already has a manager'
						throw new UserInputError(
							'The selected Chain already has a manager',
							{ errors }
						)
					}

					// Add User
					const password = md5(Pass)
					const zip = parseInt(Zipcode)
					const user = User.create({
						Username,
						Pass: password,
						FirstName,
						LastName,
						Street,
						City,
						State,
						Zipcode: zip,
					})
					await user.save()

					// Add Employee
					const employee = Employee.create({
						Username,
					})
					await employee.save()

					// Add Manager
					const manager = Manager.create({
						Username,
						ChainName,
					})
					await manager.save()
					return user
				}

				// Register Drone Tech

				// Check if StoreName exists
				const check4 = await Store.findOne({
					where: { StoreName, ChainName, Zipcode: parseInt(Zipcode) },
				})

				if (!check4) {
					errors.StoreName =
						'The Store Name, Chain Name, and Zipcode do not exist'
					throw new UserInputError(
						'The Store Name, Chain Name, and Zipcode do not exist',
						{ errors }
					)
				}

				// Add User
				const password = md5(Pass)
				const zip = parseInt(Zipcode)
				const user = User.create({
					Username,
					Pass: password,
					FirstName,
					LastName,
					Street,
					City,
					State,
					Zipcode: zip,
				})
				await user.save()

				// Add Employee
				const employee = Employee.create({
					Username,
				})
				await employee.save()

				// Add Drone Tech
				const droneTech = DroneTech.create({
					Username,
					StoreName,
					ChainName,
				})
				await droneTech.save()

				return user
			} catch (err) {
				console.log(err)
				throw new UserInputError('Bad Input', { errors })
			}
		},
	},
}
