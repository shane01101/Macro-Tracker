import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import * as actions from '../../store/actions/index';
import MealTable from '../../components/MealTable/MealTable';
// import TextFieldGroup from '../../components/UI/TextFieldGroup';
// import SelectListGroup from '../../components/UI/SelectListGroup';
// import TextAreaFieldGroup from '../../components/UI/TextAreaFieldGroup';

export class AddFood extends Component {
	state = {
		food: '',
		mealOfDay: '',
		description: '',
		date: '',
		error: {},
		calendarDate: new Date()
	};

	componentDidMount() {
		this.props.onGetCurrentProfile(this.props.token);
		console.log('calendarDate', this.state.calendarDate);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.error) {
			this.setState({ error: nextProps.error });
		}
	}

	submitHandler = event => {
		event.preventDefault();

		const foodsHistoryData = {
			food: this.state.food,
			mealOfDay: this.state.mealOfDay,
			description: this.state.description
		};

		this.props.onCreateFoodsHistory(foodsHistoryData, this.props.token);
	};

	inputChangedHandler = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleChange(date) {
		this.setState({
			calendarDate: date
		});

		let day = date.getDate(); //returns date (1 to 31) you can getUTCDate() for UTC date
		let month = date.getMonth() + 1; // returns 1 less than month count since it starts from 0
		let year = date.getFullYear(); //returns year
		console.log('month-day-year', `${month}/${day}/${year}`);
		//console.log('calendarDate in handleChange', this.state.calendarDate);
	}

	render() {
		let breakfestItems = null;
		let lunchItems = null;
		let dinnerItems = null;
		let snackItems = null;
		let breakfestTable = null;
		let lunchTable = null;
		let dinnerTable = null;
		let snackTable = null;

		if (this.props.profile !== null) {
			breakfestItems = this.props.profile.foodsHistory.filter(
				item => item.mealOfDay === 'Breakfest'
			);

			lunchItems = this.props.profile.foodsHistory.filter(
				item => item.mealOfDay === 'Lunch'
			);

			dinnerItems = this.props.profile.foodsHistory.filter(
				item => item.mealOfDay === 'Dinner'
			);

			snackItems = this.props.profile.foodsHistory.filter(
				item => item.mealOfDay === 'Snack'
			);

			breakfestTable = (
				<MealTable
					data={breakfestItems}
					name='Breakfest'
					linkTo={'/addBreakfestFood'}
				/>
			);
			lunchTable = (
				<MealTable data={lunchItems} name='Lunch' linkTo={'/addLunchFood'} />
			);
			dinnerTable = (
				<MealTable data={dinnerItems} name='Dinner' linkTo={'/addDinnerFood'} />
			);
			snackTable = (
				<MealTable data={snackItems} name='Snacks' linkTo={'/addSnackFood'} />
			);
		}

		return (
			<div className='add-food'>
				<div className='container'>
					<DatePicker
						selected={this.state.calendarDate}
						onChange={this.handleChange.bind(this)}
					/>
				</div>
				<div className='container'>{breakfestTable}</div>
				<div className='container'>{lunchTable}</div>
				<div className='container'>{dinnerTable}</div>
				<div className='container'>{snackTable}</div>

				<div className='container'>
					<table className='table'>
						<tbody>
							<tr>
								<th>Totals</th>
								<td>1</td>
								<td>2</td>
								<td>3</td>
							</tr>
							<tr>
								<th>Your Daily Goal</th>
								<td>John</td>
								<td>Peter</td>
								<td>John</td>
							</tr>
							<tr>
								<th>Remaining</th>
								<td>Carter</td>
								<td>Parker</td>
								<td>Rambo</td>
							</tr>
							<tr>
								<th />
								<th>Calories</th>
								<th>Protein</th>
								<th>Carbs</th>
								<th>Fat</th>
								<th>Fiber</th>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		token: state.auth.token,
		profile: state.profile.profile,
		loading: state.profile.loading,
		error: state.profile.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onCreateFoodsHistory: (foodsHistoryData, token) =>
			dispatch(actions.addFoodsHistory(foodsHistoryData, token)),
		onGetCurrentProfile: token => dispatch(actions.fetchCurrentProfile(token))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddFood);