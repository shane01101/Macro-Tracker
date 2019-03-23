import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import * as actions from '../../store/actions/index';
import FoodDiaryTable from '../../components/Table/FoodDiaryTable';
import Spinner from '../../components/UI/Spinner';
// import TextFieldGroup from '../../components/UI/TextFieldGroup';
// import SelectListGroup from '../../components/UI/SelectListGroup';
// import TextAreaFieldGroup from '../../components/UI/TextAreaFieldGroup';

export class FoodDiary extends Component {
	state = {
		food: '',
		mealOfDay: '',
		description: '',
		date: '',
		error: {},
		calendarDate: new Date()
	};

	componentDidMount() {
		// console.log('[FoodDiary.js] componentDidMount this.props', this.props);
		// if a date is selected other than today, set incoming date as selected
		if (this.props.location.state && this.props.location.state.selectedDate) {
			this.setState({ calendarDate: this.props.location.state.selectedDate });
		}

		if (this.props.profile === null)
			this.props.onGetCurrentProfile(this.props.token);

		if (this.props.goal === null) this.props.onGetGoals(this.props.token);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.error) {
			this.setState({ error: nextProps.error });
		}
	}

	submitHandler = event => {
		event.preventDefault();
	};

	inputChangedHandler = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleChange(date) {
		this.setState({
			calendarDate: date
		});
	}

	deleteClickedHandler = rowId => {
		//console.log('[FoodDiary.js] rowId', rowId);
		this.props.onDeleteFoodHistory(rowId, this.props.token);
	};

	isCalendarDate = otherDate => {
		// console.log('[FoodDiary.js] isCalendardate otherDate', otherDate);
		// console.log('otherDate instanceof Date', otherDate instanceof Date);
		// console.log('typeof otherDate', typeof otherDate);

		// use tempDate because otherDate will be a Date String not a Date object
		let tempDate = new Date(otherDate);

		if (
			this.state.calendarDate.getMonth() === tempDate.getMonth() &&
			this.state.calendarDate.getDate() === tempDate.getDate() &&
			this.state.calendarDate.getFullYear() === tempDate.getFullYear()
		)
			return true;

		return false;
	};

	isEqualCalendarDate = (date1, date2) => {
		const date1Obj = new Date(date1);
		const date2Obj = new Date(date2);

		if (
			date1Obj.getMonth() === date2Obj.getMonth() &&
			date1Obj.getDate() === date2Obj.getDate() &&
			date1Obj.getFullYear() === date2Obj.getFullYear()
		)
			return true;

		return false;
	};

	getYesterdaysDate = todaysdate => {
		let theDate = new Date(todaysdate);
		theDate.setDate(theDate.getDate() - 1);
		return theDate;
	};

	copyFromYesterday = (todaysDate, meal) => {
		let todaysDateObj = this.state.calendarDate;
		// console.log('[FoodDiary.js] copyFromYesterday todaysDateObj', todaysDateObj);
		// console.log('[FoodDiary.js] copyFromYesterday meal', meal);
		const yesterdaysMeals = this.props.profile.foodsHistory.filter(
			item =>
				item.mealOfDay === meal &&
				this.isEqualCalendarDate(
					item.date,
					this.getYesterdaysDate(todaysDateObj)
				)
		);

		let foodsHistoryArray = [];

		for (let i = 0; i < yesterdaysMeals.length; i++) {
			// create newItem because yesterdaysMeals stores food array and not food name & change date
			const newItem = {
				foodName: yesterdaysMeals[i].food.name,
				foodId: yesterdaysMeals[i].food._id,
				mealOfDay: yesterdaysMeals[i].mealOfDay,
				serving: yesterdaysMeals[i].serving,
				date: todaysDateObj,
				description: yesterdaysMeals[i].description
			};
			foodsHistoryArray.push(newItem);
		}
		this.props.onCreateFoodsHistoryBulk(foodsHistoryArray, this.props.token);

		// console.log(
		// 	'[AddFoods.js] copyFromYesterday yesterdays meals',
		// 	yesterdaysMeals
		// );
	};

	transformQuickCalories = mealName => {
		const breakfestQuickCalories = this.props.profile.quickAdds.filter(
			item => item.mealOfDay === mealName && this.isCalendarDate(item.date)
		);

		let transformedArray = [];

		for (let i = 0; i < breakfestQuickCalories.length; i++) {
			const newItem = {
				date: breakfestQuickCalories[i].date,
				mealOfDay: breakfestQuickCalories[i].mealOfDay,
				serving: 1,
				food: {
					name: 'Quick add calories',
					calories: breakfestQuickCalories[i].calories,
					protein: breakfestQuickCalories[i].protein,
					carbs: breakfestQuickCalories[i].carbs,
					fat: breakfestQuickCalories[i].fat,
					fiber: breakfestQuickCalories[i].fiber
				}
			};
			transformedArray.push(newItem);
		}
		return transformedArray;
	};

	render() {
		// foodsHistory
		let breakfestItems = null;
		let lunchItems = null;
		let dinnerItems = null;
		let snackItems = null;

		// quick add calories
		let breakfestQuickTransform = null;
		let lunchQuickTransform = null;
		let dinnerQuickTransform = null;
		let snackQuickTransform = null;

		// foodsHistory & quick calories combined
		// let combinedBreakfestItems = null;
		// let combinedLunchItems = null;
		// let combinedDinnerItems = null;
		// let combinedSnackItems = null;
		// let combinedAllItems = null;

		let breakfestTable = null;
		let lunchTable = null;
		let dinnerTable = null;
		let snackTable = null;
		let allTableMeals =
			this.props.profileLoading || this.props.goalsLoading ? (
				<Spinner />
			) : (
				<p>Data can't be loaded</p>
			);

		let calorieSum = 0;
		let proteinSum = 0;
		let carbsSum = 0;
		let fatSum = 0;
		let fiberSum = 0;
		let goalCalories = 0;
		let goalProtein = 0;
		let goalCarbs = 0;
		let goalFat = 0;
		let goalFiber = 0;
		let allItemsInSelectedDay = null;
		let allQuickTransformInSelectedDay = null;

		if (this.props.profile !== null) {
			breakfestItems = this.props.profile.foodsHistory.filter(
				item => item.mealOfDay === 'Breakfest' && this.isCalendarDate(item.date)
			);
			breakfestQuickTransform = this.transformQuickCalories('Breakfest');

			lunchItems = this.props.profile.foodsHistory.filter(
				item => item.mealOfDay === 'Lunch' && this.isCalendarDate(item.date)
			);
			lunchQuickTransform = this.transformQuickCalories('Lunch');

			dinnerItems = this.props.profile.foodsHistory.filter(
				item => item.mealOfDay === 'Dinner' && this.isCalendarDate(item.date)
			);
			dinnerQuickTransform = this.transformQuickCalories('Dinner');

			snackItems = this.props.profile.foodsHistory.filter(
				item => item.mealOfDay === 'Snack' && this.isCalendarDate(item.date)
			);
			snackQuickTransform = this.transformQuickCalories('Snack');

			allItemsInSelectedDay = this.props.profile.foodsHistory.filter(item =>
				this.isCalendarDate(item.date)
			);
			allQuickTransformInSelectedDay = [
				...breakfestQuickTransform,
				...lunchQuickTransform,
				...dinnerQuickTransform,
				...snackQuickTransform
			];

			// combine foodsHistory & quick calories
			const combinedBreakfestItems = [
				...breakfestItems,
				...breakfestQuickTransform
			];
			const combinedLunchItems = [...lunchItems, ...lunchQuickTransform];
			const combinedDinnerItems = [...dinnerItems, ...dinnerQuickTransform];
			const combinedSnackItems = [...snackItems, ...snackQuickTransform];
			const combinedAllItems = [
				...allItemsInSelectedDay,
				...allQuickTransformInSelectedDay
			];

			breakfestTable = (
				<FoodDiaryTable
					data={combinedBreakfestItems}
					name='Breakfest'
					selectedDate={this.state.calendarDate}
					onClick={this.deleteClickedHandler}
					copyYesterday={this.copyFromYesterday}
					options={true}
				/>
			);
			lunchTable = (
				<FoodDiaryTable
					data={combinedLunchItems}
					name='Lunch'
					selectedDate={this.state.calendarDate}
					onClick={this.deleteClickedHandler}
					copyYesterday={this.copyFromYesterday}
					options={true}
				/>
			);
			dinnerTable = (
				<FoodDiaryTable
					data={combinedDinnerItems}
					name='Dinner'
					selectedDate={this.state.calendarDate}
					onClick={this.deleteClickedHandler}
					copyYesterday={this.copyFromYesterday}
					options={true}
				/>
			);
			snackTable = (
				<FoodDiaryTable
					data={combinedSnackItems}
					name='Snack'
					selectedDate={this.state.calendarDate}
					onClick={this.deleteClickedHandler}
					copyYesterday={this.copyFromYesterday}
					options={true}
				/>
			);

			for (let i = 0; i < combinedAllItems.length; i++) {
				let qty = combinedAllItems[i].serving;

				calorieSum += qty * combinedAllItems[i].food.calories;
				proteinSum += qty * combinedAllItems[i].food.protein;
				carbsSum += qty * combinedAllItems[i].food.carbs;
				fatSum += qty * combinedAllItems[i].food.fat;
				fiberSum += qty * combinedAllItems[i].food.fiber;
			}

			goalCalories = this.props.goal.dailyCalories;
			goalProtein = this.props.goal.dailyProtein;
			goalCarbs = this.props.goal.dailyCarbs;
			goalFat = this.props.goal.dailyFat;
			goalFiber = this.props.goal.dailyFiber;
		}

		if (!this.props.profileLoading && !this.props.goalsLoading) {
			//console.log('[FoodDiary.js] breakfestItems', breakfestItems);
			// console.log(
			// 	'[FoodDiary.js] this.props.goalsLoading',
			// 	this.props.goalsLoading
			// );
			allTableMeals = (
				<div className='container'>
					<div className='row'>{breakfestTable}</div>
					<div className='row'>{lunchTable}</div>
					<div className='row'>{dinnerTable}</div>
					<div className='row'>{snackTable}</div>
				</div>
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
				{allTableMeals}
				<div className='container'>
					<table className='table'>
						<tbody>
							<tr>
								<th>Totals</th>
								<td>{calorieSum}</td>
								<td>{proteinSum}</td>
								<td>{carbsSum}</td>
								<td>{fatSum}</td>
								<td>{fiberSum}</td>
							</tr>
							<tr>
								<th>Your Daily Goal</th>
								<td>{goalCalories}</td>
								<td>{goalProtein}</td>
								<td>{goalCarbs}</td>
								<td>{goalFat}</td>
								<td>{goalFiber}</td>
							</tr>
							<tr>
								<th>Remaining</th>
								<td>{goalCalories - calorieSum}</td>
								<td>{goalProtein - proteinSum}</td>
								<td>{goalCarbs - carbsSum}</td>
								<td>{goalFat - fatSum}</td>
								<td>{goalFiber - fiberSum}</td>
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
		goal: state.goal.goal,
		profileLoading: state.profile.loading,
		goalsLoading: state.goal.loading,
		error: state.profile.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onCreateFoodsHistoryBulk: (foodsHistoryData, token) =>
			dispatch(actions.addFoodsHistoryBulk(foodsHistoryData, token)),
		onGetCurrentProfile: token => dispatch(actions.fetchCurrentProfile(token)),
		onDeleteFoodHistory: (removeId, token) =>
			dispatch(actions.removeFoodHistory(removeId, token)),
		onGetGoals: token => dispatch(actions.fetchGoals(token))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FoodDiary);
