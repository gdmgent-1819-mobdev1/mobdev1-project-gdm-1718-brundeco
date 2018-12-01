// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

import { getInstance } from '../firebase/firebase';
const firebase = getInstance();

// Import the template to use
const passwordResetTemplate = require('../templates/password-reset.handlebars');

export default () => {
 // Return the compiled template to the router
 update(compile(passwordResetTemplate)({ name })); 

//password reset
document.getElementById('btnPasswordReset').addEventListener('click', function(e){
  // e.preventDefault();
  let auth = firebase.auth();
  const email = txtEmail.value;

  auth.sendPasswordResetEmail(email).then(function() {
    // email sent
      message.innerHTML = 'An email with a link to reset your password has been sent.';
  }).catch(function(error) {
    // Something went wrong
    message.innerHTML = 'A recovery link could not be send to this email address';
  });
});
};


