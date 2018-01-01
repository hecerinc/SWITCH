// transmission/mapHelpers.js

import d3 from 'd3';

// TODO: Import from 'leaflet'
import L from 'leaflet/dist/leaflet.js';

export function capitalize(str) {
	let splittedEnter = str.split(' ');
	let capitalized;
	for (var i = 0; i < splittedEnter.length; i++) {
		capitalized = splittedEnter[i].charAt(0).toUpperCase();
		splittedEnter[i] = capitalized + splittedEnter[i].substr(1).toLowerCase();
	}
	return splittedEnter.join(' ');
}
export function getYears(data) {
	// get all the years and legacy periods from dropped file (BuildTrans)
	var m = d3.map(data, d => d.TRANS_BUILD_YEARS_2);
	var years = m.keys();
	return years;
}

export function getWeight(mw) {
	// set the weight of the transmission line
	if(mw > 4000)
		return 8
	if(mw > 2000)
		return 7;
	if(mw > 1000)
		return 6;
	if(mw > 500)
		return 5;
	if(mw > 100)
		return 4;
	if(mw > 0)
		return 3;
	return 1;
}

// https://stackoverflow.com/questions/2686855/is-there-a-javascript-function-that-can-pad-a-string-to-get-to-a-determined-lengt
function pad(pad, str, padLeft) {
	if (typeof str === 'undefined')
		return pad;
	if (padLeft)
		return (pad + str).slice(-pad.length);
	return (str + pad).substring(0, pad.length);
}


// get all the years and legacy periods from dropped file
export function getPeriod(data) {

	var m = d3.map(data, d => d.TRANS_BUILD_YEARS_2);
	var years = m.keys();

	return years;
}

// Function to set the upper info, it will describe the current transmission line when hovered
export function createInfoBox() {
	const info = L.control();

	info.onAdd = function() {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info.update = function(props) {
		let info;
		if(props !== undefined) {
			info = `<strong>From ${props.from} to ${props.to}</strong><br />Capacity: ${props.capacity}  [MW]`;
		}
		else{
			info = '<h6>Hover over a transmission line</h6>';
		}
		this._div.innerHTML = info;
	};

	return info;
}

// legend that displays the information related to red and blue transmission lines
export function createLegend() {

	let legend = L.control({ position: 'bottomleft' });
	let color = ['#0067c8', '#ff4949'];
	let transmissionLines = ['Legacy transmission lines', "Switch's transmission lines"];

	legend.onAdd = function() {
		let div = L.DomUtil.create('div', 'info legend');
		// loop through our transmission_lines and generate a label with a colored square for each transmission_line
		transmissionLines.forEach((tL, i) => {
			div.innerHTML += `<i style="background:${color[i]}"></i> ${tL}<br>`;
		});

		return div;
	};

	return legend;
}

export function highlightFeature(infoBox, layer, props) {
	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 1,
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	infoBox.update(props);
}

export function resetHighlight(self, layer, weight, pane, color) {
	layer.setStyle({
		color: color,
		weight: weight,
		pane: pane,
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	self.update();
}

export function zoomToFeature(layer, map) {
	map.fitBounds(layer.getBounds());
}

// Read the csv and generate the legacy lines
export function drawExistingTLs(self, map, callback, args) {
	// draw the new transmission lines

	let blueLines = [];

	d3.csv('/data/transmission_lines.csv', (error, data) => {
		// get the current transmission lines from file
		// data = data.filter(row => row);

		data.map(row => {
			// BUG: this is an assumption on the format of the data
			let lz1 = row.lz1.substring(0, 2); // get the id of transmission line from row in file (first two digits)
			let lz2 = row.lz2.substring(0, 2);
			let lz1Name = capitalize(row.lz1.substring(3)); // get the id of transmission line's name from row in file
			let lz2Name = capitalize(row.lz2.substring(3));

			let weight = getWeight(row.existing_trans_cap_mw); // call funct to get weight

			let info = { from: lz1Name, to: lz2Name, capacity: row.existing_trans_cap_mw };

			// Add transparency to this line (some of them overlap)
			let polyline = L.polyline([self.props.country.loadZones[lz1], self.props.country.loadZones[lz2]], {
				color: '#0067c8',
				weight: weight,
				opacity: 0.6,
				pane: 'blue'
			});

			// Attach handlers
			polyline.on('click', e => {
				// TODO: make a closure of this function with `map`
				// then remove it from this method's parameters
				zoomToFeature(e.target, map);
			});

			polyline.on('mouseover', e => {
				highlightFeature(self.props.infoBox, e.target, info);
			});

			polyline.on('mouseout', e => {
				resetHighlight(self.props.infoBox, e.target, weight, 'blue', '#0067c8');
			});

			blueLines.push(polyline); // draw a line from point A to point B
		});

		blueLines = L.layerGroup(blueLines);
		self.props.setBlueLines(blueLines);
		if(callback !== undefined) {
			callback.apply(self, args);
		}
	});
	return blueLines;
}

export function drawLoadZones(self, country, map) {
	let coordinatesList = {};

	for (let key in country.balancingAreas) {
		// function to iterate over the geojson files and attach them a click function per feature (polygon, point .. shape)
		L.geoJson(country.balancingAreas[key].properties.shape.Prodesen, {
			// Get the centroid of each load zone and draw a circle there
			onEachFeature: function(feature, layer) {
				let id = pad("00", feature.properties.ID, true);
				let coordinates = layer.getBounds().getCenter();
				coordinatesList[id] = coordinates;

				L.circle([coordinates.lat, coordinates.lng], {
					color: '#0067c8', // set the points color opacity and radius
					fillColor: '#0067c8',
					fillOpacity: 0.3,
					opacity: 0.3,
					radius: 25000,
					pane: 'blue'
				}).addTo(map);
			},
		});
	}

	country.loadZones = coordinatesList;
	self.props.setCountry(country);
}

// Draw the new transmission lines (red)
// TODO: refactor
// BUG: the new TLs don't have capacity in them in the default dataset (undefined)
export function drawNewTLs(infoBox, country, map, data, period, blueLines) {
	let overlayMaps = {};

	period.forEach(year => {
		let lines = [];

		data.map(row => {
			if (row.TRANS_BUILD_YEARS_2 == year) {

				// BUG: why are both these fields called TRANS_BUILD_YEARS?
				let lzs = row.TRANS_BUILD_YEARS_1.split('-'); // get the names of the transmission lines
				// These are the ids of the load zones (from [0] and to [2]):
				let lz1 = lzs[0]; // set transmission line one and two
				let lz2 = lzs[2];

				let lz1Name = capitalize(lzs[1]);
				let lz2Name = capitalize(lzs[3]);

				let weight = getWeight(row.BuildTrans); // get the underlying weight

				let info = { from: lz1Name, to: lz2Name, capacity: row.existing_trans_cap_mw }; // BUG: this property does not exist (existing_trans_cap_mw). Maybe its BuildTrans?

				// draw the poyline
				// [from, to]
				let polyline = L.polyline([country.loadZones[lz1], country.loadZones[lz2]], {
					color: '#ff4949',
					weight: weight,
					pane: 'red'
				});

				// Attach handlers
				polyline.on('click', e => {
					// TODO: closure
					zoomToFeature(e.target, map);
				});
				polyline.on('mouseover', e => {
					highlightFeature(infoBox, e.target, info);
				});
				polyline.on('mouseout', e => {
					resetHighlight(infoBox, e.target, weight, 'red', '#ff4949');
				});

				lines.push(polyline);
			}
		});

		lines = L.layerGroup(lines);

		overlayMaps[year] = lines;
	});

	overlayMaps['Current T. L.'] = blueLines;

	// Add the layers control on the top right
	L.control.layers({}, overlayMaps).addTo(map);
}
