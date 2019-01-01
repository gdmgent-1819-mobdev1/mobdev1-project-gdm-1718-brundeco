// Only import the compile function from handlebars instead of the entire library
import {
  compile
} from 'handlebars';
import update from '../helpers/update';

import {
  getInstance
} from '../firebase/firebase';
const firebase = getInstance();

const studentListViewSortedTemplate = require('../templates/student-listview-sorted.handlebars');

export default () => {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const userType = localStorage.getItem('userType');
      if (userType == 'student') {
        const database = firebase.database();
        const ref = database.ref('roomdata');
        let allRooms = [];
        let index;
        let roomKeys = [];
        let clickedRoomKey;
        let userLat = parseFloat(localStorage.getItem('userLat'));
        let userLon = parseFloat(localStorage.getItem('userLon'));

        ref.on("value", function (data) {
          allRooms = Object.values(data.val());
          let keys = Object.keys(data.val());
          console.log(keys);
          roomKeys.push(keys);

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
              allRooms[i].distance = parseFloat(d).toFixed(2);
            }
            getDistanceFromLatLonInKm(userLat, userLon, roomLat, roomLon);

            function deg2rad(deg) {
              return deg * (Math.PI / 180)
            }
          }
          allRooms.sort((a, b) => a.distance - b.distance);

          update(compile(studentListViewSortedTemplate)({
            allRooms,
          }));


          let sortByRecent = document.querySelector('button#sortByRecent');
          sortByRecent.style.display = 'block';
          sortByRecent.addEventListener('click', function() {
            window.location.replace('/#/student-listview');
          })

          let toggleMapview = document.getElementById('toggleMapView');
          toggleMapview.addEventListener('click', function () {
            window.location.replace('#/student-mapview');
          })

          let toggleGameView = document.getElementById('toggleGameView');
          toggleGameView.addEventListener('click', function () {
            window.location.replace('#/student-home');
          })

          let room = document.querySelectorAll('.info-list');
          for (let i = 0; i < room.length; i++) {
            room[i].id = "room" + i;
            room[i].addEventListener('click', showDetail);
          };

          function showDetail() {
            index = this.id.substr(4);
            let roomDetail = allRooms[index];
            console.log(roomDetail);
            localStorage.setItem('roomDetail', JSON.stringify(roomDetail));
            clickedRoomKey = roomKeys[0][index];
            localStorage.setItem('roomKey', clickedRoomKey);
            console.log(clickedRoomKey);
            window.location.replace('#/student-detailview');
          };

          // firebase logout at buttonclick
          const btnLogout = document.querySelector('.btnLogout');
          btnLogout.addEventListener('click', e => {
            firebase.auth().signOut().then(function () {
              window.location.replace('#/');
            });
          });

        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      } else {
        console.log('Wrong usertype');
        window.location.replace('/#/');
      }
    } else {
      console.log('No valid user');
      window.location.replace('/#/');
    }
  });
}