import corrector from '../configs/nickname-corrector-list.js';
import randomIntInc from '../utils/random-int-inc.js';

const nicknameParts = {
	prefixes: ['A', 'Ex', 'Im', 'Il', 'In', 'Ret', 'Un', 'De', 'Int'],
	root: ['bler', 'ses', 'wis', 'let', 'ger', 'mon', 'lot', 'far'],
	suffixes: ['er', 'or', 'an', 'ian', 'ist', 'ant', 'ee', 'ess', 'ent', 'ity', 'ance', 'ion', 'dom', 'th'],
};
const nicknameReplacerFirst = /^[^A-Za-zА-Яа-яЁё]+/;
const nicknameReplacer = /[^А-Яа-яЁё -~]/g;

/**
 * @function
 * @param {string} nickname
 * @returns {string}
 */
export function getClearNickname(nickname) {
	let corrected = '';

	for (let char = 0; char < nickname.length; char++) {
		if (corrector.hasOwnProperty(nickname[char])) corrected += corrector[nickname[char]];
		else if (corrector.hasOwnProperty(nickname[char] + nickname[char + 1]))
			corrected += corrector[nickname[char] + nickname[char + 1]];
		else corrected += nickname[char];
	}

	return corrected.replace(nicknameReplacerFirst, '').replace(nicknameReplacer, '') || getRandomNickname();
}

/**
 * @function
 * @param {string} nickname
 * @returns {boolean}
 */
export function isNicknameClear(nickname) {
	return !(nicknameReplacerFirst.test(nickname) || nicknameReplacer.test(nickname));
}

/**
 * @function
 * @returns {string}
 */
function getRandomNickname() {
	return (
		nicknameParts.prefixes[randomIntInc(0, nicknameParts.prefixes.length - 1)] +
		nicknameParts.root[randomIntInc(0, nicknameParts.root.length - 1)] +
		nicknameParts.suffixes[randomIntInc(0, nicknameParts.suffixes.length - 1)]
	);
}
