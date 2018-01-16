// Capacity Map Container

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose, withState, lifecycle } from 'recompose';

// Leaflet
// BUG: The stupid icons won't load
// https://github.com/PaulLeCam/react-leaflet/issues/255

import L from 'leaflet/dist/leaflet.js';
import 'leaflet/dist/leaflet.css';

import Map from '/imports/ui/components/Dashboard/Inputs/Capacity/Map';

import country from '/imports/ui/data';

import { addDataToMap, handleClick } from './mapHelpers';

import '/imports/ui/styles/App/HomeContainer.scss';

let randomProperty = function(obj, keys = Object.keys(obj)) {
	return obj[keys[(keys.length * Math.random()) << 0]];
};

const Container = compose(
	graphql(gql`
		query fileQuery {
			getPowerPlants
		}
	`),
	withState('layers', 'setLayers', 0), // TODO: what is this for?
	withState('legend', 'setLegend', 0), // TODO: what is this for?
	withState('map', 'setMap', 0),
	lifecycle({
		/* BUG: this is not needed?
		componentWillReceiveProps(prevProps) {
			if (
				prevProps.data.getPowerPlants &&
				this.props.data.getPowerPlants &&
				prevProps.data.getPowerPlants[0] &&
				prevProps.data.getPowerPlants[0] != this.props.data.getPowerPlants[0]
			) {
				this.props.data.refetch().then(res => {
					if (res.data.getPowerPlants[0]) {
						let data = res.data.getPowerPlants[0].country;
						this.props.map.remove();
						addDataToMap(data, this);

						// Code to generate chart views on startup (needs to be simplified)
						let balancingAreas = data.balancingAreas;
						let loadZones = data.loadZones;

						let randomBalancingArea = randomProperty(balancingAreas);
						let index = randomBalancingArea.properties.index;
						let country = getCountry();
						let lz = country.balancingAreas[index].properties.shape.Prodesen.features;
						let randomLoadZone = 0;

						// BUG: This is necessary because there are load zones for which there is noi data.
						// Can we assume that they will always load both?
						// Does it make sense to load shapes for load zones but not their data?
						lz.forEach(element => {
							if (element.properties.ID in loadZones) {
								randomLoadZone = loadZones[element.properties.ID];
							}
						}, this);

						// BUG: remove one of these
						handleClick(randomLoadZone, this);
						handleClick(randomBalancingArea, this);
						// End of code to generate chart views on startup
					}
				});
			}
		},
		*/
		componentDidMount() {

			// This is used to render an initial map when the call to the DB has not been completed
			// (The actual data layers are loaded in the addDataToMap call down below)
			// TODO: unfortunately, this map gets destroyed and replaced, as opposed to the data being added on top

			const baseLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
				attribution: '&copy;OpenStreetMap, &copy;CartoDB',
			});


			// Instantiate a new map
			const map = L.map(this.refs.national_map, {
				center: [23.8, -102.1],
				layers: [baseLayer],
				minZoom: 4,
				zoom: 5,
				zoomControl: false
			});

			// Set the map as part of the state
			this.props.setMap(map);
			// BUG:
			// TODO: why refetch?
			// This might not be too relevant because presumably Apollo keeps this in the cache
			this.props.data.refetch().then(res => {
				if (res.data.getPowerPlants[0]) {
					let data = res.data.getPowerPlants[0].country;

					this.props.map.remove(); // dafuq
					addDataToMap(data, this);

					// Code to generate chart view on startup (needs to be simplified)
					let balancingAreas = data.balancingAreas;
					let loadZones = data.loadZones;

					let randomBalancingArea = randomProperty(balancingAreas);
					let index = randomBalancingArea.properties.index;
					let lz = country.balancingAreas[index].properties.shape.Prodesen.features;
					let randomLoadZone = 0;


					lz.forEach(element => {
						if (element.properties.ID in loadZones) {
							randomLoadZone = loadZones[element.properties.ID];
						}
					}, this);

					// BUG: Remove one of these
					handleClick(randomLoadZone, this);
					handleClick(randomBalancingArea, this);
					// End of code to generate chart views on startup
				}
			});
		},
	})
)(Map);

export default Container;
