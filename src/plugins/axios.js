/**
 * This code imports the lodash and axios libraries and assigns them to the global window object.
 * It allows using lodash and axios globally throughout the application.
 */

// Import the lodash library as `_` and assign it to the global `window._` variable.
import _ from 'lodash'
window._ = _

// Import the axios library and assign it to the global `window.axios` variable.
import axios from 'axios'
window.axios = axios
