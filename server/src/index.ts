import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { ApolloServer } from 'apollo-server'

import resolvers from './graphql/resolvers'
import typeDefs from './graphql/typedefs'

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

;(async (_) => {
	try {
		// Need to rety connection to DB while its starting up
		let numRetries = 10
		while (numRetries > 0) {
			try {
				await createConnection()
				console.log(`🥞 DB Connection Ready`)
				break
			} catch (err) {
				// console.log(err)
				numRetries -= 1
				console.log(`Attempting DB connection ${numRetries} more times.`)
				await new Promise((res) => setTimeout(res, 3000))
			}
		}

		const { url } = await server.listen()
		console.log(`🚀 Server ready at ${url}`)
	} catch (err) {
		console.log(err)
	}
})()
