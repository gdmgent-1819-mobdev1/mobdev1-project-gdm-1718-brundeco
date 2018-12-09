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
const homeAdminTemplate = require('../templates/admin-home.handlebars');

export default () => {

  let currentUser = localStorage.getItem('isSignedIn');
  if (currentUser === 'true') {
    // Return the compiled template to the router
    update(compile(homeAdminTemplate)());

    let target = document.querySelector('.h6-main');
    console.log(target);
    target.innerHTML = 'Welcome, ' + localStorage.getItem('currentUser');

    // firebase logout at buttonclick
    const btnLogout = document.querySelector('.btnLogout');
    const addRoomSubmit = document.getElementById('add-room-submit');

    // Get firebase reference and create a child object called adminInfo
    const database = firebase.database();
    const ref = database.ref('roomdata');

    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut().then(function () {
        localStorage.setItem('isSignedIn', false);
        console.log('log uit');
        window.location.replace('/#/');
      });
    });

    addRoomSubmit.addEventListener('click', e => {
      let rentalPrice = document.getElementById("rentalPrice").value;
      let warrant = document.getElementById("warrant").value;
      let surface = document.getElementById("surface").value;
      let address = document.getElementById("address").value;
      let type = document.getElementById("roomType").value;
      let floors = document.getElementById("floors").value;
      let numberOfPersons = document.getElementById("numberOfPersons").value;
      let toilet = document.getElementById("toilet").value;
      let douche = document.getElementById("douche").value;
      let bath = document.getElementById("bath").value;
      let kitchen = document.getElementById("kitchen").value;
      let furnished = document.getElementById("furnished").value;

      let Room = {
        type: type,
        rentalPrice: rentalPrice,
        warrant: warrant,
        surface: surface,
        address: address,
        floors: floors,
        numberOfPersons: numberOfPersons,
        toilet: toilet,
        douche: douche,
        bath: bath,
        kitchen: kitchen,
        furnished: furnished,
      }

      // Push the object data to firebase database
      ref.push(Room);

      ref.on("value", function () {
        const text = 'Your room has been added';
        if (!("Notification" in window)) {
          alert("This browser does not support system notifications");
        } else if (Notification.permission === "granted") {
          let notification = new Notification("Done!", {
            body: text
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission(function (permission) {
            if (permission === "granted") {
              let notification = new Notification("Done!", {
                body: text
              });
            }
          });
        }
      });
    });
  } else {
    window.location.replace('/#/');
    console.log('Niet gemachtigd');
  }
};