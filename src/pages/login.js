// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

update(compile(loginTemplate));

function logData(){
  let txtEmail = document.getElementById('txtEmail').value;
  let txtPassword = document.getElementById('txtPassword').value;
  console.log(txtEmail);
  console.log(txtPassword);
}

// Import the template to use
const loginTemplate = require('../templates/login.handlebars');

export default () => {
  let btnLogin = document.getElementById('btnLogin');
  btnLogin.addEventListener('click', logData);
};





