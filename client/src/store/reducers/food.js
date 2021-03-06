import * as actionTypes from '../actions/actionTypes';

const initialState = {
	foods: null,
	error: null,
	loading: false,
	filtered: null
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.ADD_FOOD_START:
			return {
				...state,
				error: null,
				loading: true
			};
		case actionTypes.ADD_FOOD_SUCCESS:
			const newFood = {
				...action.foodData,
				id: action.foodId
			};
			return {
				...state,
				loading: false,
				error: null
				//foods: state.foods.concat(newFood)
			};
		case actionTypes.ADD_FOOD_FAIL:
			return {
				...state,
				error: action.error,
				loading: false
			};
		case actionTypes.FETCH_FOODS_START:
			return {
				...state,
				loading: true
			};
		case actionTypes.FETCH_FOODS_SUCCESS:
			return {
				...state,
				foods: action.foods,
				loading: false
			};
		case actionTypes.FETCH_FOODS_FAIL:
			return {
				...state,
				loading: false
			};
		case actionTypes.FILTER_ALL_FOODS:
			return {
				...state,
				filtered: state.foods.filter(f => {
					// reg exp match text case insensitive
					const regex = new RegExp(`${action.payload}`, 'gi');
					return f.name.match(regex);
				})
			};
		case actionTypes.CLEAR_FILTER:
			return {
				...state,
				filtered: null
			};
		default:
			return state;
	}
};

export default reducer;
