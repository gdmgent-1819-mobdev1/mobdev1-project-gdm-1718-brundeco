import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance } from '../firebase/firebase';

const firebase = getInstance();
const loginTemplate = require('../templates/login.handlebars');

function loginSuccessful() {
  const email = document.getElementById('txtEmail').value;
  const text = 'You are now logged in with ' + email;
  if (!("Notification" in window)) {
    alert("This browser does not support system notifications");
  }
  else if (Notification.permission === "granted") {
    let notification = new Notification("Welcome", {body: text});
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        let notification = new Notification("Welcome", {body: text});
      }
    });
  }
}

const login = (email, pass) => {
  const message = document.getElementById('message');
  firebase.auth().signInWithEmailAndPassword(email, pass)
    .then
    (() => window.location.replace('/#/student-home'))
    loginSuccessful()
    .catch(error => message.innerHTML = error)
};

export default () => {
  update(compile(loginTemplate)());

  const btnLogin = document.getElementById('btnLogin');

  btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('txtEmail').value;
    const password = document.getElementById('txtPassword').value;
    login(email, password);
  });
};