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
const studentDetailViewTemplate = require('../templates/student-detailview.handlebars');

export default () => {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let currentUserKey = localStorage.getItem('currentUserKey');
      const database = firebase.database();
      const ref = database.ref('favorites/' + currentUserKey);
      let clickedRoom = [];
      let roomDetail = JSON.parse(localStorage.getItem('roomDetail'));
      clickedRoom.push(roomDetail);
      // console.log(clickedRoom);

      // Return the compiled template to the router
      update(compile(studentDetailViewTemplate)({
        clickedRoom
      }));

      let addToFavorites = document.getElementById('addToFavorites');
      addToFavorites.addEventListener('click', function () {
        ref.push(roomDetail);
        alert('Kamer werd toegevoegd aan favorietenlijst');
      })

      let contactOwner = document.getElementById('messageToOwner');
      contactOwner.addEventListener('click', function () {
        let ownerKey = clickedRoom[0].ownerKey;
        console.log(ownerKey);
        localStorage.setItem('ownerKey', ownerKey);
        window.location.replace('/#/student-messages-detail');
      })

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