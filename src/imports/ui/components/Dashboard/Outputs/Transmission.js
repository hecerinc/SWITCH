// <Transmission /> Presentational

import { Row, Col, Card, CardHeader, CardBlock } from 'reactstrap';

import '/imports/ui/styles/App/HomeContainer.scss';

const Transmission = (props) => {
	return (
		<Row>
			<Col xs="8" sm="8" lg="8">
				<Card style={{ marginTop: '60px', marginLeft: '15px', width: '750px' }}>
					<CardHeader>Mexico's transmission lines </CardHeader>
					<CardBlock className="card-body">
						<div
							ref="transmission_map"
							className="chart-wrapper"
							style={{ height: '620px', width: '100%' }}
						/>
					</CardBlock>
				</Card>
			</Col>
			<Col xs="4" sm="4" lg="4">
				<Row>
					<Card
						style={{
							marginTop: '60px',
							height: '252px',
							width: '400px',
						}}
					>
						<CardHeader />
					</Card>
				</Row>
				<Row>
					<Card
						style={{
							marginTop: '10px',
							width: '400px',
							height: '220px',
						}}
					/>
				</Row>
				<Row>
					<Card
						style={{
							marginTop: '10px',
							height: '220px',
							width: '400px',
						}}
					>
						<CardHeader />
					</Card>
				</Row>
			</Col>
		</Row>
	);
};

export default Transmission;
