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
const studentMessagesDetailViewTemplate = require('../templates/student-messages-detail.handlebars');

export default () => {
  // Data to be passed to the template

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      let ownerKey = localStorage.getItem('ownerKey');
      let currentUser = localStorage.getItem('currentUserKey');

      const database = firebase.database();
      const ref = database.ref('userdata/' + ownerKey);

      // Get persons name 
      ref.once("value")
        .then(function (snapshot) {
          let name = snapshot.child('firstname').val() + ' ' + snapshot.child('lastname').val();
          let messageTo = document.getElementsByClassName('message-person')[0];
          messageTo.textContent = name;
        });

      // Return the compiled template to the router
      update(compile(studentMessagesDetailViewTemplate)({
        name
      }));

      function addMessageToDb() {
        const messageRef = database.ref('userdata/' + ownerKey + '/');
        let messageContent = document.querySelectorAll('input.message-type-area')[0].value;
        let Message = {
          admin: ownerKey,
          currentUser: currentUser,
          content: messageContent
        }
        messageRef.push(Message);
      }

      let sendMessage = document.getElementById('sendMessage');
      sendMessage.addEventListener('click', addMessageToDb);

      // firebase logout at buttonclick
      const btnLogout = document.querySelector('.btnLogout');
      console.log(btnLogout);
      btnLogout.addEventListener('click', e => {
        firebase.auth().signOut().then(function () {
          console.log('log uit');
          window.location.replace('/#/');
        });
      });
      console.log('User check')
    } else {
      console.log('No valid user!')
    }
  });

};