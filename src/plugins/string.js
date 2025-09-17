/**
 * This code imports the lodash and moment libraries and assigns them to the global window object.
 * It also defines several utility functions and assigns them to the global window object.
 * These functions provide additional functionality for string manipulation and date/time formatting.
 */

// Import the lodash library as `_` and assign it to the global `window._` variable.
import _ from 'lodash'

// Import the moment library and assign it to the global `window.moment` variable.
import moment from 'moment'

// Assign the lodash library to the global `window._` variable.
window._ = _

/**
 * Capitalizes the first letter of a word.
 * @param {string} word - The word to capitalize.
 * @returns {string} The word with the first letter capitalized.
 */
window.ucfirst = (word) => {
	return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * Converts a string from snake_case or kebab-case to formal case.
 * @param {string} field - The string to convert.
 * @returns {string} The converted string in formal case.
 */
window.toFormalCase = (field) => {
	if (field.includes('_')) {
		field = field.split('_').join(' ')
	}

	field = field.toLowerCase().replace(/\b[a-z]/g, function (letter) {
		return letter.toUpperCase()
	})

	return field
}

/**
 * Formats a date and time string into a readable format.
 * @param {string} dateTime - The date and time string to format.
 * @returns {string} The formatted date and time string.
 */
window.toReadableDate = (dateTime) => {
	return moment(dateTime).format('MMMM DD, YYYY')
}

/**
 * Formats a date and time string into a readable format.
 * @param {string} dateTime - The date and time string to format.
 * @returns {string} The formatted date and time string.
 */
window.toReadableTime = (dateTime) => {
	return moment(dateTime).format('hh:mm A')
}

window.toReadableDateTime = (dateTime) => {
	return moment(dateTime).format('MMMM DD, YYYY hh:mm A')
}

window.toCurrency = (number) => {
	return parseFloat(number).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}
