import { gql } from 'apollo-server'

export default gql`
	type Admin {
		Username: String!
	}
	type Chain {
		ChainName: String!
	}
	type Customer {
		Username: String!
		CcNumber: String!
		CVV: Int!
		EXP_DATE: String!
	}
	type Drone {
		ID: Int!
		DroneStatus: String!
		Zip: Int!
		Radius: Int!
		DroneTech: String!
	}
	type DroneTech {
		Username: String!
		ChainName: String!
		StoreName: String!
	}
	type DroneTechZip {
		Username: String!
	}
	type Employee {
		Username: String!
	}
	type Item {
		ItemName: String!
		ItemType: String!
		Origin: String!
		Organic: String!
	}
	type Manager {
		Username: String!
		ChainName: String!
	}
	type Store {
		StoreName: String!
		ChainName: String!
		Zipcode: Int!
		Street: String!
		City: String!
		State: String!
	}
	type StoreZip {
		Zipcode: Int!
	}
	type User {
		Username: String!
		Pass: String!
		FirstName: String!
		LastName: String!
		Street: String!
		City: String!
		State: String!
		Zipcode: Int!
	}
	type ViewCustomer {
		Username: String!
		Name: String!
		Address: String!
	}
	type Query {
		login(Username: String!, Pass: String!): User!
		getUserType(Username: String!): String!
		viewCustomers(Username: String!): [ViewCustomer!]
		viewFilteredCustomers(
			Username: String!
			FirstName: String
			LastName: String
		): [ViewCustomer!]
		viewChains(Username: String!): [Chain!]
		viewDroneZips(Username: String!): [StoreZip!]
		viewDroneTechs(Username: String!, Zipcode: String!): [DroneTechZip!]
		getLatestDroneID(Username: String!): String!
	}
	type Mutation {
		registerCustomer(
			Username: String!
			Pass: String!
			ConfirmPass: String!
			FirstName: String!
			LastName: String!
			Street: String!
			City: String!
			State: String!
			Zipcode: String!
			CcNumber: String!
			CVV: String!
			EXP_DATE: String!
		): User!
		registerEmployee(
			Username: String!
			Pass: String!
			ConfirmPass: String!
			FirstName: String!
			LastName: String!
			Street: String!
			City: String!
			State: String!
			Zipcode: String!
			ChainName: String!
			StoreName: String
		): User!
		createGroceryChain(Username: String!, ChainName: String!): Chain!
		createGroceryStore(
			Username: String!
			ChainName: String!
			StoreName: String!
			Street: String!
			City: String!
			State: String!
			Zipcode: String!
		): Store!
		createDrone(
			Username: String!
			DroneStatus: String!
			Zip: String!
			Radius: String!
			DroneTech: String!
		): Drone!
		createItem(
			Username: String!
			ItemName: String!
			ItemType: String!
			Origin: String!
			Organic: String!
		): Item!
	}
`
