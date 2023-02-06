import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from './components/layout/Header';
import Companies from './containers/Companies';
import Articles from './containers/Articles';
import './App.css';
import {AuthProvider} from './context/AuthContext';

const App = () => (
	<BrowserRouter>
		<AuthProvider>
			<Header />
			<div className="container main">
				<Routes>
					<Route path="/" element={<Companies />} />
					<Route path="/companies" element={<Companies />} />
					<Route path="/articles" element={<Articles />} />
					<Route path="*" element={<div> The pages does not exist</div>} />
				</Routes>
			</div>
		</AuthProvider>
	</BrowserRouter>
);
export default App;
