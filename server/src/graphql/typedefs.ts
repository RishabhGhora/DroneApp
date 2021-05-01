import { gql } from 'apollo-server'

export default gql`
	type Admin {
		Username: String!
	}
	type Chain {
		ChainName: String!
	}
	type ChainItem {
		ChainItemName: String!
		ChainName: String!
		PLUNumber: Int!
		Orderlimit: Int!
		Quantity: Int!
		Price: Float!
	}
	type Contains {
		OrderID: Int!
		ItemName: String!
		ChainName: String!
		PLUNumber: Int!
		Quantity: Int!
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
	type ViewDrone {
		DroneID: Int!
		Operator: String!
		Radius: Int!
		Zipcode: Int!
		Status: String!
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
	type Order {
		ID: Int!
		OrderStatus: String!
		OrderDate: String!
		CustomerUsername: String!
		DroneID: Int
	}
	type ReviewOrder {
		ChainItemName: String!
		ChainName: String!
		Quantity: Int!
		Orderlimit: Int!
		Price: Float!
	}
	type OrderInfo {
		TotalAmount: Float!
		TotalItems: Int!
		DateOfPurchase: String!
		DroneID: Int!
		DroneTech: String!
		OrderStatus: String!
	}
	type OrderDetails {
		CustomerName: String!
		OrderID: Int!
		TotalAmount: Float!
		TotalItems: Int!
		DateOfPurchase: String!
		DroneID: Int
		StoreAssociate: String
		Status: String!
		Address: String!
	}
	type OrderDetailItems {
		Item: String!
		Count: Int!
	}
	type Store {
		StoreName: String!
		ChainName: String!
		Zipcode: Int!
		Street: String!
		City: String!
		State: String!
	}
	type Stores {
		StoreName: String!
		Address: String!
		Orders: Int!
		Employees: Int!
		Total: Float!
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
	type ViewDroneTech {
		Username: String!
		Name: String!
		Location: String!
	}
	type DroneOrder {
		ID: Int!
		Operator: String
		OrderDate: String!
		DroneID: Int
		OrderStatus: String!
		Total: Float!
	}
	type Query {
		login(Username: String!, Pass: String!): User!
		getUserType(Username: String!): String!
		viewCustomers(
			Username: String!
			FirstName: String
			LastName: String
		): [ViewCustomer!]
		viewChains(Username: String!): [Chain!]
		viewDroneZips(Username: String!): [StoreZip!]
		viewDroneTechs(Username: String!, Zipcode: String!): [DroneTechZip!]
		getLatestDroneID(Username: String!): String!
		getChainName(Username: String!): Manager!
		getItems(Username: String!): [Item!]
		getLatestPLUNumber(Username: String!): ChainItem
		managerViewDroneTechs(
			Username: String!
			StoreName: String
			droneTechUsername: String
		): [ViewDroneTech!]
		getLocations(Username: String!): [DroneTech!]
		managerViewDrones(Username: String!, ID: String, Radius: Int): [ViewDrone!]
		managerViewStores(
			Username: String!
			StoreName: String
			minTotal: Float
			maxTotal: Float
		): [Stores!]
		viewOrderHistory(Username: String!, OrderID: String!): OrderInfo!
		getOrderIDS(Username: String!): [Order!]
		getNearbyStores(Username: String!): [Store!]
		viewItems(
			Username: String!
			ChainName: String!
			StoreName: String!
			Category: String!
		): [ChainItem!]
		reviewOrder(Username: String!): [ReviewOrder!]
		viewStoreOrders(
			Username: String!
			startDate: String
			endDate: String
		): [DroneOrder!]
		getFullName(Username: String!): String!
		getAvailableDroneIDS(Username: String!): [Drone!]
		viewOrderDetails(OrderID: String!): [OrderDetails!]
		getOrderDetailItems(OrderID: String!): [OrderDetailItems!]
		viewAssignedDrones(
			Username: String!
			DroneID: String
			Status: String
		): [Drone!]
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
		createChainItem(
			Username: String!
			ChainItemName: String!
			ChainName: String!
			PLUNumber: String!
			Orderlimit: String!
			Quantity: String!
			Price: String!
		): ChainItem!
		reassignDroneTechnician(
			Username: String!
			droneTechUsername: String!
			StoreName: String!
		): Int!
		changeCreditCardInfo(
			Username: String!
			TypedUsername: String!
			FirstName: String!
			LastName: String!
			CcNumber: String!
			CVV: String!
			EXP_DATE: String!
		): Customer!
		startOrder(
			Username: String!
			ChainName: String!
			itemNames: String!
			quantities: String!
		): Order!
		placeOrder(
			Username: String!
			itemNames: String!
			quantities: String!
		): String!
		assignOrder(
			Username: String!
			droneUsers: String!
			droneIDS: String!
			orderStats: String!
			orderIDS: String!
			isNewUser: String!
		): String!
	}
`
