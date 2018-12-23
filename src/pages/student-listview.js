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

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const database = firebase.database();
      const ref = database.ref('roomdata');
      let allRooms = [];
      let index;
      let roomKeys = [];
      let clickedRoomKey;

      ref.on("value", function (data) {
        let rooms = data.val();
        // console.log(rooms);
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
          // console.log(allRooms);
        }

        update(compile(studentListViewTemplate)({
          allRooms
        }));

        console.log(allRooms);

        // var objs = [ 
        //   { first_nom: 'Lazslo', last_nom: 'Jamf'     },
        //   { first_nom: 'Pig',    last_nom: 'Bodine'   },
        //   { first_nom: 'Pirate', last_nom: 'Prentice' }
        // ];

        // for(var i = 0; i < allRooms.length; i++){
        //   allRooms[i]['distance'] = allRooms[i]['last_nom'];
        // }

        // function compare(a,b) {
        //   if (a.distance < b.distance)
        //     return -1;
        //   if (a.distance > b.distance)
        //     return 1;
        //   return 0;
        // }

        // objs.sort(compare);
        // alert(JSON.stringify(objs));



        let toggleMapview = document.getElementById('toggleMapView');
        toggleMapview.addEventListener('click', function () {
          window.location.replace('/#/student-mapview');
        })

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