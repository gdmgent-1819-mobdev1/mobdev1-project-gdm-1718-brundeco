// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const studentMapViewTemplate = require('../templates/student-mapview.handlebars');

export default () => {
  // Data to be passed to the template

  // Return the compiled template to the router
  update(compile(studentMapViewTemplate)());

};
