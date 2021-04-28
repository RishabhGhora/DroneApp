import userResolvers from './users'
import adminResolvers from './admin'

export default {
	Query: {
		...userResolvers.Query,
		...adminResolvers.Query,
	},
	Mutation: {
		...userResolvers.Mutation,
		...adminResolvers.Mutation,
	},
}
