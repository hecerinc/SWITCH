// EvolutionPresentational.jsx
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Row, Col, Card, CardTitle, CardText } from 'reactstrap';

import Chart2 from './Chart2';
import Buttons from './Buttons';
import Table from './Table';

// Styles
import '/imports/ui/styles/App/HomeContainer.scss';

const data = gql`
	query uploadPP {
		files
	}
`;

const l = [
	'Hydroelectric',
	'Wind',
	'Combined Cycle',
	'Coal',
	'Bioenergy',
	'Photovoltaic',
	'Nuclear Power'
];

const C = ['#0088FE', '#bdc3c7', '#e74c3c', '#2c3e50', '#2ecc71', '#f1c40f', '#9b59b6'];

const Legend = () => {
	let labels = l;
	let colors = C;
	return(
		<div className="Legend">
			{labels.map((label, labelIndex) =>
				<div>
					<span
						className="Legend--color"
						style={{ backgroundColor: colors[labelIndex % colors.length] }}
					/>
					<span className="Legend--label">
						{label}
					</span>
				</div>
			)}
		</div>
	);
};

const Evolution = (props) => {
	return(
		<div
			style={{
				paddingBottom: `${10}px`,
				paddingTop: `${60}px`,
				width: `${100}%`,
				height: `${100}%`,
			}}
		>
			<Row style={{ height: `${90}%` }}>
				<Col xs="12" sm="12" lg="12" style={{ paddingLeft: `${0}px`, paddingRight: `${0}px` }}>
					<Card style={{ height: `${100}%`, width: `${100}%`, paddingRight: `${0}px` }}>
						<Row
							style={{
								height: `${30}%`,
								marginLeft: `${15}px`,
								marginTop: `${25}px`,
								width: `${100}%`,
							}}
						>
							<div className="text-charts">
								<div className="bold-text-charts">
									<CardTitle>Total Available Capacity By Type of Technology</CardTitle>
								</div>
								<div className="sm-text-charts">
									<CardText>
										In 2030, the total capacity will be 109,367 MW, which is a 61% increase from the
										end of 2015. Half of the installed capacity will be made up of conventional
										technologies and the other half will be comprised of clean technologies.{' '}
									</CardText>
								</div>
							</div>
						</Row>

						<Row
							style={{
								height: `${60}%`,
								width: `${100}%`,
								marginRight: `${0}px`,
								marginLeft: `${15}px`,
							}}
						>
							<Col xs="6" sm="6" lg="6" style={{ paddingLeft: `${120}px`, margingRight: `${35}px` }}>
								<Row style={{ height: `${80}%`, width: `${100}%` }}>
									<div className="chart-wrapper">
										<Chart2 />
									</div>
								</Row>
								<Row style={{ height: `${10}%`, marginTop: `${35}px`, width: `${100}%` }}>
									<div className="button-top">
										<Buttons />
									</div>
								</Row>
							</Col>
							<Col xs="6" sm="6" lg="6" style={{ paddingLeft: `${0}px`, paddingRight: `${115}px` }}>
								<div className="chart-table">
									<Table />
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
			<Row style={{ height: `${10}%`, marginTop: `${15}px` }}>
				<Card style={{ height: `${100}%`, width: `${100}%`, paddingRight: `${0}px` }}>
					<div className="chart-legend">
						<Legend />
					</div>
				</Card>
			</Row>
		</div>
	);
};

const EvolutionWithData = graphql(data)(Evolution);

export default EvolutionWithData;
