import AES from 'crypto-js/aes.js';
import Utf8 from 'crypto-js/enc-utf8.js';

/**
 * @function
 * @param {Array} args
 * @returns {string}
 */
export function crypt(args) {
	AES.encrypt(args.join(':'), process.env.secret).toString();
}

/**
 * @function
 * @param {string} string
 * @returns {string}
 */
export function decrypt(string) {
	AES.decrypt(string, process.env.secret).toString(Utf8);
}
