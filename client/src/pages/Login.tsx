import { useEffect, useRef, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import {
	Button,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Box,
	VStack,
	Heading,
	Input,
	Link,
	useColorModeValue,
} from '@chakra-ui/react'

interface LoginProps {}
function Login(props: LoginProps) {
	const buttonBackground = useColorModeValue('brand.blue', 'lime')
	const [Username, setUsername] = useState('')
	const [Pass, setPassword] = useState('')
	interface errorsType {
		Username?: string
		Pass?: string
	}
	const [errors, setErrors]: [errorsType, any] = useState({})

	// Graphql Query
	const GET_USER_TYPE = gql`
		query getUserType($Username: String!) {
			getUserType(Username: $Username)
		}
	`
	const [getUserType] = useLazyQuery(GET_USER_TYPE, {
		onError: (err) => {
			alert(err)
		},
		onCompleted: (data) => {
			localStorage.setItem('userType', data.getUserType)
			window.location.href = '/'
		},
	})

	const LOGIN_USER = gql`
		query login($Username: String!, $Pass: String!) {
			login(Username: $Username, Pass: $Pass) {
				Username
				FirstName
			}
		}
	`
	const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
		onError: (err) => {
			console.log(err)
			//@ts-ignore
			setErrors(err.graphQLErrors[0].extensions.errors)
		},
		onCompleted(data) {
			localStorage.setItem('Username', data.login.Username)
			localStorage.setItem('FirstName', data.login.FirstName)
			getUserType({ variables: { Username: data.login.Username } })
		},
	})

	// On Submit
	const submitForm = (e: any) => {
		e.preventDefault()
		loginUser({ variables: { Username, Pass } })
	}

	//autofocus username field without errors
	const usernameField = useRef(null)
	useEffect(() => {
		setTimeout(function () {
			if (usernameField.current) {
				//@ts-ignore
				usernameField.current.focus()
			}
		}, 100)
	}, [])

	return (
		<VStack
			align="stretch"
			textAlign="center"
			mx="auto"
			p={10}
			pl={4}
			pr={4}
			spacing={8}
			maxW={{
				lg: '750',
			}}
		>
			<Box textAlign="center">
				<Heading>Login</Heading>
			</Box>
			<Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
				<form>
					<FormControl isRequired isInvalid={errors.Username != null}>
						<FormLabel>Username</FormLabel>
						<Input
							ref={usernameField}
							placeholder="Username"
							onChange={(e) => setUsername(e.target.value)}
							value={Username}
						/>
						<FormErrorMessage>{errors.Username}</FormErrorMessage>
					</FormControl>
					<FormControl isRequired mt={6} isInvalid={errors.Pass != null}>
						<FormLabel>Password</FormLabel>
						<Input
							type="password"
							placeholder="********"
							onChange={(e) => setPassword(e.target.value)}
							value={Pass}
						/>
						<FormErrorMessage>{errors.Pass}</FormErrorMessage>
					</FormControl>
					<Button
						width="full"
						mt={4}
						type="submit"
						onClick={submitForm}
						disabled={loading}
						background={buttonBackground}
					>
						Sign In
					</Button>
				</form>
			</Box>
			<Box align="center">
				<Link href="/register">{"Don't have an account? Sign Up"}</Link>
			</Box>
		</VStack>
	)
}

export default Login
