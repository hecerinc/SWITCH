import keyMirror from 'key-mirror';

export default keyMirror({
  SET_INTL_DATA: null,
  LOCALE_CONFIG_REQUEST: null,
  LOCALE_CONFIG_SUCCESS: null,
  LOCALE_CONFIG_FAILURE: null,
  LOCALE_SET_LANGUAGE_REQUEST: null,
  LOCALE_SET_LANGUAGE_SUCCESS: null,
  LOCALE_SET_LANGUAGE_FAILURE: null,
  SESSION_TOKEN_REQUEST: null,
  SESSION_TOKEN_SUCCESS: null,
  SESSION_TOKEN_FAILURE: null,
  DELETE_TOKEN_REQUEST: null,
  DELETE_TOKEN_SUCCESS: null,
  DELETE_TOKEN_FAILURE: null,
  ON_AUTH_FORM_FIELD_CHANGE: null,
  SIGNIN: null, // BUG: These are NOT actions! these are states of the login form
  SIGNIN_REQUEST: null,
  SIGNIN_SUCCESS: null,
  SIGNIN_FAILURE: null,
  SIGNUP: null, // BUG: These are NOT actions! these are states of the login form
  SIGNUP_REQUEST: null,
  SIGNUP_SUCCESS: null,
  SIGNUP_FAILURE: null,
  LOGOUT: null, // BUG: These are NOT actions! these are states of the login form
  LOGOUT_REQUEST: null,
  LOGOUT_SUCCESS: null,
  LOGOUT_FAILURE: null,
  RESET_PASSWORD: null,
  RESET_PASSWORD_REQUEST: null,
  RESET_PASSWORD_SUCCESS: null,
  RESET_PASSWORD_FAILURE: null,
  FORGOT_PASSWORD: null,
});
