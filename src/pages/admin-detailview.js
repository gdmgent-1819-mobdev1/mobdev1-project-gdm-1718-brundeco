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
const adminDetailViewTemplate = require('../templates/admin-detailview.handlebars');

export default () => {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      function roomEditSucces() {
        const text = 'Kot werd aangepast';
        if (!("Notification" in window)) {
          alert("This browser does not support system notifications");
        }
        else if (Notification.permission === "granted") {
          let notification = new Notification("Done!", {body: text});
        }
        else if (Notification.permission !== 'denied') {
          Notification.requestPermission(function (permission) {
            if (permission === "granted") {
              let notification = new Notification("Done!", {body: text});
            }
          });
        }
      }

      let currentUserKey = localStorage.getItem('currentUserKey');
      let currentRoomKey = localStorage.getItem('currentRoomKey');
      const database = firebase.database();
      const ref = database.ref('roomdata/' + currentRoomKey);
      let clickedRoom = [];
      let Room;
      let roomDetail = JSON.parse(localStorage.getItem('roomDetail'));
      clickedRoom.push(roomDetail);
      console.log(clickedRoom);

      update(compile(adminDetailViewTemplate)({
        clickedRoom
      }));

      const contentBlock = document.getElementById('contentBlock');
      const roomEditForm = document.getElementById('editRoom');
      const btnEditRoom = document.getElementById('btnEditRoom');
      const editRoomSubmit = document.getElementById('editRoomSubmit');

      roomEditForm.style.display = 'none';
      btnEditRoom.addEventListener('click', showEditForm);

      function showEditForm() {
        roomEditForm.style.display = 'flex';
        contentBlock.style.display = 'none';
      }

      function editRoomData() {
        let rentalPrice = document.getElementById("rentalPrice").value;
        let warrant = document.getElementById("warrant").value;
        let surface = document.getElementById("surface").value;
        let address = document.getElementById("address").value;
        let type = document.getElementById("roomType").value;
        let floors = document.getElementById("floors").value;
        let numberOfPersons = document.getElementById("numberOfPersons").value;
        let toilet = document.getElementById("toilet").value;
        let douche = document.getElementById("douche").value;
        let bath = document.getElementById("bath").value;
        let kitchen = document.getElementById("kitchen").value;
        let furnished = document.getElementById("furnished").value;
        let key = localStorage.getItem('currentUserKey');

        let geocoder = new google.maps.Geocoder();
        let currentAddress = address;
        let lat;
        let lon;
        geocoder.geocode({
          'address': currentAddress
        }, function (results, status) {

          if (status == google.maps.GeocoderStatus.OK) {

            lat = results[0].geometry.location.lat();
            lon = results[0].geometry.location.lng();
            console.log(lat);
            console.log(lon);

          } else {
            console.log('Google niet ok');
          }

          ref.set({
            type: type,
            rentalPrice: rentalPrice,
            warrant: warrant,
            surface: surface,
            address: address,
            floors: floors,
            numberOfPersons: numberOfPersons,
            toilet: toilet,
            douche: douche,
            bath: bath,
            kitchen: kitchen,
            furnished: furnished,
            ownerKey: key,
            lat: lat,
            lon: lon
          });
          roomEditSucces();
        });
      }

      editRoomSubmit.addEventListener('click', editRoomData);


      // firebase logout at buttonclick
      const btnLogout = document.querySelector('.btnLogout');
      btnLogout.addEventListener('click', e => {
        firebase.auth().signOut().then(function () {
          window.location.replace('/#/');
        });
      });
      console.log('User check')
    } else {
      console.log('No valid user!')
    }
  });
};