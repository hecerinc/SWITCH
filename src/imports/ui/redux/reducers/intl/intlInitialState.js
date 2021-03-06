import Immutable from 'immutable';
import messages from '../../../locales/es';
/**
 * ## Locale
 * This Record contains the state of the Locale
 */
const initialState = Immutable.fromJS({
  locale: 'es',
  messages,
});

/**
 * ## initialState
 * The form is set
 */
export default initialState;
