// Inputs/<Capacity /> Presentational

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Row, Col, Card, CardHeader, CardBlock } from 'reactstrap';

import BarChart from './BarChart';
import Map from '/imports/ui/containers/Dashboard/Inputs/Capacity/Map';
import StackedChart from 'imports/ui/containers/Dashboard/Inputs/Capacity/Chart';

import '/imports/ui/styles/App/HomeContainer.scss';

const data = gql`
	query uploadPP {
		getPowerPlants
	}
`;
// TODO: Remove inline styles
const Capacity = (props) => {
	return(
		<div
			style={{
				paddingBottom: '10px',
				paddingTop: '60px',
				width: '100%',
				height: '100%',
			}}
		>
			<Row style={{ height: '100%' }}>
				<Col xs="8" sm="8" lg="8" style={{ paddingLeft: '0px' }}>
					<Card style={{ height: '100%', width: '100%' }}>
						<CardHeader> Mexico </CardHeader>
						<CardBlock className="card-body">
							<Map
								{/* BUG: you don't need to pass these down to the component if you use Redux, as the Map container can subscribe to the updates. */}
								setLoadZone={props.setLoadZone}
								setBalancingArea={props.setBalancingArea}
								setColor={props.setColor}
								{/*setCountryData={props.setCountryData}*/}
							/>
						</CardBlock>
					</Card>
				</Col>
				<Col xs="4" sm="4" lg="4">
					<Row style={{ height: '32.3%' }}>
						<Card
							style={{
								width: '100%',
								height: '100%',
							}}
						>
							<CardHeader>Total Installed Capacity [MW]</CardHeader>
							<StackedChart />
						</Card>
					</Row>
					<Row style={{ marginTop: '10px', height: '32.3%' }}>
						<Card
							style={{
								height: '100%',
								width: '100%',
							}}
						>
							<CardHeader> Installed Capacity for each Balancing Area [MW]</CardHeader>
							<BarChart data={props.balancingArea} color={props.balancingArea.color} />
						</Card>
					</Row>
					<Row style={{ marginTop: '10px', height: '32.3%' }}>
						<Card
							style={{
								height: '100%',
								width: '100%',
							}}
						>
							<CardHeader>Installed Capacity for each Load Zone [MW]</CardHeader>
							<BarChart data={props.loadZone} color={props.balancingArea.color} />
						</Card>
					</Row>
				</Col>
			</Row>
		</div>
	);
};

const CapacityWithData = graphql(data)(Capacity);

export default CapacityWithData;
