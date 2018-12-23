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

  function convertObjectToArray(objects) {
    return Object.keys(objects).map(i => objects[i]);
  }

  let currentUser = localStorage.getItem('currentUserKey');
  let usersRooms = [];
  let allRooms = [];

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
      console.log(allRooms);
    }

      // Return the compiled template to the router
      update(compile(adminListViewTemplate)({
        allRooms
      }));

      // const hide = document.getElementsByClassName('contact-owner')[0];
      // console.log(hide);
      // hide.style.display = 'none';

      // firebase logout at buttonclick
      const btnLogout = document.querySelector('.btnLogout');
      btnLogout.addEventListener('click', e => {
        firebase.auth().signOut().then(function () {
          window.location.replace('/#/');
        });
      });
  });



}