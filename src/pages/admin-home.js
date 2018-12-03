// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

import { getInstance } from '../firebase/firebase';
const firebase = getInstance();

// Import the template to use
const homeAdminTemplate = require('../templates/admin-home.handlebars');

export default () => {
  // Return the compiled template to the router
  update(compile(homeAdminTemplate)());

    // firebase logout at buttonclick
    const btnLogout = document.querySelector('.btnLogout');
    const addRoomSubmit = document.getElementById('add-room-submit');

    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut().then(function() {
        console.log('log uit');
        window.location.replace('/#/');
      });
    });

    // function logData() {
    //   let rentalPrice = document.getElementById("rentalPrice").value;
    //   let warrant = document.getElementById("warrant").value;
    //   let surface = document.getElementById("surface").value;
    //   let address = document.getElementById("address").value;
    //   let rentalPrice = document.getElementById("rentalPrice");
    //   let rentalPrice = document.getElementById("rentalPrice");
    //   let rentalPrice = document.getElementById("rentalPrice");
    //   let rentalPrice = document.getElementById("rentalPrice");
    //   let rentalPrice = document.getElementById("rentalPrice");

    //   let value = e.options[e.selectedIndex].value;
    //   console.log(value);
    // }
    
    // addRoomSubmit.addEventListener('click', logData);

};
