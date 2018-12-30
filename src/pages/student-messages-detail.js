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

      let currentdate = new Date();
      let datetime = currentdate.getDate() + '/' + currentdate.getMonth() + ' om ' + currentdate.getHours() + ':' + currentdate.getMinutes();
      // let Message = JSON.parse(localStorage.getItem('messageDetail'));
      // let mesageList = [];
      // console.log(Message);
      // mesageList.push(Message)
      // console.log(mesageList);


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
          console.log(senderName);
        });


      // Return the compiled template to the router
      update(compile(studentMessagesDetailViewTemplate)({
        name
      }));

      // let parent = document.querySelector('div.message-sender');
      // for (let i = 0; i < mesageList.length; i++) {
      //   let kid = document.createElement('p');
      //   kid.setAttribute('class', 'message-content');
      //   console.log(kid);
      //   kid.innerHTML = mesageList[i].content;
      //   parent.appendChild(kid);
      // }

      // Get room owner's name 
      const ref = database.ref('userdata/' + ownerKey);
      ref.once("value")
        .then(function (snapshot) {
          let name = snapshot.child('firstname').val() + ' ' + snapshot.child('lastname').val();
          let messageTo = document.getElementsByClassName('message-person')[0];
          messageTo.textContent = name;
        });

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