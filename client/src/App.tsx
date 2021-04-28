import { useEffect, useState } from 'react'
import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Switch } from 'react-router-dom'
import ApolloProvider from './ApolloProvider'
import DynamicRoute from './utils/DynamicRoute'
import Theme from './Theme'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerHome from './pages/CustomerHome'
import DroneTechHome from './pages/DroneTechHome'
import ManagerHome from './pages/ManagerHome'
import AdminHome from './pages/AdminHome'
import Settings from './pages/Settings'
import AdminCreateGroceryChain from './components/AdminCreateGroceryChain'
import AdminCreateDrone from './components/AdminCreateDrone'
import AdminCreateItem from './components/AdminCreateItem'
import AdminViewCustomers from './components/AdminViewCustomers'
import AdminCreateGroceryStore from './components/AdminCreateGroceryStore'

function App() {
	const [homeComp, setHomeComp] = useState('')

	useEffect(() => {
		const userType = localStorage.getItem('userType')
		if (userType) {
			setHomeComp(userType)
		}
	}, [])

	var homeComponent
	if (homeComp === 'Customer') {
		homeComponent = CustomerHome
	} else if (homeComp === 'DroneTech') {
		homeComponent = DroneTechHome
	} else if (homeComp === 'Manager') {
		homeComponent = ManagerHome
	} else if (homeComp === 'Admin') {
		homeComponent = AdminHome
	}

	return (
		<ApolloProvider>
			<ChakraProvider theme={Theme}>
				<BrowserRouter>
					<Switch>
						<DynamicRoute
							exact
							path="/"
							component={homeComponent}
							authenticated
						/>
						<DynamicRoute path="/register" component={Register} guest />
						<DynamicRoute path="/login" component={Login} />
						<DynamicRoute path="/settings" component={Settings} authenticated />
						<DynamicRoute
							path="/admincreategrocerychain"
							component={AdminCreateGroceryChain}
							authenticated
						/>
						<DynamicRoute
							path="/admincreategrocerystore"
							component={AdminCreateGroceryStore}
							authenticated
						/>
						<DynamicRoute
							path="/admincreatedrone"
							component={AdminCreateDrone}
							authenticated
						/>
						<DynamicRoute
							path="/admincreateitem"
							component={AdminCreateItem}
							authenticated
						/>
						<DynamicRoute
							path="/adminviewcustomers"
							component={AdminViewCustomers}
							authenticated
						/>
					</Switch>
				</BrowserRouter>
			</ChakraProvider>
		</ApolloProvider>
	)
}

export default App
