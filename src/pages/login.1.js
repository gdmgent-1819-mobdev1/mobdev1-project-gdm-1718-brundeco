import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance } from '../firebase/firebase';

const firebase = getInstance();
const database = firebase.database();
// const ref = database.ref('userdata');

const loginTemplate = require('../templates/login.handlebars');

const login = (email, pass) => {
  const message = document.getElementById('message');
  firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(() => {

      let currentUserUid = firebase.auth().currentUser.uid;
      let ref = firebase.database().ref("userdata/" + currentUserUid);
      
      ref.once("value")
        .then(function(snapshot) {
          let userType = snapshot.child("type").val();

          if(userType === 'admin') {
            window.location.replace('/#/admin-home');
          } else {
            window.location.replace('/#/student-home');
          }
      });
      
      localStorage.setItem('isSignedIn', true);
      localStorage.setItem('currentUser', email);

    })
    .catch(error => message.innerHTML = error)
};

export default () => {
  update(compile(loginTemplate)());

  const btnLogin = document.getElementById('btnLogin');

  btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('txtEmail').value;
    const password = document.getElementById('txtPassword').value;
    const uid = 'auhsdiuhsd';
    login(email, password);
  });
};