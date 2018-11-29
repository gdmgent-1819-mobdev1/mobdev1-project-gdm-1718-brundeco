// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

import { getInstance } from '../firebase/firebase';
const firebase = getInstance();

// Import the template to use
const signupAsAdminTemplate = require('../templates/signup-as-admin.handlebars');

  // send email to registered address to complete sign up
  function sendMeAnEmailPlease(email) {
    email.sendEmailVerification()
        .then(function() {
            console.log('Email verification link sent');
        })
        .catch(function(error) {
            console.log(error);
        });
    }

  // send register notification 
  function registerSuccessful() {
    const email = document.getElementById('txtEmailAd').value;
    const text = 'You are now registered with ' + email;
    if (!("Notification" in window)) {
      alert("This browser does not support system notifications");
    }
    else if (Notification.permission === "granted") {
      let notification = new Notification("Welcome!", {body: text});
    }
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          let notification = new Notification("Welcome!", {body: text});
        }
      });
    }
  }

export default () => {
  // Return the compiled template to the router
  update(compile(signupAsAdminTemplate)());

  const btnSignupConfirm = document.getElementById('btnSignupConfirm');
  // firebase signup at buttonclick
  btnSignupConfirm.addEventListener('click', e => {
    const message = document.getElementById('message');
    const email = txtEmailAd.value;
    const pass = txtPasswordAd.value;
    const auth = firebase.auth();

    let user = email;
    console.log(user)

    const promise = auth.createUserWithEmailAndPassword(email, pass)
    promise.then(e => {
      // sign in and navigate to homepage
      window.location.replace('/#/admin-home');
      // send email verification link
      sendMeAnEmailPlease(e.user);
      // call registerSuccessful to display notification
      registerSuccessful();
    })
    promise.catch(error => message.innerHTML = error );
  });
};
