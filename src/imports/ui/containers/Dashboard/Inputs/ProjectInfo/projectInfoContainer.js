// <ProjectInfo /> Container

import { compose, withState, lifecycle } from 'recompose';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import ProjectInfo from '/imports/ui/components/Dashboard/Inputs/ProjectInfo';

import '/imports/ui/styles/App/HomeContainer.scss';

const ProjectInfoContainer = compose(
	graphql(gql`
		query uploadPI {
			getProjectInfo
		}
	`),
	// BUG: Change this to a single "currentLoadZone" object
	withState('loadZoneID', 'setLoadZoneID', '26'),
	withState('loadZoneName', 'setLoadZoneName', 'No data'),
	withState('totalCapacity', 'setTotalCapacity', 0),
)(ProjectInfo);

export default ProjectInfoContainer;
