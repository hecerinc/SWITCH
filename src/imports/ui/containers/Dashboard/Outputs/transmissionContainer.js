
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
import country from '/imports/ui/data';
import coordinates from '/imports/ui/data/load_zones/coordinates';
import { drawPoints, setLegend, setInfo, showMap, getYears, showNewPoints } from './mapHelpers';

import '/imports/ui/styles/App/HomeContainer.scss';

const Container = compose(
  graphql(gql`
    query fileQuery {
      getTransmissionLines
    }
  `),
  withState('map', 'setMap', 0),
  withState('datas', 'setDatas', 0),
  withState('period', 'setPeriod', 0),
  withState('country', 'setCountry', 0),
  withState('mapInfo', 'setMapInfo', 0),
  withState('blueLines', 'setBlueLines', 0),
  lifecycle({
    componentWillMount() {
      this.props.data.refetch();
    },
    componentDidMount() {
      let self = this; // save de reference to the component context
      this.props.data.refetch().then(res => {
        let data = res.data.getTransmissionLines[0]; // fixed
        data = data.rows;
        let period = getYears(data);
        self.props.setPeriod(period);
        self.props.setDatas(data);

        let map = L.map(this.refs.transmission_map, { zoomControl: false, minZoom: 4 });
        map.setView([23.8, -102.1], 5);

        map.createPane('labels');
        map.getPane('labels').style.zIndex = 0;

        map.createPane('blue');
        map.getPane('blue').style.zIndex = 500;

        map.createPane('red');
        map.getPane('red').style.zIndex = 850;

        map.createPane('description');
        drawPoints(self, country, map); // draw the coentroid of each load zone

        map.getPane('description').style.zIndex = 750;
        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
          attribution: '©OpenStreetMap, ©CartoDB',
        }).addTo(map);

        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
          attribution: '©OpenStreetMap, ©CartoDB',
          pane: 'labels',
        }).addTo(map);

        let legend = setLegend();
        let info = setInfo();
        showMap(self, map);
        legend.addTo(map);
        info.addTo(map);
        self.props.setMapInfo(info);
        self.props.setMap(map);
        // showNewPoints(self.props.country, map, data, period, blueLines);
      });
    },
  })
)(Transmission);

export default Container;
