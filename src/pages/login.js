import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance } from '../firebase/firebase';

const firebase = getInstance();
const loginTemplate = require('../templates/login.handlebars');

const login = (email, pass) => {
  const message = document.getElementById('message');
  firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(() => window.location.replace('/#/student-home'))
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