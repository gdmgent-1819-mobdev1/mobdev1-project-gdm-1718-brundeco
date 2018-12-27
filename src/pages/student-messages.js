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
      // Return the compiled template to the router
      update(compile(studentMessagesViewTemplate)({
        name
      }));


        // firebase logout at buttonclick
        const btnLogout = document.querySelector('.btnLogout');
        btnLogout.addEventListener('click', e => {
          firebase.auth().signOut().then(function () {
            window.location.replace('#/');
          });
        });
      console.log('User check')

    } else {
      console.log('No valid user!')
    }
  });
};