const firebaseInstance = require('firebase');

// Initialize Firebase
// TODO: Replace with your project's config
const config = {
  apiKey: "AIzaSyDYqao9LCkF6oXszrykeOV4oxtoTuUvuwM",
  authDomain: "op-kot-in-gent.firebaseapp.com",
  databaseURL: "https://op-kot-in-gent.firebaseio.com",
  projectId: "op-kot-in-gent",
  storageBucket: "op-kot-in-gent.appspot.com",
  messagingSenderId: "333922770361"
};

let instance = null;

const initFirebase = () => {
  instance = firebaseInstance.initializeApp(config);
};

const getInstance = () => {
  if (!instance) {
    initFirebase();
  }
  return instance;
};
export {
  initFirebase,
  getInstance,
};
