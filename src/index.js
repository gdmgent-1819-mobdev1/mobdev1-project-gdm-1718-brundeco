import Navigo from 'navigo';
import handlebars, { compile } from 'handlebars';
import './materialize.js';
import './css/vendors/materialize.css';
import './css/vendors/animate.css';
import './styles/abstracts/colors.scss';
import './styles/main.scss';
import './styles/components/header.scss';
import './styles/components/footer.scss';
import './styles/components/buttons.scss';
import routes from './routes';

// Partials
const header = require('./partials/header.handlebars');
const footer = require('./partials/footer.handlebars');
const footerAdmin = require('./partials/footer-admin.handlebars');

// Register the partial components
handlebars.registerPartial('header', compile(header)({ title: 'Just another web app' }));
handlebars.registerPartial('footer', compile(footer)({ text: 'Template made with love by GDM Ghent' }));
handlebars.registerPartial('footer-admin', compile(footerAdmin)({ text: 'Template made with love by GDM Ghent' }));

// Router logic to load the correct template when needed
const router = new Navigo(window.location.origin, true);

routes.forEach((route) => {
  router.on(route.path, () => {
    route.view();
    router.updatePageLinks();
  });
});

// This catches all non-existing routes and redirects back to the home
router.notFound(() => {
  router.navigate('/');
});
router.resolve();
window.onload = () => {
  // router.navigate(window.location.hash.split('/')[1]);
};
