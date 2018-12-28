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
const studentFavoritesViewTemplate = require('../templates/student-favorites.handlebars');

export default () => {
  window.location.reload();

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let currentUserKey = localStorage.getItem('currentUserKey');
      const database = firebase.database();
      const ref = database.ref('favorites/' + currentUserKey);
      let allRooms = [];
      let index;
      let roomKeys = [];
      let clickedRoomKey;
      let userLat = parseFloat(localStorage.getItem('userLat'));
      let userLon = parseFloat(localStorage.getItem('userLon'));
      // console.log(userLat);
      // console.log(userLon);

      ref.on("value", function (data) {
        let rooms = data.val();
        if (rooms === undefined || rooms === null) {
          let alert = document.createElement('p');
          alert.innerHTML = 'Nog geen favorieten toegevoegd';
          alert.style.textAlign = 'center';
          document.body.appendChild(alert);
          // alert.innerHTML = '';
        } else {
          console.log(rooms);
          let keys = Object.keys(rooms);
          roomKeys.push(keys);
          // console.log(allRooms);

          for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            let Room = {
              rentalPrice: rooms[k].rentalPrice,
              warrant: rooms[k].warrant,
              type: rooms[k].type,
              surface: rooms[k].surface,
              floors: rooms[k].floors,
              numberOfPersons: rooms[k].numberOfPersons,
              toilet: rooms[k].toilet,
              douche: rooms[k].douche,
              bath: rooms[k].bath,
              kitchen: rooms[k].kitchen,
              furnished: rooms[k].furnished,
              address: rooms[k].address,
              ownerKey: rooms[k].ownerKey,
              image: rooms[k].image,
              lat: rooms[k].lat,
              lon: rooms[k].lon,
            }
            allRooms.push(Room);
          }
          console.log(allRooms);


          // Calculate distance between listed rooms and user's university longitude and latitude
          for (let i = 0; i < allRooms.length; i++) {
            let roomLat = allRooms[i].lat;
            let roomLon = allRooms[i].lon;

            function getDistanceFromLatLonInKm(userLat, userLon, roomLat, roomLon) {

              let R = 6371; // Radius of the earth in km
              let dLat = deg2rad(roomLat - userLat); // deg2rad below
              let dLon = deg2rad(roomLon - userLon);
              let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(userLat)) * Math.cos(deg2rad(roomLat)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
              let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              let d = R * c; // Distance in km
              // console.log(d);
              allRooms[i].distance = parseFloat(d).toFixed(2);
            }
            getDistanceFromLatLonInKm(userLat, userLon, roomLat, roomLon);

            function deg2rad(deg) {
              return deg * (Math.PI / 180)
            }
          }
        }


        update(compile(studentFavoritesViewTemplate)({
          allRooms
        }));

        let room = document.querySelectorAll('.info-list');
        for (let i = 0; i < room.length; i++) {
          room[i].id = "room" + i;
          room[i].addEventListener('click', showDetail);
        };

        function showDetail() {
          index = this.id.substr(4);
          let roomDetail = allRooms[index];
          localStorage.setItem('roomDetail', JSON.stringify(roomDetail));
          // clickedRoomKey = roomKeys[0][index];
          // console.log(clickedRoomKey);
          window.location.replace('/#/student-detailview');
        };

        // firebase logout at buttonclick
        const btnLogout = document.querySelector('.btnLogout');
        btnLogout.addEventListener('click', e => {
          firebase.auth().signOut().then(function () {
            window.location.replace('/#/');
          });
        });

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
      console.log('User check')

    } else {
      console.log('No valid user!')
    }
  });
}