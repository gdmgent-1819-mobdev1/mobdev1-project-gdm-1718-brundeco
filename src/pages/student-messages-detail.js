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
      const userType = localStorage.getItem('userType');
      if (userType == 'student') {
        let currentdate = new Date();
        let datetime = currentdate.getDate() + '/' + currentdate.getMonth() + ' om ' + currentdate.getHours() + ':' + currentdate.getMinutes();
        let ownerKey = localStorage.getItem('ownerKey');
        let currentUser = localStorage.getItem('currentUserKey');
        let userName = localStorage.getItem('currentUserName');
        let senderName;
        const database = firebase.database();

        // Get sender name
        const nameRef = database.ref('userdata/' + currentUser);
        nameRef.once("value")
          .then(function (snapshot) {
            let name = snapshot.child('firstname').val() + ' ' + snapshot.child('lastname').val();
            senderName = name;
          });

        // Return the compiled template to the router
        update(compile(studentMessagesDetailViewTemplate)({
          name
        }));

        // Add message to database
        function addMessageToDb() {
          const messageRef = database.ref('messages/');
          let messageContent = document.querySelectorAll('input.message-type-area')[0].value;
          let Message = {
            receiver: ownerKey,
            senderKey: currentUser,
            senderName: senderName,
            content: messageContent,
            date: datetime
          }
          messageRef.push(Message);
          window.location.replace('#/student-listview');
        }

        let sendMessage = document.getElementById('sendMessage');
        sendMessage.addEventListener('click', addMessageToDb);

        // firebase logout at buttonclick
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
};