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
const studentListViewTemplate = require('../templates/student-listview.handlebars');

export default () => {

  const database = firebase.database();
  const ref = database.ref('roomdata');
  let allRooms = [];
  let index;
  let roomKeys = [];
  let clickedRoomKey;

  ref.on("value", function (data) {
    let rooms = data.val();
    console.log(rooms);
    let keys = Object.keys(rooms);
    roomKeys.push(keys);

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
      console.log(allRooms);
    }

    update(compile(studentListViewTemplate)({
      allRooms
    }));

    // Get elements to toggle between list and detail view
    let listBlock = document.querySelector('.content-lv');
    let detailBlock = document.querySelector('.content-wrapper');
    detailBlock.style.display = 'none';
  
    let toggleMapview = document.getElementById('toggleMapView');
    toggleMapview.addEventListener('click', function () {
      window.location.replace('/#/student-mapview');
    })

    let contactOwner = document.getElementById('messageToOwner');
    contactOwner.addEventListener('click', function() {
      let ownerKey = allRooms[index].ownerKey;
      // console.log(ownerKey);
      localStorage.setItem('ownerKey', ownerKey);
      window.location.replace('/#/student-messages-detail');
    })

    let room = document.querySelectorAll('.info-list');
    for (let i = 0; i < room.length; i++) {
      room[i].id = "room" + i;
      room[i].addEventListener('click', showDetail);
    };

    function showDetail() {
      index = this.id.substr(4);
      console.log(allRooms[index]);
      clickedRoomKey = roomKeys[0][index];
      // console.log(clickedRoomKey);
      listBlock.style.display = 'none';
      detailBlock.style.display = 'block';
    };


    // firebase logout at buttonclick
    const btnLogout = document.querySelector('.btnLogout');
    console.log(btnLogout);
    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut().then(function () {
        console.log('log uit');
        window.location.replace('/#/');
      });
    });

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}