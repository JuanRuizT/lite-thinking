import {createContext, useState, useEffect, useContext} from 'react';
import {Auth} from '@aws-amplify/auth';

const authContext = createContext();

export const AuthProvider = ({children}) => {
	const [user, setUser] = useState({
		email: '',
		groups: ''
	});

	useEffect(() => {
		const fetchData = async () => {
			const groups = (await Auth.currentAuthenticatedUser()).signInUserSession.accessToken.payload['cognito:groups'];
			const email = (await Auth.currentUserInfo())?.attributes?.email;
			setUser({email, groups});
		};
		fetchData();
	}, []);

	return (
		<authContext.Provider
			value={{
				user
			}}>
			{children}
		</authContext.Provider>
	);
};

export const useAuthContext = () => useContext(authContext);
