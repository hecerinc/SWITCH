import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose, withState, lifecycle } from 'recompose';

import Map from '/imports/ui/components/Dashboard/Inputs/ProjectInfo/Map';

// TODO: Check leaflet icons
import L from 'leaflet/dist/leaflet.js';
import 'leaflet/dist/leaflet.css';

import '/imports/ui/styles/App/HomeContainer.scss';

// import getCountry from '/imports/ui/data';

// Data
import loadZones from '/imports/ui/data/load_zones/coordinates';


const Container = compose(
	graphql(gql`
		query fileQuery {
			getProjectInfo
		}
	`),
	lifecycle({
		componentWillReceiveProps(prevProps) {

			console.log(this.props,"willreceive")

		},
		componentDidMount() {

			const baseLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
				attribution: '&copy;OpenStreetMap, &copy;CartoDB',
			});

			const map = L.map(this.refs.project_info_map, {
				center: [23.8, -102.1],
				layers: [baseLayer],
				minZoom: 4,
				zoom: 5,
				zoomControl: true
			});

			map.zoomControl.setPosition('bottomright');

			map.createPane('shapes').style.zIndex = 900;
			map.createPane('labels').style.zIndex = 901; // Always show the labels on top of everything else

			L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
				attribution: '&copy;OpenStreetMap, &copy;CartoDB',
				pane: 'labels',
			}).addTo(map);

			// Draw the individual load zones in each coordinate on the map
			Object.keys(loadZones).forEach(key => {

				// TODO: Maybe make these scale dynamically with zoom
				L.circle([loadZones[key][0], loadZones[key][1]], { // lat, long
					color: '#66CD00', //set the points color opacity and radius
					fillColor: '#66CD00',
					fillOpacity: 1,
					opacity: 1,
					radius: 25000
				}).on('click', () => {this.props.setLoadZoneID(key)}).addTo(map);

			});
		},
	})
)(Map);

export default Container;
