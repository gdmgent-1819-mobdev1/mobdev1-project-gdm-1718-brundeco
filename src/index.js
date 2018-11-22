import Navigo from 'navigo';
import handlebars, { compile } from 'handlebars';
import './styles/abstracts/colors.scss';
import './styles/main.scss';
import './styles/header.scss';
import './styles/footer.scss';
import './styles/buttons.scss';
import routes from './routes';

// Partials
const header = require('./partials/header.handlebars');
const footer = require('./partials/footer.handlebars');

// Register the partial components
handlebars.registerPartial('header', compile(header)({ title: 'Just another web app' }));
handlebars.registerPartial('footer', compile(footer)({ text: 'Template made with love by GDM Ghent' }));

// Router logic to load the correct template when needed
const router = new Navigo(window.location.origin, true);

routes.forEach((route) => {
  router.on(route.path, () => {
    route.view();
  });
});

// This catches all non-existing routes and redirects back to the home
router.notFound(() => {
  router.navigate('/');
});
router.resolve();
window.onload = () => {
  document.onclick = (e) => {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    if (target != null) {
      router.navigate(target);
    }
  };
};
