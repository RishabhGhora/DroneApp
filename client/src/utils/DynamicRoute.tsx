import { Route, Redirect } from 'react-router-dom'

export default function DynamicRoute(props: any) {
	const Username = localStorage.getItem('Username')
	const userType = localStorage.getItem('userType')

	if (props.authenticated && !Username) {
		return <Redirect to="/login" />
	} else if (props.guest && Username) {
		return <Redirect to="/" />
	} else if (Username === null && userType === null) {
		return <Route component={props.component} {...props} />
	} else if (
		props.path !== '/' &&
		props.path !== '/settings' &&
		!props.path.includes(userType?.toLowerCase())
	) {
		return <Redirect to="/" />
	} else {
		return <Route component={props.component} {...props} />
	}
}
