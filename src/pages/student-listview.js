// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

import { getInstance } from '../firebase/firebase';
const firebase = getInstance();

// Import the template to use
const studentListViewTemplate = require('../templates/student-listview.handlebars');

export default () => {
 // Return the compiled template to the router
 update(compile(studentListViewTemplate)({ name }));

// firebase logout at buttonclick
const btnLogout = document.querySelector('.btnLogout');

btnLogout.addEventListener('click', e => {
  firebase.auth().signOut().then(function() {
    console.log('log uit');
    window.location.replace('/#/');
  });
});

 fetch('https://datatank.stad.gent/4/wonen/kotatgent.json')
 .then(function(response) {
   return response.json();
 })
 .then(function(studentRooms) {

  for(let i = 0; i < studentRooms.length; i++) {

    let Room = {
      rentalPrice: studentRooms[i].Huurprijs,
      warrant: studentRooms[i].Waarborg,
      type: studentRooms[i].Type,
      surface: studentRooms[i].Oppervlakte + ' sq m',
      floor: studentRooms[i].Verdieping,
      numberOfPersons: '3 personen',
      toilet: studentRooms[i]["Privé toilet"],
      douche: studentRooms[i]["Privé douche"],
      bath: 'Niet terug te vinden in JSON data',
      kitchen: studentRooms[i]["Privé keuken"],
      furnished: studentRooms[i].Opties,
      photos: 'Niets om weer te geven',
      address: studentRooms[i].Straat + ' ' + studentRooms[i].Huisummer + ', ' + studentRooms[i].Plaats 
    }

    let parent = document.querySelector('.just-a-box');

    let mainBox = document.createElement('div');
    mainBox.setAttribute('class','info-list')
    console.log(mainBox);

    let childBox = document.createElement('div');
    childBox.setAttribute('class', 'info-list-text');
    console.log(childBox);

    let type = document.createElement('h5');
    let address = document.createElement('h6');
    let surface = document.createElement('p');

    parent.appendChild(mainBox);
    mainBox.appendChild(childBox);
    childBox.appendChild(type);
    childBox.appendChild(address);
    childBox.appendChild(surface);

    type.textContent = Room.type
    address.textContent = Room.address
    surface.textContent = Room.surface

    console.log(type);
    console.log(address);
    console.log(surface);

  }
 });

}
