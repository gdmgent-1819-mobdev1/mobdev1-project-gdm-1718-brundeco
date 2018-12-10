// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

import { getInstance } from '../firebase/firebase';
const firebase = getInstance();

// Import the template to use
const homeAdminTemplate = require('../templates/admin-home.handlebars');

export default () => {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Return the compiled template to the router
      update(compile(homeAdminTemplate)());
      console.log('We have a user');

      let target = document.querySelector('.h6-main');
      console.log(target);
      target.innerHTML = 'Welcome, ' + localStorage.getItem('currentUser');
      
    } else {
      window.location.replace('/#/');
      console.log('Something went wrong');
    }

    //firebase logout at buttonclick
    const btnLogout = document.querySelector('.btnLogout');
    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut().then(function() {
        localStorage.setItem('isSignedIn', false)
        console.log('log uit');
        window.location.replace('/#/');
      });
    });
  });



}