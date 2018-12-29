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

  const btnSignupConfirm = document.getElementById('btnSignupConfirm');
  btnSignupConfirm.addEventListener('click', authorize);

  function authorize(e) {
    e.preventDefault();

    // Collect the values from the form inputfields
    const firstName = document.getElementById('txtFirstNameSt').value;
    const lastName = document.getElementById('txtLastNameSt').value;
    const address = document.getElementById('txtAddressSt').value;
    const telephone = document.getElementById('txtTelSt').value;
    const email = document.getElementById('txtEmailSt').value;
    const pass = document.getElementById('txtPasswordSt').value;
    const userType = 'student';
    const message = document.getElementById('message');
    const select = document.getElementById('txtCampusSt');
    const campus = parseInt(select.options[select.selectedIndex].value);
    let lat;
    let lon;

    switch(campus) {
      case 1:
        lat = 51.087550;
        lon = 3.670820;
        break;
      case 2:
        lat = 51.055510;
        lon = 3.723390;
        break;
      case 3:
        lat = 51.040970;
        lon = 3.728000;
        break;
      case 4:
        lat = 51.059940;
        lon = 3.727950;
        break;
      default:
        lat = 'No lat';
        lon = 'No lon';
    }

    localStorage.setItem('userLat', lat);
    localStorage.setItem('userLon', lon);

    firebase.auth().createUserWithEmailAndPassword(email, pass)
    .then((response) => {

      const email = document.getElementById('txtEmailSt').value;
      localStorage.setItem('currentUser', email);
      let currentUserUid = firebase.auth().currentUser.uid;
      localStorage.setItem('currentUserKey', currentUserUid); 

      let userData = {
        firstname: firstName,
        lastname: lastName,
        address: address,
        telephone: telephone,
        email: email,
        campus: campus,
        type: userType,
        lat: lat,
        lon: lon
      }

      const database = firebase.database();
      const ref = database.ref('userdata/' + response.user.uid);
      
      // Push the object data to firebase database
      ref.update(userData);
      // sign in and navigate to homepage
      window.location.replace('#/student-listview');
    })
    .catch((e) => {
      message.innerHTML = e;
      console.log('Fout');
    })
  }

}