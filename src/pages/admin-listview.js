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
      const userType = localStorage.getItem('userType');
      if (userType == 'admin') {
        let currentUser = localStorage.getItem('currentUserKey');
        let usersRooms = [];
        let allRooms = [];
        let index;
        let roomKeys = [];
        let clickedRoomKey;
        let imageUrlLs;
        let Room;

        const database = firebase.database();
        const ref = database.ref('roomdata');

        ref.orderByChild('ownerKey')
          .equalTo(currentUser)
          .once("value", snapshot => {
            if (snapshot.exists()) {
              const rooms = snapshot.val();
              let keys = Object.keys(rooms);
              roomKeys.push(keys);

              for (let i = 0; i < keys.length; i++) {
                let k = keys[i];
                Room = {
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
                  lat: rooms[k].lat,
                  lon: rooms[k].lon,
                  image: rooms[k].image,
                  roomKey: keys[i],
                  adminName: rooms[k].adminName
                }
                allRooms.push(Room);
              }

            } else {
              console.log('Geen koten gevonden voor deze admin');
            }

            update(compile(adminListViewTemplate)({
              allRooms
            }));

            let activeIcon = document.querySelector('.first-image-admin');
            activeIcon.style.backgroundImage = 'url("src/images/adminRoomsActive.svg")';

            let room = document.querySelectorAll('.info-list')
            for (let i = 0; i < room.length; i++) {
              room[i].id = "room" + i;
              room[i].addEventListener('click', showDetail);
            };

            function showDetail() {
              index = this.id.substr(4);
              let roomDetail = allRooms[index];
              localStorage.setItem('roomDetail', JSON.stringify(roomDetail));
              clickedRoomKey = roomKeys[0][index];
              localStorage.setItem('roomKey', clickedRoomKey);
              imageUrlLs = allRooms[index].image;
              localStorage.setItem('currentRoomImgUrl', imageUrlLs);
              window.location.replace('#/admin-detailview');
            };

            // firebase logout at buttonclick
            const btnLogout = document.querySelector('.btnLogout');
            btnLogout.addEventListener('click', e => {
              firebase.auth().signOut().then(function () {
                window.location.replace('/#/');
              });
            });
          });
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