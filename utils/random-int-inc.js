/**
 * @function
 * @param {number} low
 * @param {number} high
 * @returns {number}
 */
export default function (low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}
