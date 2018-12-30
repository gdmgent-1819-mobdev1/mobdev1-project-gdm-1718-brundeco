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
const adminMessagesDetailViewTemplate = require('../templates/admin-messages-detail.handlebars');

export default () => {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let currentdate = new Date();
      let datetime = currentdate.getDate() + '/' + currentdate.getMonth() + ' om ' + currentdate.getHours() + ':' + currentdate.getMinutes();
      let mesageList = [];
      let Message = JSON.parse(localStorage.getItem('messageDetail'));
      mesageList.push(Message)
      let ownerKey = localStorage.getItem('ownerKey');
      let currentUser = localStorage.getItem('currentUserKey');
      let userName = localStorage.getItem('currentUserName');
      let receiver = localStorage.getItem('senderKey');
      const database = firebase.database();

      update(compile(adminMessagesDetailViewTemplate)({
        mesageList
      }));

      let senderTitle = document.querySelector('h5.message-person');
      senderTitle.innerHTML = localStorage.getItem('senderName');

      let parent = document.querySelector('div.message-sender');
      for (let i = 0; i < mesageList.length; i++) {
        let kid = document.createElement('p');
        kid.setAttribute('class', 'message-content');
        console.log(kid);
        kid.innerHTML = mesageList[i].content;
        parent.appendChild(kid);
      }

      // Add message to database
      function addMessageToDb() {
        const messageRef = database.ref('messages/');
        let messageContent = document.querySelectorAll('input.message-type-area')[0].value;
        let Message = {
          receiver: receiver,
          senderKey: currentUser,
          senderName: userName,
          content: messageContent,
          date: datetime
        }
        messageRef.push(Message);
        window.location.replace('#/admin-home');
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
    }
  })
};