import Immutable from 'immutable';
// Action type. Fires after _any_ changes in history
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = Immutable.fromJS({
	locationBeforeTransitions: null,
});

const routerReducer = (state = initialState, action) => {
	if (action.type === LOCATION_CHANGE) {
		return state.set('locationBeforeTransitions', action.payload);
	}
	return state;
};

export default routerReducer;
