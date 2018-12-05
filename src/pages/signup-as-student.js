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
const signupAsStudentTemplate = require('../templates/signup-as-student.handlebars');

export default () => {
  // Return the compiled template to the router
  update(compile(signupAsStudentTemplate)());

  // firebase signup at buttonclick
  const btnSignupConfirm = document.getElementById('btnSignupConfirm');
  btnSignupConfirm.addEventListener('click', e => {

    // Collect the values from the form inputfields
    const firstName = document.getElementById('txtFirstNameSt').value;
    const lastName = document.getElementById('txtLastNameSt').value;
    const address = document.getElementById('txtAddressSt').value;
    const telephone = document.getElementById('txtTelSt').value;
    const email = document.getElementById('txtEmailSt').value;
    const pass = document.getElementById('txtPasswordSt').value;
    const education = document.getElementById('txtEducationSt').value;
    const userType = 'student';
    const message = document.getElementById('message');

    firebase.auth().createUserWithEmailAndPassword(email, pass).then((response) => {
      localStorage.setItem('IsSignedIn', true);
        
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

      // Get firebase reference and create a child object called adminInfo
      const database = firebase.database();
      const ref = database.ref('userdata/' + response.user.uid);
      // console.log(ref);
      // Push the object data to firebase database
      ref.update(userData);
      // console.log(ref);
      // console.log(userData);

      let user = email;
      // console.log(user);

      // sign in and navigate to homepage
      window.location.replace('/#/student-home');
    })
    .catch((e) => {
      message.innerHTML = e;
    })
    
  });
};
