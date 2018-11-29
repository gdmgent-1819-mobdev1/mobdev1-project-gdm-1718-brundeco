// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const signupAsTemplate = require('../templates/signup-as.handlebars');

export default () => {

  update(compile(signupAsTemplate)());

  let btnSignupAsStudent = document.getElementById('btnSignupAsStudent');
  let btnSignupAsAdmin = document.getElementById('btnSignupAsAdmin');

  btnSignupAsStudent.addEventListener('click', () => {
    window.location.replace('/#/signup-as-student');
    console.log('student wants to log in');
  })

  btnSignupAsAdmin.addEventListener('click', ()  => {
    window.location.replace('/#/signup-as-admin');
    console.log('kotbaas wants to log in');
  })
  // Return the compiled template to the router
};
