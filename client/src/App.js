import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Navbar from './containers/Layout/Navbar';
import Footer from './containers/Layout/Footer';
import Landing from './containers/Layout/Landing';
import Register from './containers/Auth/Register';
import Login from './containers/Auth/Login';
import Food from './containers/Food/Food';
import Goal from './containers/Goal/Goal';
import * as actions from './store/actions/index';

import './App.css';

class App extends Component {
	componentDidMount() {
		this.props.onTryAutoSignin();
	}

	render() {
		return (
			<div className='App'>
				<Navbar />
				<Route exact path='/' component={Landing} />
				<div className='container'>
					<Route exact path='/register' component={Register} />
					<Route exact path='/login' component={Login} />
					<Route exact path='/food' component={Food} />
					<Route exact path='/goal' component={Goal} />
				</div>
				<Footer />
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onTryAutoSignin: () => dispatch(actions.authCheckState())
	};
};

export default withRouter(
	connect(
		null,
		mapDispatchToProps
	)(App)
);
