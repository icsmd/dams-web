/**
 * This code imports the lodash and mitt libraries and assigns them to the global window object.
 * It allows using lodash and mitt globally throughout the application.
 */

// Import the lodash library as `_` and assign it to the global `window._` variable.
import _ from 'lodash'
window._ = _

// Import the mitt library and create a new emitter instance.
import mitt from 'mitt'
const emitter = mitt()

// Assign the emitter instance to the global `window.emitter` variable.
window.emitter = emitter
