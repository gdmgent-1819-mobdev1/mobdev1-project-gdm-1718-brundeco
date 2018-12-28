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
const homeStudentTemplate = require('../templates/student-home.handlebars');

export default () => {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // Return the compiled template to the router
      update(compile(homeStudentTemplate)({
        allRooms
      }));

      let currentUser = localStorage.getItem('currentUserKey');
      let allRooms = [];
      let indexCurrentRoom = 0;
      let currentRoom;
      let likeBtn = document.getElementById('likeBtn');
      let skipBtn = document.getElementById('skipBtn');
      let userLat = parseFloat(localStorage.getItem('userLat'));
      let userLon = parseFloat(localStorage.getItem('userLon'));
      likeBtn.addEventListener('click', likeRoom);
      skipBtn.addEventListener('click', skipRoom);

      const database = firebase.database();

      // get users name to use in messages
      const userRef = database.ref('userdata/' + currentUser);
      userRef.once("value")
        .then(function (snapshot) {
          let name = snapshot.child('firstname').val() + ' ' + snapshot.child('lastname').val();
          localStorage.setItem('currentUserName', name);
        });

      let icon = document.getElementsByClassName('second-image')[0];
      // icon.style.backgroundImage = url('../../../src/images/homeFullActive.svg');

      let toggleListview = document.getElementById('toggleListView');
      toggleListview.addEventListener('click', function () {
        window.location.replace('/#/student-listview');
      })

      let toggleMapview = document.getElementById('toggleMapView');
      toggleMapview.addEventListener('click', function () {
        window.location.replace('/#/student-mapview');
      })

      const ref = database.ref('roomdata/');

      ref.on('value', (snapshot) => {
        snapshot.forEach(function (childSnapshot) {
          let key = childSnapshot.key;
          let rooms = childSnapshot.val();
          console.log(rooms);
          allRooms.push(rooms);
        })
        returnRoom(indexCurrentRoom);
      })

      function likeRoom() {
        allRooms.shift();
        console.log(allRooms);
        // indexCurrentRoom++;
        returnRoom(indexCurrentRoom);
        const likes = database.ref('favorites/' + currentUser);
        likes.push(currentRoom)
      }

      function skipRoom() {
        allRooms.shift();
        console.log(allRooms);
        // indexCurrentRoom++;
        returnRoom(indexCurrentRoom);
      }

      function returnRoom() {
        if (allRooms === undefined || allRooms.length == 0) {
          alert('U heeft alle kamers bekeken');
        } else {
          currentRoom = allRooms[indexCurrentRoom];
          let box = document.getElementsByClassName('center-all')[0];
          let roomImage = document.getElementsByClassName('room-picture')[0];
          let roomType = document.getElementsByClassName('card-room-type')[0];
          let roomAddress = document.getElementsByClassName('card-address')[0];
          let roomSurface = document.getElementsByClassName('card-surface')[0];

          roomImage.src = allRooms[indexCurrentRoom].image;
          roomType.innerHTML = allRooms[indexCurrentRoom].type;
          roomAddress.innerHTML = allRooms[indexCurrentRoom].address;

          let roomLat = allRooms[indexCurrentRoom].lat;
          let roomLon = allRooms[indexCurrentRoom].lon;

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
            roomSurface.innerHTML = 'op ' + parseFloat(d).toFixed(2) + ' km afstand';
            allRooms[indexCurrentRoom].distance = parseFloat(d).toFixed(2);
          }
          getDistanceFromLatLonInKm(userLat, userLon, roomLat, roomLon);

          function deg2rad(deg) {
            return deg * (Math.PI / 180)
          }
        }
      }

    } else {
      window.location.replace('/#/');
      console.log('Logged out');
    }

    // firebase logout at buttonclick
    const btnLogout = document.querySelector('.btnLogout');
    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut().then(function () {
        console.log('log uit');
        window.location.replace('/#/');
      });
    });
  });
}