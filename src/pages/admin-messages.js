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

      let currentUserKey = localStorage.getItem('currentUserKey');
      const database = firebase.database();
      const ref = database.ref('messages/').orderByChild('receiver').equalTo(currentUserKey);
      let messageList = [];
      let messageKeys = [];
      let clickedMessage;
      let Message;
      let index;

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
              senderKey: data.senderKey,
              receiver: currentUserKey,
              date: data.date
            }
          }
          messageList.push(Message);
          // console.log(messageList);
        });
      });

      const detailRef = database.ref('messages/');
      ref.on("value", function (snap) {
        let messages = snap.val();
        let keys = Object.keys(messages);
        messageKeys.push(keys);
        // console.log(messageKeys);
      });
      // console.log(messageList);

      console.log(messageList[0].sender)


      function showDetail() {
        index = this.id.substr(13);
        let messageDetail = messageList[index];
        clickedMessage = messageKeys[0][index];
        let senderName =  messageList[index].sender;
        let senderKey =  messageList[index].senderKey;
        localStorage.setItem('messageDetail', JSON.stringify(messageDetail));
        localStorage.setItem('messageKey', clickedMessage);
        localStorage.setItem('senderName', senderName);
        localStorage.setItem('senderKey', senderKey);
        window.location.replace('#/admin-messages-detail');
      };

      // Return the compiled template to the router
      update(compile(adminMessagesViewTemplate)({
        messageList
      }));

      let messageDetail = document.querySelectorAll('.messages-list');
      for (let i = 0; i < messageDetail.length; i++) {
        messageDetail[i].id = "messageDetail" + i;
        messageDetail[i].addEventListener('click', showDetail);
      };

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