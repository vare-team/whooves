import keyList from '../../models/keyList.js';

/**
 * @function
 * @param {string} str
 * @param {string} mode
 * @returns {string}
 */
export default function (str = '', mode = 'en2ru') {
	if (mode === 'en2ru') {
		return str.replace(/[A-z/,.;?&'`~}{\]\[]/g, x => {
			return x === x.toLowerCase() ? keyList.en2ru[x] : keyList.en2ru[x.toLowerCase()].toUpperCase();
		});
	} else if (mode === 'ru2en') {
		return str.replace(/[А-я.?,]/g, x => {
			return x === x.toLowerCase() ? keyList.ru2en[x] : keyList.ru2en[x.toLowerCase()].toUpperCase();
		});
	}
}
