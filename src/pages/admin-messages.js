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
  // Data to be passed to the template

  // Return the compiled template to the router
  update(compile(adminMessagesDetailViewTemplate)({
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


};