import corrector from "../../models/nickNameCorrectorList"
import { randomIntInc } from "../functions"

export const nicknameParts = {
	prefixes: ['A', 'Ex', 'Im', 'Il', 'In', 'Ret', 'Un', 'De', 'Int'],
	root: ['bler', 'ses', 'wis', 'let', 'ger', 'mon', 'lot', 'far'],
	suffixes: ['er', 'or', 'an', 'ian', 'ist', 'ant', 'ee', 'ess', 'ent', 'ity', 'ance', 'ion', 'dom', 'th'],
}
export const nicknameReplacerFirst = /^[^A-Za-zА-Яа-я]+/
export const nicknameReplacer = /[^0-9A-Za-zА-Яа-яЁё .|-]/g

/**
 * @function
 * @param {string} nickname
 * @returns {string}
 */
export function getClearNickname(nickname) {
	let corrected = '';

	for (let char = 0; char < nickname.length; char++) {
		if (corrector.hasOwnProperty(nickname[char])) corrected += corrector[nickname[char]]
		else if (corrector.hasOwnProperty(nickname[char] + nickname[char + 1]))
			corrected += corrector[nickname[char] + nickname[char + 1]]
		else corrected += nickname[char]
	}

	return corrected.replace(this.nicknameReplacerFirst, '').replace(this.nicknameReplacer, '') || getRandomNickname()
}

/**
 * @function
 * @param {string} nickname
 * @returns {boolean}
 */
export function isNicknameClear(nickname) {
	return !(this.nicknameReplacerFirst.test(nickname) || this.nicknameReplacer.test(nickname))
}

/**
 * @function
 * @returns {string}
 */
export function getRandomNickname() {
	return nicknameParts.prefixes[randomIntInc(0, nicknameParts.prefixes.length - 1)] + nicknameParts.root[randomIntInc(0, nicknameParts.root.length - 1)] + nicknameParts.suffixes[randomIntInc(0, nicknameParts.suffixes.length - 1)];
}
