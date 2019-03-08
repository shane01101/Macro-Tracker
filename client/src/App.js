import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Landing from './components/Layout/Landing';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';

import './App.css';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className='App'>
					<Navbar />
					<Route exact path='/' component={Landing} />
					<div className='container'>
						<Route exact path='/register' component={Register} />
						<Route exact path='/login' component={Login} />
					</div>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
