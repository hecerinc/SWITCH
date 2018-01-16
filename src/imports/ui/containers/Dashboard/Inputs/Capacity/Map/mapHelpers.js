import L from 'leaflet';

// Function to set the bottom left legend listing the balancing areas names

// TODO: Change this to be a bound function instead of getting this as a second parameter
export function addDataToMap(data, a) {

	// The map layer
	const baseLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
		attribution: '&copy;OpenStreetMap, &copy;CartoDB',
	});


	// Instantiate a new map
	const map = L.map(a.refs.national_map, {
		center: [23.8, -102.1],
		layers: [baseLayer],
		minZoom: 4,
		zoom: 5,
		zoomControl: true
	});

	// Move zoom control buttons to bottom right (default is top left)
	map.zoomControl.setPosition('bottomright');

	map.createPane('shapes').style.zIndex = 900;
	map.createPane('labels').style.zIndex = 901; // Always show the labels on top of everything else

	// The labels for the map
	L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
		attribution: '&copy;OpenStreetMap, &copy;CartoDB',
		pane: 'labels',
	}).addTo(map);



	// Add the box with load zone/balance area info on the top right
	let infoBox = createInfoBox();

	let shapeLayers = setGeoJSON(data, map, a, infoBox);

	infoBox.addTo(map);

	let mapLegend = createLegend(data);
	mapLegend.addTo(map);


	map.addLayer(shapeLayers.Switch);

	// Add a controller for the layers (these are base layers, only one of them can be selected at a time)
	let controller = L.control.layers(shapeLayers).addTo(map);

	// Update <Map /> state
	a.props.setLegend(mapLegend);
	a.props.setLayers(controller);
	a.props.setMap(map);
}

// Adds the legend on the bottom left of the map that contains the color key for each balance area
function createLegend(country) {

	// Instantiate new Control
	let legend = L.control({ position: 'bottomleft' });

	legend.onAdd = function() {
		let div = L.DomUtil.create('div', 'info legend');

		// loop through our balancing_areas and generate a label with a colored square for each balancing_area

		for (var key in country.balancingAreas) {
			if(country.balancingAreas.hasOwnProperty(key)) {
				const ba = country.balancingAreas[key].properties;
				div.innerHTML += `<i style="background:${ba.color}"></i> ${ba.name}<br>`;
			}
		}
		return div;
	};

	return legend;
}

// BUG: There is no indication of the current selected load Zone. Also, why do we want to zoom *every time*?
// Function to highlight the shapes of a echa polygon (loadZone) whe hover
export function highlightFeature(layer, lZ, map, country, key, a, mapInfo) {
	let id = lZ.ID;
	let name = country.loadZones[id] ? country.loadZones[id].properties.name : 'No Data';
	let total = country.loadZones[id] ? country.loadZones[id].properties.capacity.total : 'No Data';

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7,
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	let props = {
		l_z: { name: name, total: total },
		b_a: {
			name: country.balancingAreas[key].properties.name,
			total: country.balancingAreas[key].properties.capacity.total,
		},
	};

	mapInfo.update(props);
}

// Function to reset the highlight when hover a plygon
export function resetHighlight(layer, mapInfo) {
	layer.setStyle({
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	mapInfo.update();
}

// Function to zoom to polygon when polygon clicked
export function zoomToFeature(layer, map) {
	map.fitBounds(layer.getBounds());
}
// Function to handle a click over a polygon, it will update the labels
export function handleClick(data, a) {
	//console.log(data);
	let arrayData = [];
	let name = data.properties.name;
	// let type = data ? data.type : 'none'; // FIXME temporal approach to skip loadZones w/o data
	let d = data.properties.capacity.break_down;
	let color = data.properties ? data.properties.color : '#ffffff';

	d.forEach(a => {
		arrayData.push({ name: a.key, [name]: a.value });
		// return a;
	});
	// BUG: why why do you have two methods for setting balancingArea and load zone? It's not possible to select a load zone without selecting a balancing area, so why not set both at the same time?
	if (data.type == 'balancingArea') {
		a.props.setBalancingArea({ name: name, values: arrayData, color: color });
	}
	else if (data.type == 'loadZone') {
		a.props.setLoadZone({ name: name, values: arrayData });
	}
}


// Function to set the upper info, it will describe the current shape when hover
function createInfoBox() {

	let info = L.control();

	info.onAdd = function() {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control operating over the feature properties received
	info.update = function(props) {
		let info;
		if(props !== undefined) {
			// TODO: Use classes for styling this
			info  = `<div><span style="float: left;">Balancing Area:</span> <strong style="float: right;">${props.b_a.name}</strong></div>`;
			info += `<div><span style="float: left;">Installed Capacity:</span> <strong style="float: right;">&nbsp;&nbsp;${props.b_a.total} [MW]</strong></div>`;
			info += `<div><span style="float: left;">Load Zone:</span> <strong style="float: right;">${props.l_z.name}</strong></div>`;
			info += `<div><span style="float: left;">Installed Capacity:</span> <strong style="float: right;">${props.l_z.total} [MW]</strong></div>`;
		}
		else {
			info = 'Hover over a Load Zone';
		}
		this._div.innerHTML = info;
	};

	return info;
}

// Function to configure all of the features (such as higlight, onclick, resethighlight etc)

export function setGeoJSON(country, map, a, mapInfo) {
	// dafuq? This is incredibly slow
	var newCountry = JSON.parse(JSON.stringify(country));
	let shapeLayers = {};
	let shapeNames = {
		'Prodesen': '',
		'Switch': ''
	};
	for (let shapeName in shapeNames) {
		// iterates over the shapes that a country has (in our case both the ones provided by prodesen and the ones generated with Mateo's work)

		let geojsonLayers = [];

		// For each balance area
		for (let key in country.balancingAreas) {
			// function to iterate over the geojson files and attach them a click handler per feature (polygon, point..shape)

			let shapes = country.balancingAreas[key].properties.shape[shapeName].features;

			// For each load zone in this balance area, store in newShapes the shape if it exists in loadZones
			let newShapes = []; // An array of load zones
			let keys = Object.keys(country.loadZones);

			shapes.map(obj =>
				keys.map(k => {
					if (obj.properties.ID === k) {
						newShapes.push(obj);
					}
				})
			);
			// Reordering? according to the loadZones?
			newCountry.balancingAreas[key].properties.shape[shapeName].features = newShapes;

			geojsonLayers.push(
				L.geoJson(newCountry.balancingAreas[key].properties.shape[shapeName], {
					fillColor: country.balancingAreas[key].properties.color,
					weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7,
					b_a: country.balancingAreas[key],
					pane: 'shapes',
					onEachFeature: function(feature, layer) {
						layer.on('click', e => {
							let id = feature.properties.ID;
							zoomToFeature(layer, map);
							handleClick(country.loadZones[id], a);
						});
						layer.on('mouseover', e => {
							highlightFeature(layer, layer.feature.properties, map, country, key, a, mapInfo);
						});

						layer.on('mouseout', e => {
							resetHighlight(layer, mapInfo, a);
						});
					},
				})
			);

		}
		geojsonLayers.forEach(layer => {
			let featureGroup = L.featureGroup([layer]);
			featureGroup.on('click', () => handleClick(layer.options.b_a, a));
		});

		shapeLayers[shapeName] = L.layerGroup(geojsonLayers);
	}
	return shapeLayers;
}

export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


