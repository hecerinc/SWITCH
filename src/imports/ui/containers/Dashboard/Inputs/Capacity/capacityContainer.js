// <Capacity> Container

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose, withState, lifecycle } from 'recompose';

// Components
import Capacity from '../../../../components/Dashboard/Inputs/Capacity';

// Styles
import '/imports/ui/styles/App/HomeContainer.scss';

const CapacityContainer = compose(
	graphql(gql`
		query uploadPP {
			getPowerPlants
		}
	`),
	withState('loadZone', 'setLoadZone', []),
	withState('color', 'setColor', '#343434'),
	withState('balancingArea', 'setBalancingArea', []),
	// withState('countryData', 'setCountryData', {}) // TODO: This is not used
)(Capacity);

export default CapacityContainer;
