import immutable from 'immutable';
import { UPDATE } from 'react-intl-redux';
import initialState from './intlInitialState';
import actionConstants from '../actionsConstants';

/** 
 * Global actions 
 */

const {
	SET_INTL_DATA,
	LOCALE_CONFIG_REQUEST,
	LOCALE_CONFIG_SUCCESS,
	LOCALE_CONFIG_FAILURE,
} = actionConstants;

// Localization (l10n) Reducer

const l10nReducer = (state = initialState, action)  => {
	switch (action.type) {
		case UPDATE:
			return state.merge(action.payload); // state is a Map from immutable.js
		case SET_INTL_DATA:
			return state.merge(immutable.fromJS(action.payload.data));
		case LOCALE_CONFIG_REQUEST:
			return state; // TODO: not implemented?
		case LOCALE_CONFIG_SUCCESS:
			return state; // TODO: not implemented?
		case LOCALE_CONFIG_FAILURE:
			return state; // TODO: not implemented?
		default:
			return state;
	}
};

export default l10nReducer;
