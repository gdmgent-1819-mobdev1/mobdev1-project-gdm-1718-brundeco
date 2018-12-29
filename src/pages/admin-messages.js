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
  // window.location.reload();

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let currentUserKey = localStorage.getItem('currentUserKey');
      const database = firebase.database();
      const ref = database.ref('messages/').orderByChild('receiver').equalTo(currentUserKey);
      let messageList = [];
      let Message;

      function convertObjectToArray(objects) {
        return Object.keys(objects).map(i => objects[i]);
      }

      ref.on("value", function (snap) {
        snap.forEach(function (childSnapshot) {
            let data = childSnapshot.val();
            if (data.receiver === currentUserKey) {
              Message = {
                content: data.content,
                sender: data.senderName,
                receiver: currentUserKey,
                date: data.date
              }
            }
            messageList.push(Message);
            // console.log(messageList);
        });
      });

      // Return the compiled template to the router
      update(compile(adminMessagesViewTemplate)({
        messageList
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