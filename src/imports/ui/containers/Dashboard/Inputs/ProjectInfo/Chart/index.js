// <BarChart /> for ProjectInfo

import React from 'react';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import Chart from '/imports/ui/components/Dashboard/Inputs/ProjectInfo/ComposedChart';

const data = gql`
	query uploadPP {
		getProjectInfo
	}
`;

class ComposedChart extends React.Component {
	static propTypes = {
		data: React.PropTypes.shape({
			Trainer: React.PropTypes.object,
		}).isRequired
	};

	// TODO: Check this vs render
	componentWillReceiveProps(nextProps) {

		if (this.props.data.getProjectInfo && this.props.data.getProjectInfo[0]) {
			let data = nextProps.data.getProjectInfo[0].data;
			data = data.find(obj => obj.key == nextProps.loadZoneID);
			this.props.setLoadZoneName(data[0].value[0].load_zone);
			this.props.setTotalCapacity(data[0].total_capacity_limit)
		}
	}

	// BUG: Replace Chart for a better viz
	render() {
		if (this.props.data.getProjectInfo && this.props.data.getProjectInfo[0]) {
			let data = this.props.data.getProjectInfo[0].data;
			data = data.find(obj => obj.key == this.props.loadZoneID);
			return <Chart data={data}  />;
		}
		return (<div>Loading</div>);
	}
}

const ChartWithData = graphql(data)(ComposedChart);

export default ChartWithData;
