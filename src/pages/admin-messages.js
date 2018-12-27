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
const adminMessagesViewTemplate = require('../templates/admin-messages.handlebars');

export default () => {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let currentUser = localStorage.getItem('currentUserKey');
      const database = firebase.database();
      const ref = database.ref('userdata/' + currentUser);
      let messageList = [];

      function convertObjectToArray(objects) {
        return Object.keys(objects).map(i => objects[i]);
      }

      ref.once("value")
        .then(function (data) {
          let messages = convertObjectToArray(data.val());
          messages.forEach(message => {
            let content = message.content;
            console.log(content);
            messageList.push(content);
          });
          console.log(messageList);
        });

      // Return the compiled template to the router
      update(compile(adminMessagesViewTemplate)({
        name
      }));

      // firebase logout at buttonclick
      const btnLogout = document.querySelector('.btnLogout');
      console.log(btnLogout);
      btnLogout.addEventListener('click', e => {
        firebase.auth().signOut().then(function () {
          console.log('log uit');
          window.location.replace('/#/');
        });
      });
    }
  })
};