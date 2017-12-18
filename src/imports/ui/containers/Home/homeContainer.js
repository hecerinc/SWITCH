import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Home from '../../components/Home';
import * as authActions from '../../redux/reducers/auth/authActions';

const actions = [authActions];

// TODO: maybe refactor this out if many containers use the same thing
function mapStateToProps(state) {
  return {
    auth: state.toJS().auth,
    intlState: state.toJS().intl,
  };
}
// TODO: this one too, consider refactor
function mapDispatchToProps(dispatch) {
  const creators = Map().merge(...actions).filter(value => typeof value === 'function').toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch,
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(Home);
