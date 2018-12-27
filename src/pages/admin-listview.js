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
const adminListViewTemplate = require('../templates/admin-listview.handlebars');

export default () => {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      function convertObjectToArray(objects) {
        return Object.keys(objects).map(i => objects[i]);
      }
    
      let currentUser = localStorage.getItem('currentUserKey');
      let usersRooms = [];
      let allRooms = [];
      let index;
      let roomKeys = [];
      let clickedRoomKey;
      let Room;
    
      const database = firebase.database();
      const ref = database.ref('roomdata');
    
      ref.once("value")
      .then(function(data) {
        let rooms = convertObjectToArray(data.val());
        rooms.forEach(room => {
          let userKey = room.ownerKey;
          if(currentUser === userKey){
            usersRooms.push(room);
            // console.log(usersRooms);
          }
        });
        // console.log(usersRooms);
    
        for (let i = 0; i < usersRooms.length; i++) {
          // console.log(usersRooms);
          let Room = {
            rentalPrice: usersRooms[i].rentalPrice,
            warrant: usersRooms[i].warrant,
            type: usersRooms[i].type,
            surface: usersRooms[i].surface + ' sq m',
            floors: usersRooms[i].floors,
            numberOfPersons: usersRooms[i].numberOfPersons,
            toilet: usersRooms[i].toilet,
            douche: usersRooms[i].douche,
            bath: usersRooms[i].bath,
            kitchen: usersRooms[i].kitchen,
            furnished: usersRooms[i].furnished,
            address: usersRooms[i].address,
            ownerKey: usersRooms[i].ownerKey
          }
          // console.log(Room.rentalPrice);
          allRooms.push(Room);
          // console.log(allRooms);
        }
    
          // firebase logout at buttonclick
          const btnLogout = document.querySelector('.btnLogout');
          btnLogout.addEventListener('click', e => {
            firebase.auth().signOut().then(function () {
              window.location.replace('/#/');
            });
          });
      });
    
      ref.on("value", function (data) {
        let rooms = data.val();
        let keys = Object.keys(rooms);
        roomKeys.push(keys);
    
        for (let i = 0; i < keys.length; i++) {
          let k = keys[i];
          Room = {
            rentalPrice: rooms[k].rentalPrice,
            warrant: rooms[k].warrant,
            type: rooms[k].type,
            surface: rooms[k].surface + ' m²',
            floors: rooms[k].floors,
            numberOfPersons: rooms[k].numberOfPersons,
            toilet: rooms[k].toilet,
            douche: rooms[k].douche,
            bath: rooms[k].bath,
            kitchen: rooms[k].kitchen,
            furnished: rooms[k].furnished,
            address: rooms[k].address,
            ownerKey: rooms[k].ownerKey,
            lat: rooms[k].lat,
            lon: rooms[k].lon,
          }
    
          allRooms.push(Room);
        }
    
        update(compile(adminListViewTemplate)({
          allRooms
        }));
    
    
        let room = document.querySelectorAll('.info-list');
        for (let i = 0; i < room.length; i++) {
          room[i].id = "room" + i;
          room[i].addEventListener('click', showDetail);
        };
        console.log(room);
    
        function showDetail() {
          index = this.id.substr(4);
          let roomDetail = allRooms[index];
          localStorage.setItem('roomDetail', JSON.stringify(roomDetail));
          clickedRoomKey = roomKeys[0][index];
          console.log(clickedRoomKey);
          localStorage.setItem('currentRoomKey', clickedRoomKey);
          console.log(clickedRoomKey);
          window.location.replace('#/admin-detailview');
        };
    
      })
    }
  })

  



}