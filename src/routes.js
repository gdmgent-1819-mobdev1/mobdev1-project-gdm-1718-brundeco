// Pages
import LoginView from './pages/login';
import SignupAsView from './pages/signup-as';
import FirebaseView from './pages/firebase-example';
import MapboxView from './pages/mapbox-example';

export default [
  { path: '/', view: LoginView },
  { path: '/signup-as', view: SignupAsView },
  { path: '/firebase', view: FirebaseView },
  { path: '/mapbox', view: MapboxView },
];
