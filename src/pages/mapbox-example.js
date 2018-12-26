// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';
import config from '../config';

// Import the update helper
import update from '../helpers/update';

// Import the template to use
const mapTemplate = require('../templates/page-with-map.handlebars');

export default () => {
  // Data to be passed to the template
  const title = 'Mapbox example';
  update(compile(mapTemplate)({ title }));

  // Mapbox code
  if (config.mapBoxToken) {
    mapboxgl.accessToken = config.mapBoxToken;
    // eslint-disable-next-line no-unused-vars
    const map = new mapboxgl.Map({
      container: 'map',
      center: [-74.50, 40],
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 30,
    });

    new mapboxgl.Marker()
    .setLngLat([3.717655, 51.039935])
    .addTo(map);
    // .setLngLat([room.directions.coords.lng, room.directions.coords.lat])

    


  } else {
    console.error('Mapbox will crash the page if no access token is given.');
  }
};
