// Pages
import LoginView from './pages/login';
import PasswordResetView from './pages/password-reset';
import SignupAsView from './pages/signup-as';
import SignupAsStudentView from './pages/signup-as-student';
import SignupAsAdminView from './pages/signup-as-admin';
import FirebaseView from './pages/firebase-example';
import MapboxView from './pages/mapbox-example';

export default [
  { path: '/', view: LoginView },
  { path: '/signup-as', view: SignupAsView },
  { path: '/password-reset', view: PasswordResetView },
  { path: '/signup-as-student', view: SignupAsStudentView },
  { path: '/signup-as-admin', view: SignupAsAdminView },
  { path: '/firebase', view: FirebaseView },
  { path: '/mapbox', view: MapboxView },
];
