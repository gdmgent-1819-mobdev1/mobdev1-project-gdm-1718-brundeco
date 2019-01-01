// Pages
import LoginView from './pages/login';
import PasswordResetView from './pages/password-reset';
import SignupAsView from './pages/signup-as';
import SignupAsStudentView from './pages/signup-as-student';
import SignupAsAdminView from './pages/signup-as-admin';

import StudentHomeView from './pages/student-home';
import StudentListView from './pages/student-listview';
import StudentListSortedView from './pages/student-listview-sorted';
import StudentDetailView from './pages/student-detailview';
import StudentMessagesView from './pages/student-messages';
import StudentMessagesDetailView from './pages/student-messages-detail';
import StudentMapView from './pages/student-mapview';
import StudentFavoritesView from './pages/student-favorites';

import AdminHomeView from './pages/admin-home';
import AdminListView from './pages/admin-listview';
import AdminDetailView from './pages/admin-detailview';
import AdminMessagesView from './pages/admin-messages';
import AdminMessagesDetailView from './pages/admin-messages-detail';

export default [
  { path: '/', view: LoginView },
  { path: '/signup-as', view: SignupAsView },
  { path: '/password-reset', view: PasswordResetView },
  { path: '/signup-as-student', view: SignupAsStudentView },
  { path: '/signup-as-admin', view: SignupAsAdminView },

  { path: '/student-home', view: StudentHomeView },
  { path: '/student-listview', view: StudentListView },
  { path: '/student-listview-sorted', view: StudentListSortedView },
  { path: '/student-detailview', view: StudentDetailView },
  { path: '/student-messages', view: StudentMessagesView },
  { path: '/student-messages-detail', view: StudentMessagesDetailView },
  { path: '/student-mapview', view: StudentMapView },
  { path: '/student-favorites', view: StudentFavoritesView },
  
  { path: '/admin-home', view: AdminHomeView },
  { path: '/admin-listview', view: AdminListView },
  { path: '/admin-detailview', view: AdminDetailView },
  { path: '/admin-messages', view: AdminMessagesView },
  { path: '/admin-messages-detail', view: AdminMessagesDetailView },

];
