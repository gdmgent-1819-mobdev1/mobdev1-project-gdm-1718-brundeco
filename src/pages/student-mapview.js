// Only import the compile function from handlebars instead of the entire library
import {
  compile
} from 'handlebars';
import update from '../helpers/update';

import {
  getInstance
} from '../firebase/firebase';
const firebase = getInstance();

// Import the template to use
const studentMapViewTemplate = require('../templates/student-mapview.handlebars');

export default () => {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const userType = localStorage.getItem('userType');
      if (userType == 'student') {
        // Return the compiled template to the router
        update(compile(studentMapViewTemplate)());
        const database = firebase.database();
        const ref = database.ref('roomdata');

        let toggleGameView = document.getElementById('toggleGameView');
        toggleGameView.addEventListener('click', function () {
          window.location.replace('/#/student-home');
        })

        mapboxgl.accessToken = 'pk.eyJ1IjoiYnJ1bmVsbGkiLCJhIjoiY2pwc3preGx3MDBxYjQzbzk4c2dtanpwaCJ9.J2IeUoqxBZCa5Aa5547rgA';

        let map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v10',
          center: [3.7167, 51.05],
          zoom: 9
        });

        ref.on("value", function (data) {
          let rooms = data.val();
          let keys = Object.keys(rooms);
          let allRooms = [];
          // roomKeys.push(keys);

          for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            let Room = {
              rentalPrice: rooms[k].rentalPrice,
              type: rooms[k].type,
              surface: rooms[k].surface + ' m²',
              address: rooms[k].address,
              ownerKey: rooms[k].ownerKey,
              lat: rooms[k].lat,
              lon: rooms[k].lon,
            }
            allRooms.push(Room);

            for (let i = 0; i < allRooms.length; i++) {
              new mapboxgl.Marker()
                .setLngLat([allRooms[i].lon, allRooms[i].lat])
                .setPopup(new mapboxgl.Popup({
                    className: 'mapbox-pop-up'
                  })
                  .setHTML(
                    `<p class='mapbox-pop-up-title'>${allRooms[i].address}</p>
            <p class='mapbox-pop-up-title-2'>€ ${allRooms[i].rentalPrice} per maand</p>
            <p class='mapbox-pop-up-title-2'> ${allRooms[i].surface}</p>
            `))
                .addTo(map);
            }

            // firebase logout at buttonclick
            const btnLogout = document.querySelector('.btnLogout');
            btnLogout.addEventListener('click', e => {
              firebase.auth().signOut().then(function () {
                window.location.replace('#/');
              });
            });
          }
        })
      } else {
        console.log('Wrong usertype');
        window.location.replace('/#/');
      }
    } else {
      console.log('No valid user');
      window.location.replace('/#/');
    }
  })

}