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
const studentMessagesViewTemplate = require('../templates/student-messages.handlebars');
export default () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const userType = localStorage.getItem('userType');
      if (userType == 'student') {
        let currentUserKey = localStorage.getItem('currentUserKey');
        const database = firebase.database();
        const ref = database.ref('messages/').orderByChild('receiver').equalTo(currentUserKey);
        let messageList = [];
        let messageKeys = [];
        let clickedMessage;
        let Message;
        let index;

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
          newMessage();
        });

        function newMessage() {
          const text = 'U heeft een bericht ';
          if (!("Notification" in window)) {
            alert("This browser does not support system notifications");
          } else if (Notification.permission === "granted") {
            let notification = new Notification("Melding", {
              body: text
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
              if (permission === "granted") {
                let notification = new Notification("Melding", {
                  body: text
                });
              }
            });
          }
        }

        ref.on("value", function (snap) {
          let messages = snap.val();
          let keys = Object.keys(messages);
          messageKeys.push(keys);
        });

        function showDetail() {
          index = this.id.substr(13);
          let messageDetail = messageList[index];
          clickedMessage = messageKeys[0][index];
          let senderName = messageList[index].sender;
          let senderKey = messageList[index].senderKey;
          localStorage.setItem('messageDetail', JSON.stringify(messageDetail));
          localStorage.setItem('messageKey', clickedMessage);
          localStorage.setItem('senderName', senderName);
          localStorage.setItem('senderKey', senderKey);
          window.location.replace('#/student-messages-detail');
        };

        setTimeout(() => {
          // Return the compiled template to the router
          update(compile(studentMessagesViewTemplate)({
            messageList
          }));

          let activeIcon = document.querySelector('.third-image');
          activeIcon.style.backgroundImage = 'url("src/images/messagesFullActive.svg")';

          let messageDetail = document.querySelectorAll('.messages-list');
          for (let i = 0; i < messageDetail.length; i++) {
            messageDetail[i].id = "messageDetail" + i;
            messageDetail[i].addEventListener('click', showDetail);
          };
          // firebase logout at buttonclick
          const btnLogout = document.querySelector('.btnLogout');
          btnLogout.addEventListener('click', e => {
            firebase.auth().signOut().then(function () {
              window.location.replace('#/');
            });
          });
        }, 1000);

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