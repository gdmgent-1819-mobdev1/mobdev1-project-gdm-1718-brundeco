// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

import { getInstance } from '../firebase/firebase';
const firebase = getInstance();

// Import the template to use
const signupAsAdminTemplate = require('../templates/signup-as-admin.handlebars');

export default () => {
  // Return the compiled template to the router
  update(compile(signupAsAdminTemplate)());

  // firebase signup at buttonclick
  const btnSignupConfirm = document.getElementById('btnSignupConfirm');
  btnSignupConfirm.addEventListener('click', e => {

    // Get firebase reference and create a child object called adminInfo
    const database = firebase.database();
    const ref = database.ref('userdata');
    console.log(ref);

    // Collect the values from the form inputfields
    const firstName = document.getElementById('txtFirstNameAd').value;
    const lastName = document.getElementById('txtLastNameAd').value;
    const address = document.getElementById('txtAddressAd').value;
    const telephone = document.getElementById('txtTelAd').value;
    const email = document.getElementById('txtEmailAd').value;
    const pass = document.getElementById('txtPasswordAd').value;
    const userType = 'admin';
    const auth = firebase.auth();
    const message = document.getElementById('message');

    // Put form data in a userdata oject
    let userData = {
      firstname: firstName,
      lastname: lastName,
      address: address,
      telephone: telephone,
      email: email,
      type: userType
  }

    // Push the object data to firebase database
    ref.push(userData);
    console.log(ref);
    console.log(userData);

    let user = email;
    console.log(user);

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
