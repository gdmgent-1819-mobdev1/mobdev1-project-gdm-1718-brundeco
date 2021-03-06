import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance } from '../firebase/firebase';

const firebase = getInstance();
const database = firebase.database();
// const ref = database.ref('userdata');

const loginTemplate = require('../templates/login.handlebars');

export default () => {
  update(compile(loginTemplate)());

  const btnLogin = document.getElementById('btnLogin');
  btnLogin.addEventListener('click', (e) => {
    const email = document.getElementById('txtEmail').value;
    const pass = document.getElementById('txtPassword').value;
    const message = document.getElementById('message');

    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(() => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          let currentUserUid = firebase.auth().currentUser.uid;
          localStorage.setItem('currentUserKey', currentUserUid);
          let ref = firebase.database().ref("userdata/" + currentUserUid);
          ref.once("value")
            .then(function(snapshot) {
              let userType = snapshot.child("type").val();
              let lon = snapshot.child("lon").val();
              let lat = snapshot.child("lat").val();
              localStorage.setItem('userLat', lat);
              localStorage.setItem('userLon', lon);
              localStorage.setItem('userType', userType);
              if(userType === 'admin') {
                window.location.replace('/#/admin-home');
              } else {
                window.location.replace('/#/student-listview');
              }
          });
          localStorage.setItem('currentUser', email);
        } else {
          window.location.replace('/#/');
          console.log('Something went wrong');
        }
    });
      })
      .catch(error => message.innerHTML = error)
  });
}