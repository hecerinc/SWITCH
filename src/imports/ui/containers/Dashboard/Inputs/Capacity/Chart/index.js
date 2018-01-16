import React from 'react';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import Chart from '/imports/ui/components/Dashboard/Inputs/Capacity/StackedChart';

const data = gql`
	query uploadPP {
		getPowerPlants
	}
`;

// TODO: Is this _really_ a container?
// TODO: consider renaming from Chart/index.js => ../StackedChart.js
class StackedChart extends React.Component {

	static propTypes = {
		data: React.PropTypes.shape({
			Trainer: React.PropTypes.object,
		}).isRequired,
	};

	render() {
		if (this.props.data.getPowerPlants && this.props.data.getPowerPlants[0]) {
			return <Chart data={this.props.data.getPowerPlants[0].chartData} />;
		}

		return <div>Loading</div>;
	}

}

const ChartWithData = graphql(data)(StackedChart);

export default ChartWithData;
