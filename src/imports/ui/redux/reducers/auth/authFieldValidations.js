// authFieldValidations.js

import validate from 'validate.js';

// BUG: Add presence: true on all fields that are required.

/**
 * ## Email validation setup
 * Used for validation of emails
 */
const emailConstraints = {
	username: {email: true}
};

/**
* ## username validation rule
* read the message.. ;)
*/
const usernamePattern = /^[a-zA-Z0-9]{6,12}$/i;
const usernameConstraints = {
	'username': {
		format: {
			pattern: usernamePattern
		}
	}
};

/**
* ## password validation rule
* read the message... ;)
*/
const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/i;
const passwordConstraints = {
	'password': {
		format: {
			pattern: passwordPattern
		}
	}
};
const passwordAgainConstraints = {
	confirmPassword: {equality: 'password'}
};

/**
 * ## Field Validation
 * @param {Object} state Redux state
 * @param {Object} action type & payload
 */
const fieldValidation = (state, action) => {
	const { field, value } = action.payload;
	let newState;

	// TODO: no isValid field updating?

	switch (field) {
		/**
		 * username validation
		 * set the form field error
		 */
		case 'username':
			// If this is undefined, that means no errors were thrown, it's valid.
			const isValidUsername = validate({ username: value }, usernameConstraints) === undefined; 
			newState = state.setIn(['form', 'fields', 'usernameHasError'], !isValidUsername);
		break;
		/**
		 * email validation
		 * set the form field error
		 */
		case 'email':
			const isValidEmail = validate({ from: value }, emailConstraints) === undefined;
			newState = state.setIn(['form', 'fields', 'emailHasError'], !isValidEmail);
		break;
		/**
		 * password validation
		 * set the form field error
		 */
		case 'password':
			const isValidPassword = validate({ password: value }, passwordConstraints) === undefined;
			newState = state.setIn(['form', 'fields', 'passwordHasError'], !isValidPassword);
		break;
		/**
		 * passwordAgain validation
		 * set the form field error
		 */
		case 'passwordAgain':
			let isValidPasswordAgain = validate({password: state.form.fields.password, confirmPassword: value }, passwordAgainConstraints) === undefined;
			newState = state.setIn(['form', 'fields', 'passwordAgainHasError'], !isValidPasswordAgain);
		break;

		/**
		 * showPassword
		 * toggle the display of the password
		 */
		case 'showPassword':
			newState = state.setIn(['form', 'fields', 'showPassword'], value);
		break;

		default:
			newState = state;
		break;
	}

	return newState;
}

export default fieldValidation;
