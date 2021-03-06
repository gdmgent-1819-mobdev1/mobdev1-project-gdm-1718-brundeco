import {
  compile
} from 'handlebars';
import update from '../helpers/update';

import {
  getInstance
} from '../firebase/firebase';
const firebase = getInstance();

// Import the template to use
const signupAsAdminTemplate = require('../templates/signup-as-admin.handlebars');

export default () => {
  // Return the compiled template to the router
  update(compile(signupAsAdminTemplate)());

  const btnSignupConfirm = document.getElementById('btnSignupConfirm');
  btnSignupConfirm.addEventListener('click', authorize);

  function authorize(e) {
    e.preventDefault();
    // Collect the values from the form inputfields
    const firstName = document.getElementById('txtFirstNameAd').value;
    const lastName = document.getElementById('txtLastNameAd').value;
    const address = document.getElementById('txtAddressAd').value;
    const telephone = document.getElementById('txtTelAd').value;
    const email = document.getElementById('txtEmailAd').value;
    const pass = document.getElementById('txtPasswordAd').value;

    const message = document.getElementById('message');

    firebase.auth().createUserWithEmailAndPassword(email, pass)
      .then((response) => {
        const userType = 'admin';
        localStorage.setItem('userType', userType);
        const email = document.getElementById('txtEmailAd').value;
        localStorage.setItem('currentUser', email);
        let currentUserUid = firebase.auth().currentUser.uid;
        localStorage.setItem('currentUserKey', currentUserUid);
        localStorage.setItem('currentUserName', firstName + ' ' + lastName);

        let userData = {
          firstname: firstName,
          lastname: lastName,
          address: address,
          telephone: telephone,
          email: email,
          type: userType
        }
        // Get firebase reference and create a child object
        const database = firebase.database();
        const ref = database.ref('userdata/' + response.user.uid);
        // Push the object data to firebase database
        ref.update(userData);
        // sign in and navigate to homepage
        window.location.href = '/#/admin-home';;
      })
      .catch((e) => {
        message.innerHTML = e;
        console.log('Fout');
      })
  }

}