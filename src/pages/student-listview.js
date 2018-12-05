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
const studentListViewTemplate = require('../templates/student-listview.handlebars');

export default () => {

  let currentUser = localStorage.getItem('isSignedIn');
  if (currentUser === 'true') {
 // Return the compiled template to the router
 update(compile(studentListViewTemplate)());

// firebase logout at buttonclick
const btnLogout = document.querySelector('.btnLogout');

btnLogout.addEventListener('click', e => {
  firebase.auth().signOut().then(function () {
    console.log('log uit');
    window.location.replace('/#/');
  });
});


// - - - - - - - - -  - - - - - - - - - - - - - - - - - - -- - - - - - - - - - - - - - - - - - - -- 

const database = firebase.database();
const ref = database.ref('roomdata');

ref.on("value", function(data) {
  let rooms = data.val();
  let keys = Object.keys(rooms);

  for(let i = 0; i < keys.length; i++) {

    let k = keys[i];
    let Room = {
      rentalPrice: rooms[k].rentalPrice,
      warrant: rooms[k].warrant,
      type: rooms[k].type,
      surface: rooms[k].surface + ' sq m',
      floors: rooms[k].floors,
      numberOfPersons: rooms[k].numberOfPersons,
      toilet: rooms[k].toilet,
      douche: rooms[k].douche,
      bath: rooms[k].bath,
      kitchen: rooms[k].kitchen,
      furnished: rooms[k].furnished,
      address: rooms[k].address
    }
    console.log(Room);
      let parent = document.querySelector('.just-a-box');

      let mainBox = document.createElement('div');
      mainBox.setAttribute('class', 'info-list')

      let childBox1 = document.createElement('div');
      childBox1.setAttribute('class', 'info-list-image');
      let childBox2 = document.createElement('div');
      childBox2.setAttribute('class', 'info-list-text');

      let type = document.createElement('h5');
      let address = document.createElement('h6');
      let surface = document.createElement('p');

      parent.appendChild(mainBox);
      mainBox.appendChild(childBox1);
      mainBox.appendChild(childBox2);
      childBox2.appendChild(type);
      childBox2.appendChild(address);
      childBox2.appendChild(surface);

      childBox1.style.width = '100px';
      childBox1.style.height = '100px';
      childBox1.style.backgroundColor = 'green';
      type.textContent = Room.type
      address.textContent = Room.address
      surface.textContent = Room.surface
  }
  
}, function (errorObject) {
console.log("The read failed: " + errorObject.code);
});

// - - - - - - - - -  - - - - - - - - - - - - - - - - - - -- - - - - - - - - - - - - - - - - - - -- 

  } else {
    window.location.replace('/#/');
    console.log('Niet gemachtigd');
  }
}