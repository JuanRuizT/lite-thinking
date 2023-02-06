import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Authenticator} from '@aws-amplify/ui-react';
import {Amplify} from 'aws-amplify';
import App from './App';
import awsExports from './aws-exports';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import authComponents from './components/login/authComponents';
import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

Amplify.configure(awsExports);

root.render(
	<React.StrictMode>
		<Authenticator components={authComponents}>
			<App />
		</Authenticator>
	</React.StrictMode>
);
