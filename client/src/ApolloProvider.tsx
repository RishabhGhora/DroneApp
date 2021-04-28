import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider as Provider,
	createHttpLink,
	split,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

const url = 'http://localhost:4000'
const wsURL = 'ws://localhost:4000/graphql'

let httpLink = createHttpLink({
	uri: url,
})

const authLink = setContext((_, { headers }) => {
	// // get the authentication token from local storage if it exists
	const token = localStorage.getItem('Username')
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	}
})

httpLink = authLink.concat(httpLink)

const wsLink = new WebSocketLink({
	uri: wsURL,
	options: {
		reconnect: true,
		connectionParams: {
			Authorization: `Bearer ${localStorage.getItem('Username')}`,
		},
	},
})

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query)
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		)
	},
	wsLink,
	httpLink
)

const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
	// To disable cache
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'no-cache',
			//   errorPolicy: "ignore",
		},
		query: {
			fetchPolicy: 'no-cache',
			//   errorPolicy: "all",
		},
	},
})

export default function ApolloProvider(props: any) {
	return <Provider client={client} {...props} />
}
