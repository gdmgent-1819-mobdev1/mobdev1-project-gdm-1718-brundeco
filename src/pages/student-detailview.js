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
      let roomKey = localStorage.getItem('roomKey');
      clickedRoom.push(roomDetail);
      // console.log(clickedRoom);

      // Return the compiled template to the router
      update(compile(studentDetailViewTemplate)({
        clickedRoom
      }));


      let addToFavoritesBtn = document.getElementById('addToFavorites');
      addToFavoritesBtn.addEventListener('click', addToFavorites);

      function addToFavorites() {
        const favoRef = database.ref('favorites/' + currentUserKey + '/' + roomKey);
          favoRef.set(roomDetail);
      }

      let fbButton = document.getElementById('fbShareButton');
      let url = 'https://www.flavorpaper.com/';
      fbButton.addEventListener('click', function() {
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + url,
              'facebook-share-dialog',
              'width=800,height=600'
          );
          return false;
      });


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