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

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let currentUserKey = localStorage.getItem('currentUserKey');
      const database = firebase.database();
      const ref = database.ref('favorites/' + currentUserKey);
      let allRooms = [];
      let index;
      let roomKeys = [];
      let clickedRoomKey;

      ref.on("value", function (data) {
        let rooms = data.val();
        // console.log(rooms);
        let keys = Object.keys(rooms);
        roomKeys.push(keys);
        console.log(allRooms);

        for (let i = 0; i < keys.length; i++) {
          let k = keys[i];
          let Room = {
            rentalPrice: rooms[k].rentalPrice,
            warrant: rooms[k].warrant,
            type: rooms[k].type,
            surface: rooms[k].surface + ' sq m',
            floors: rooms[k].floors,
            numberOfPersons: rooms[k].numberOfPersons,
            toilet: rooms[k].toilet,
            douche: rooms[k].douche,
            bath: rooms[k].bath,
            kitchen: rooms[k].kitchen,
            furnished: rooms[k].furnished,
            address: rooms[k].address,
            ownerKey: rooms[k].ownerKey
          }
          allRooms.push(Room);
          // console.log(allRooms);
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