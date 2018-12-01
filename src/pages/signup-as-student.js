// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

import { getInstance } from '../firebase/firebase';
const firebase = getInstance();

// Import the template to use
const signupAsStudentTemplate = require('../templates/signup-as-student.handlebars');

export default () => {
  // Return the compiled template to the router
  update(compile(signupAsStudentTemplate)());

  // firebase signup at buttonclick
  const btnSignupConfirm = document.getElementById('btnSignupConfirm');
  btnSignupConfirm.addEventListener('click', e => {

    // Get firebase reference and create a child object called studentInfo
    const database = firebase.database();
    const ref = database.ref('userdata');
    console.log(ref);

    // Collect the values from the form inputfields
    const firstName = document.getElementById('txtFirstNameSt').value;
    const lastName = document.getElementById('txtLastNameSt').value;
    const address = document.getElementById('txtAddressSt').value;
    const telephone = document.getElementById('txtTelSt').value;
    const email = document.getElementById('txtEmailSt').value;
    const pass = document.getElementById('txtPasswordSt').value;
    const education = document.getElementById('txtEducationSt').value;
    const userType = 'student';
    const auth = firebase.auth();
    const message = document.getElementById('message');

    // Put form data in a userdata oject
    let userData = {
      firstname: firstName,
      lastname: lastName,
      address: address,
      telephone: telephone,
      email: email,
      education: education,
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
      window.location.replace('/#/student-home');
    })
    promise.catch(error => message.innerHTML = error );
  });
};
