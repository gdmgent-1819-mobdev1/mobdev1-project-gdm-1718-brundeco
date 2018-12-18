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
 // Return the compiled template to the router
 update(compile(studentListViewTemplate)());

 let toggleMapview = document.getElementById('toggleMapView');
 toggleMapview.addEventListener('click', function() {
   window.location.replace('/#/student-mapview');
 })

const database = firebase.database();
const ref = database.ref('roomdata');

ref.on("value", function(data) {
  let rooms = data.val();
  let keys = Object.keys(rooms);
  console.log(keys);

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
      address: rooms[k].address,
      key: rooms[k]
    }
    
    console.log(Room);
      let parent = document.querySelector('.just-a-box-lv');
      console.log(parent);

      let mainBox = document.createElement('div');
      mainBox.setAttribute('class', 'info-list');

      let childBox1 = document.createElement('div');
      childBox1.setAttribute('class', 'info-list-img');

      let image = document.createElement('img');
      image.setAttribute('class', 'room-picture-list');

      let childBox2 = document.createElement('div');
      childBox2.setAttribute('class', 'info-list-text');

      let type = document.createElement('h5');
      let address = document.createElement('h6');
      let surface = document.createElement('p');
      let price = document.createElement('p');

      let btnAddToFavorites = document.createElement('button');
      btnAddToFavorites.innerHTML = 'like this room';

      type.setAttribute('class', 'card-room-type-lv');
      address.setAttribute('class', 'card-address-lv');
      surface.setAttribute('class', 'card-surface-lv');
      price.setAttribute('class', 'card-price-lv');

      parent.appendChild(mainBox);
      mainBox.appendChild(childBox1);
      childBox1.appendChild(image);
      mainBox.appendChild(childBox2);
      childBox2.appendChild(type);
      childBox2.appendChild(address);
      childBox2.appendChild(surface);
      childBox2.appendChild(price);
      childBox2.appendChild(btnAddToFavorites);

      type.textContent = Room.type;
      address.textContent = Room.address;
      surface.textContent = Room.surface;
      price.textContent = Room.price;

      function addRoomToFavorites() {
        const database = firebase.database();
        const ref = database.ref('favorites');
        console.log(btnAddToFavorites);
        ref.push(Room.key);
      }
    
      btnAddToFavorites.addEventListener('click', addRoomToFavorites);
      
  }

}, function (errorObject) {
console.log("The read failed: " + errorObject.code);
});

    // firebase logout at buttonclick
    const btnLogout = document.querySelector('.btnLogout');
    console.log(btnLogout);
    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut().then(function () {
        console.log('log uit');
        window.location.replace('/#/');
      });
    });

// - - - - - - - - -  - - - - - - - - - - - - - - - - - - -- - - - - - - - - - - - - - - - - - - -- 

}