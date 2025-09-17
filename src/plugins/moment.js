/**
 * This code imports the lodash and moment libraries and assigns them to the global window object.
 * It allows using lodash and moment globally throughout the application.
 */

// Import the lodash library as `_` and assign it to the global `window._` variable.
import _ from 'lodash'
window._ = _

// Import the moment library and assign it to the global `window.moment` variable.
import moment from 'moment'
window.moment = moment
