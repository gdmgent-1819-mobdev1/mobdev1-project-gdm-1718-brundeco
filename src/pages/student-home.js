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
const homeStudentTemplate = require('../templates/student-home.handlebars');

export default () => {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // Return the compiled template to the router
      update(compile(homeStudentTemplate)());
      // console.log('We have a user');

      let allRooms = [];
      let indexCurrentRoom = 0;
      let currentRoom;

      let target = document.querySelector('.h6-main');
      // console.log(target);
      target.innerHTML = 'Welcome, ' + localStorage.getItem('currentUser');

      const database = firebase.database();
      const ref = database.ref('roomdata/');

      ref.on('value', (snapshot) => {
        snapshot.forEach(function (childSnapshot) {
          let rooms = childSnapshot.val();
          console.log(rooms);
          allRooms.push(rooms);
        })
        returnRoom(indexCurrentRoom);
      })

      function likeRoom() {
        indexCurrentRoom++;
        returnRoom(indexCurrentRoom);
      }

      function returnRoom() {
        currentRoom = allRooms[indexCurrentRoom];

        let box = document.getElementsByClassName('just-a-box')[0];

        box.innerHTML = '';
        let toggleListview = document.createElement('a');
        toggleListview.setAttribute('class', 'fixed-anchor');
        toggleListview.innerHTML = 'toggle list';
        toggleListview.href = '/student-listview';
  
        let mainTitle = document.createElement('h2');
        mainTitle.innerHTML = 'Beschikbare kamers';
  
        let infoBlock = document.createElement('div');
        infoBlock.setAttribute('class', 'info-block');
  
        let roomImage = document.createElement('img');
        roomImage.setAttribute('class', 'room-picture');
        roomImage.src = 'src/images/kot-1.png';
  
        let roomType = document.createElement('h5');
        roomType.setAttribute('class', 'h5-room-type');
        roomType.innerHTML = currentRoom.type;
  
        let roomAddress = document.createElement('h6');
        roomAddress.setAttribute('class', 'h6-address');
        roomAddress.innerHTML = currentRoom.address;
  
        let roomSurface = document.createElement('p');
        roomSurface.innerHTML = currentRoom.surface;
  
        let judgeBlock = document.createElement('div');
        judgeBlock.setAttribute('class', 'judge-block');
  
        let likeButton = document.createElement('button');
        likeButton.setAttribute('class', 'judge-icons');
        likeButton.innerHTML = 'LIKE';
  
        let skipButton = document.createElement('button');
        skipButton.setAttribute('class', 'judge-icons');
        skipButton.innerHTML = 'SKIP';
  
        box.appendChild(toggleListview);
        box.appendChild(mainTitle);
        box.appendChild(infoBlock);
        box.appendChild(judgeBlock);
  
        infoBlock.appendChild(roomImage);
        infoBlock.appendChild(roomType);
        infoBlock.appendChild(roomAddress);
        infoBlock.appendChild(roomSurface);
  
        judgeBlock.appendChild(likeButton);
        judgeBlock.appendChild(skipButton);
  
        likeButton.addEventListener('click', likeRoom);
      }



    } else {
      window.location.replace('/#/');
      console.log('Something went wrong');
    }

    //firebase logout at buttonclick
    const btnLogout = document.querySelector('.btnLogout');
    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut().then(function () {
        localStorage.setItem('isSignedIn', false)
        console.log('log uit');
        window.location.replace('/#/');
      });
    });
  });



}