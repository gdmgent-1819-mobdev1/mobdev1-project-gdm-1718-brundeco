// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

import { getInstance } from '../firebase/firebase';
const firebase = getInstance();

// Import the template to use
const homeAdminTemplate = require('../templates/admin-home.handlebars');

export default () => {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Return the compiled template to the router
      update(compile(homeAdminTemplate)());
      // console.log('We have a user');
      const addRoomBtn = document.getElementById('addRoomSubmit');

      let allRooms = [];

      const database = firebase.database();
      const ref = database.ref('roomdata');

      addRoomBtn.addEventListener('click', e => {
        let rentalPrice = document.getElementById("rentalPrice").value;
        let warrant = document.getElementById("warrant").value;
        let surface = document.getElementById("surface").value;
        let address = document.getElementById("address").value;
        let type = document.getElementById("roomType").value;
        let floors = document.getElementById("floors").value;
        let numberOfPersons = document.getElementById("numberOfPersons").value;
        let toilet = document.getElementById("toilet").value;
        let douche = document.getElementById("douche").value;
        let bath = document.getElementById("bath").value;
        let kitchen = document.getElementById("kitchen").value;
        let furnished = document.getElementById("furnished").value;
        let key = localStorage.getItem('currentUserKey');
        
        let geocoder = new google.maps.Geocoder();
        let currentAddress = address;
        let lat;
        let lon;
        
        geocoder.geocode( { 'address': currentAddress}, function(results, status) {

          if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lon = results[0].geometry.location.lng();
            console.log(lat);
            console.log(lon);
            let Room = {
              type: type,
              rentalPrice: rentalPrice,
              warrant: warrant,
              surface: surface,
              address: address,
              floors: floors,
              numberOfPersons: numberOfPersons,
              toilet: toilet,
              douche: douche,
              bath: bath,
              kitchen: kitchen,
              furnished: furnished,
              ownerKey: key,
              lat: lat,
              lon: lon
            }
        
            ref.push(Room);
            allRooms.push(Room);
            // console.log(allRooms);
          } 
        });
      
      });
    } else {
      window.location.replace('/#/');
      // console.log('Something went wrong');
    }


    //firebase logout at buttonclick
    const btnLogout = document.querySelector('.btnLogout');
    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut().then(function() {
        localStorage.setItem('isSignedIn', false)
        console.log('log uit');
        window.location.replace('/#/');
      });
    });
  });



}


          // localStorage.setItem('room-collection', JSON.stringify(objects));
          // let room = objects[Object.keys(objects)[0]];
          // console.log(room);
          // let roomLs = JSON.parse(localStorage.getItem('room-collection'));
          // console.log(roomLs);