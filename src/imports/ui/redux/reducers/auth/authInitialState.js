// Auth initial state.js

import { Record } from 'immutable';
import actionConstants from '../actionsConstants';
const { SIGNIN } = actionConstants;
/**
 * Form
 * This Record contains the state of the form and the
 * fields it contains.
 */

// A Record is an immutable structure whose _keys_ cannot be changed (cannot add more properties) and have default values
const formFields = Record({
	// Fields
	username: '',
	email: '',
	password: '',
	passwordAgain: '',
	// showPassword
	showPassword: false,
	// <field>HasError?
	usernameHasError: false,
	emailHasError: false,
	passwordHasError: false,
	passwordAgainHasError: false
});

const Form = Record({
	state: SIGNIN, // BUG: default state is 'SIGN_IN'
	disabled: false,
	error: null,
	isValid: false,
	isFetching: false,
	fields: (new formFields())
});

/**
 * ## InitialState
 * The form is set
 */
// BUG: for some reason instantiating it here and then exporting it doesn't work
const initialState = Record({
	form: (new Form())
});

export default initialState;
