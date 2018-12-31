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
const homeAdminTemplate = require('../templates/admin-home.handlebars');

export default () => {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      const userType = localStorage.getItem('userType');
      if (userType == 'admin') {

        update(compile(homeAdminTemplate)());

        const addRoomBtn = document.getElementById('addRoomSubmit');
        let allRooms = [];
        let Room;
        const database = firebase.database();
        let currentUser = localStorage.getItem('currentUserKey');
        let imageUrl;

        // get users name to use in messages
        const userRef = database.ref('userdata/' + currentUser);
        userRef.once("value")
          .then(function (snapshot) {
            let name = snapshot.child('firstname').val() + ' ' + snapshot.child('lastname').val();
            console.log(name);
            localStorage.setItem('currentUserName', name);
          });

        let ref = database.ref('roomdata');
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

        function collectFormData(e) {
          // e.preventDefault();
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
          let adminName = localStorage.getItem('currentUserName');

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
              alert('Gelieve een juist adres in te geven');
            }
            Room = {
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
              image: imageUrl,
              adminName: adminName,
            }
            ref.push(Room);
            allRooms.push(Room);
            window.location.reload();
          });
        }
        addRoomBtn.addEventListener('click', collectFormData);

        //firebase logout at buttonclick
        const btnLogout = document.querySelector('.btnLogout');
        btnLogout.addEventListener('click', e => {
          firebase.auth().signOut().then(function () {
            window.location.replace('/#/');
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
  });
}