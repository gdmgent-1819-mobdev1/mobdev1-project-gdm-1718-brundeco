// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const studentMapViewTemplate = require('../templates/student-mapview.handlebars');

export default () => {
  // Data to be passed to the template

  // Return the compiled template to the router
  update(compile(studentMapViewTemplate)());

    let toggleListView = document.getElementById('toggleListView');
    toggleListView.addEventListener('click', function() {
      window.location.replace('/#/student-listview');
    })

    mapboxgl.accessToken = 'pk.eyJ1IjoiYnJ1bmVsbGkiLCJhIjoiY2pwc3preGx3MDBxYjQzbzk4c2dtanpwaCJ9.J2IeUoqxBZCa5Aa5547rgA';
    
    let map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [3.7167, 51.05],
      zoom: 12
    });

    
  

};
