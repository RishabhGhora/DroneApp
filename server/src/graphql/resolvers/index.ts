import userResolvers from './users'
import adminResolvers from './admin'
import managerResolvers from './manager'
import customerResolvers from './customer'
import dronetechResolvers from './dronetech'

export default {
	Query: {
		...userResolvers.Query,
		...adminResolvers.Query,
		...managerResolvers.Query,
		...customerResolvers.Query,
		...dronetechResolvers.Query,
	},
	Mutation: {
		...userResolvers.Mutation,
		...adminResolvers.Mutation,
		...managerResolvers.Mutation,
		...customerResolvers.Mutation,
		...dronetechResolvers.Mutation,
	},
}
