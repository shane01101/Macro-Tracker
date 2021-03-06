const Goal = require('../models/Goal');
const validatorGoalInput = require('../validation/goal');

// @route GET api/goals
// @desc Retrieve the users goals
// @access Private
exports.getGoals = (req, res) => {
	const errors = {};

	Goal.findOne({ user: req.user.id })
		.then(goal => {
			if (!goal) {
				errors.noGoals = 'Goals not found for this user';
				return res.status(404).json(errors);
			}
			res.json(goal);
		})
		.catch(err => res.status(404).json(err));
};

// @route POST api/goals
// @desc Create or edit users goals
// @access Private
exports.updateGoals = (req, res) => {
	const { errors, isValid } = validatorGoalInput(req.body);

	//Check Validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors);
	}

	//assign fields to newGoal if they exist in req.body, user always exists
	const goalFields = {};
	goalFields.user = req.user.id;

	if (req.body.dailyCalories) goalFields.dailyCalories = req.body.dailyCalories;
	if (req.body.dailyProtein) goalFields.dailyProtein = req.body.dailyProtein;
	if (req.body.dailyFat) goalFields.dailyFat = req.body.dailyFat;
	if (req.body.dailyCarbs) goalFields.dailyCarbs = req.body.dailyCarbs;
	if (req.body.dailyFiber) goalFields.dailyFiber = req.body.dailyFiber;
	if (req.body.dailySugar) goalFields.dailySugar = req.body.dailySugar;
	if (req.body.fitnessWeeklyWorkouts)
		goalFields.fitnessWeeklyWorkouts = req.body.fitnessWeeklyWorkouts;
	if (req.body.fitnessCaloriesBurnedPerWeek)
		goalFields.fitnessCaloriesBurnedPerWeek =
			req.body.fitnessCaloriesBurnedPerWeek;
	if (req.body.fitnessCardioDaysPerWeek)
		goalFields.fitnessCardioDaysPerWeek = req.body.fitnessCardioDaysPerWeek;
	if (req.body.fitnessWeightTrainingDaysPerWeek)
		goalFields.fitnessWeightTrainingDaysPerWeek =
			req.body.fitnessWeightTrainingDaysPerWeek;
	if (req.body.fitnessMinutessPerWorkout)
		goalFields.fitnessMinutessPerWorkout = req.body.fitnessMinutessPerWorkout;

	Goal.findOne({ user: req.user.id })
		.then(goal => {
			// Update
			if (goal) {
				Goal.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: goalFields },
					{ new: true }
				)
					.then(goal => res.json(goal)) //Update Success
					.catch(err => res.status(404).json(err));
			} else {
			}
		})
		.catch(err => res.status(404).json(err));
};
