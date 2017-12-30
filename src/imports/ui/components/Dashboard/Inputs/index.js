// <Inputs /> Presentational
import { Switch, Route } from 'react-router-dom';
import { Col } from 'reactstrap';
import Header from './Header';
import Capacity from '/imports/ui/containers/Dashboard/Inputs/Capacity/capacityContainer';
import ProjectInfo from '/imports/ui/containers/Dashboard/Inputs/ProjectInfo/projectInfoContainer';

import '/imports/ui/styles/App/HomeContainer.scss';

// TODO: extract styles from inline
const Inputs = () => {
	return(
		<div
			style={{
				width: '100%',
				height: '100%',
				marginLeft: '15px',
				marginRight: '15px',
				paddingBottom: '25px'
			}}
		>
			<Header />
			<div id="body" style={{width: '100%', height: '100%'}}>
				<Col xs="12" sm="12" lg="12" style={{ height: '100%' }}>
					<Switch>
						<Route exact path="/inputs" component={Capacity} />
						<Route path="/inputs/capacity" component={Capacity} />
						<Route path="/inputs/projectInfo" component={ProjectInfo} />
					</Switch>
				</Col>
			</div>
		</div>
	);
}

export default Inputs;
