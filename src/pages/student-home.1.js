// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

import { getInstance } from '../firebase/firebase';
const firebase = getInstance();

// Import the template to use
const homeStudentTemplate = require('../templates/student-home.handlebars');

export default () => {
       
  let currentUser = localStorage.getItem('isSignedIn');
  
  if(currentUser === 'true') {

  // Return the compiled template to the router
  update(compile(homeStudentTemplate)());

  let target = document.querySelector('.h6-main');
  console.log(target);
  target.innerHTML = 'Welcome, ' + localStorage.getItem('currentUser');

  // firebase logout at buttonclick
  const btnLogout = document.querySelector('.btnLogout');

  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut().then(function() {
      localStorage.setItem('isSignedIn', false)
      console.log('log uit');
      window.location.replace('/#/');
    });
  });

  } else {
    window.location.replace('/#/');
    console.log('Niet gemachtigd');
  }
};
