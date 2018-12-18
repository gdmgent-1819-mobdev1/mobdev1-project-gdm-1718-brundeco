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
      update(compile(homeStudentTemplate)());
      // console.log('We have a user');

      let allRooms = [];
      let indexCurrentRoom = 0;
      let currentRoom;
      let likeBtn = document.getElementById('likeBtn');
      likeBtn.addEventListener('click', likeRoom);

      let toggleListview = document.getElementById('toggleListView');
      toggleListview.addEventListener('click', function() {
        window.location.replace('/#/student-listview');
      })
      let toggleMapview = document.getElementById('toggleMapView');
      toggleMapview.addEventListener('click', function() {
        window.location.replace('/#/student-mapview');
      })

      const database = firebase.database();
      const ref = database.ref('roomdata/');

      ref.on('value', (snapshot) => {
        snapshot.forEach(function (childSnapshot) {
          let key = childSnapshot.key;
          let rooms = childSnapshot.val();
          console.log(key);
          allRooms.push(rooms);
        })
        returnRoom(indexCurrentRoom);
      })

      function likeRoom(key) {
        indexCurrentRoom++;
        returnRoom(indexCurrentRoom);
        const likes = database.ref('favorites');
        likes.push(currentRoom)
      }

      function returnRoom() {
        console.log(allRooms[indexCurrentRoom].type);
        currentRoom = allRooms[indexCurrentRoom];
        let box = document.getElementsByClassName('center-all')[0];
        let roomImage = document.getElementsByClassName('room-picture')[0];
        let roomType = document.getElementsByClassName('card-room-type')[0];
        let roomAddress = document.getElementsByClassName('card-address')[0];
        let roomSurface = document.getElementsByClassName('card-surface')[0];

        roomImage.src = 'src/images/kot-3.jpg';
        roomType.innerHTML = allRooms[indexCurrentRoom].type;
        roomAddress.innerHTML = allRooms[indexCurrentRoom].address;
        roomSurface.innerHTML = allRooms[indexCurrentRoom].surface;
      }
        
    } else {
      window.location.replace('/#/');
      console.log('Logged out');
    }

    // firebase logout at buttonclick
    const btnLogout = document.querySelector('.btnLogout');
    console.log(btnLogout);
    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut().then(function () {
        console.log('log uit');
        window.location.replace('/#/');
      });
    });
  });



}