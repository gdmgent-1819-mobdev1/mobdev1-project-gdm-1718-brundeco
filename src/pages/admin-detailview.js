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
        } else if (Notification.permission === "granted") {
          let notification = new Notification("Done!", {
            body: text
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission(function (permission) {
            if (permission === "granted") {
              let notification = new Notification("Done!", {
                body: text
              });
            }
          });
        }
      }

      let currentUserKey = localStorage.getItem('currentUserKey');
      let currentRoomKey = localStorage.getItem('roomKey');
      let currentRoomImgUrl = localStorage.getItem('currentRoomImgUrl');
      const database = firebase.database();
      const ref = database.ref('roomdata/' + currentRoomKey);
      let clickedRoom = [];
      let imageUrl;
      let Room;
      let roomDetail = JSON.parse(localStorage.getItem('roomDetail'));
      clickedRoom.push(roomDetail);
      // console.log(clickedRoom);

      update(compile(adminDetailViewTemplate)({
        clickedRoom
      }));

      const contentBlock = document.getElementById('contentBlock');
      const roomEditForm = document.getElementById('editRoom');
      const btnEditRoom = document.getElementById('btnEditRoom');
      const editRoomSubmit = document.getElementById('editRoomSubmit');
      const removeRoom = document.getElementById('btnRemoveRoom');

      roomEditForm.style.display = 'none';
      btnEditRoom.addEventListener('click', showEditForm);

      function showEditForm() {
        roomEditForm.style.display = 'flex';
        contentBlock.style.display = 'none';
      }

      let imagePathInStorage;
      let imageUpload = document.getElementById('roomImage');
      imageUpload.addEventListener('change', (evt) => {

        let progress = document.getElementById('progress');
        progress.style.display = 'block';

        if (imageUpload.value !== '') {
          let fileName = evt.target.files[0].name.replace(/\s+/g, '-').toLowerCase();
          document.getElementById('fullImageName').innerHTML = fileName;
          let storageRef = firebase.storage().ref(`images/${fileName}`);
          // console.log(storageRef);
          storageRef.put(evt.target.files[0]).then(() => {

            imagePathInStorage = `images/${fileName}`;
            const storageImage = firebase.storage().ref(imagePathInStorage);

            storageImage.getDownloadURL().then((url) => {
              localStorage.setItem('imageLink', url);
              if (imageUrl = null) {
                progress.style.display = 'block';
              } else {
                imageUrl = url;
                progress.style.display = 'none';
              }
              console.log(imageUrl);
            })
          })
        } else {
          console.log('empty');
        }
      });

      function editRoomData(e) {
        e.preventDefault();
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
            console.log('Onbestaand adres, google API niet beschikbaar, controleer adres');
          }
          if (imageUrl == null) {
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
              lon: lon,
              image: currentRoomImgUrl
            });
          } else {
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
              lon: lon,
              image: imageUrl
            });
          }
          roomEditSucces();
          window.location.replace('#/admin-listview');
        });
      }

      function removeCurrentRoom() {
        const ref = database.ref('roomdata/');
        let removeRoomKey = localStorage.getItem('roomKey');
        ref.child(removeRoomKey).remove();
        window.location.replace('#/admin-listview');
      }

      let fbButton = document.getElementById('fbShareButton');
      let url = 'https://www.flavorpaper.com/';
      fbButton.addEventListener('click', function() {
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + url,
              'facebook-share-dialog',
              'width=800,height=600'
          );
          return true;
      });

      editRoomSubmit.addEventListener('click', editRoomData);
      removeRoom.addEventListener('click', removeCurrentRoom)

      // firebase logout at buttonclick
      const btnLogout = document.querySelector('.btnLogout');
      btnLogout.addEventListener('click', e => {
        firebase.auth().signOut().then(function () {
          window.location.replace('/#/');
        });
      });
      // console.log('User check')
    } else {
      // console.log('No valid user!')
    }
  });
};