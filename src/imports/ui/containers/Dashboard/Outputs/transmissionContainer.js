// <Output /> Container

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose, withState, lifecycle } from 'recompose';

// Leaflet
// BUG: Check Leaflet images bug
// TODO: Import from 'leaflet'
import L from 'leaflet/dist/leaflet.js';
import 'leaflet/dist/leaflet.css';

import Transmission from '/imports/ui/components/Dashboard/Outputs/Transmission';

// Data
// TODO: maybe shift country import to mapHelpers?
import country from '/imports/ui/data';
import coordinates from '/imports/ui/data/load_zones/coordinates';

import { drawLoadZones, createLegend, createInfoBox, drawExistingTLs, getYears, drawNewTLs } from './mapHelpers';

import '/imports/ui/styles/App/HomeContainer.scss';

const OutputContainer = compose(
	graphql(gql`
		query fileQuery {
			getTransmissionLines
		}
	`),
	withState('map', 'setMap', 0),
	withState('datas', 'setDatas', 0),
	withState('period', 'setPeriod', 0),
	withState('country', 'setCountry', 0),
	withState('infoBox', 'setInfoBox', 0),
	withState('blueLines', 'setBlueLines', 0),
	lifecycle({
		componentWillMount() {
			// TODO: why refetch?
			this.props.data.refetch();
		},
		componentDidMount() {
			const self = this; // save the reference to the component context
			// TODO: why refetch?
			this.props.data.refetch().then(res => {
				let data = res.data.getTransmissionLines[0]; // fixed
				data = data.rows;
				let period = getYears(data);
				// self.props.setPeriod(period);
				// self.props.setDatas(data);

				// The map layer
				const baseLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
					attribution: '&copy;OpenStreetMap, &copy;CartoDB',
				});


				// Instantiate a new map
				const map = L.map(self.refs.transmission_map, {
					center: [23.8, -102.1],
					layers: [baseLayer],
					minZoom: 4,
					zoom: 5,
					zoomControl: true
				});

				// Move zoom control buttons to bottom right (default is top left)
				map.zoomControl.setPosition('bottomright');

				map.createPane('blue').style.zIndex = 500;
				map.createPane('red').style.zIndex = 850;
				map.createPane('labels').style.zIndex = 210;
				map.createPane('description').style.zIndex = 750;

				// The labels for the map
				L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
					attribution: '&copy;OpenStreetMap, &copy;CartoDB',
					pane: 'labels',
				}).addTo(map);


				drawLoadZones(self, country, map); // draw the centroid of each load zone


				let legend = createLegend();
				let infoBox = createInfoBox();

				self.props.setInfoBox(infoBox);

				drawExistingTLs(self, map, (map, country, data, period) => {
					// draw the red lines
					drawNewTLs(this.props.infoBox, country, map, data, period, this.props.blueLines);
				}, [map, country, data, period]); // draws the blue lines

				legend.addTo(map);
				infoBox.addTo(map);


				self.props.setMap(map);

			});
		}
	})
)(Transmission);

export default OutputContainer;
