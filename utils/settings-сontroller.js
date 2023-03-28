import Guild from '../models/guild.js';

const settingsList = {
	chatAutoModeration: 0x1,
	nicknameAutoModeration: 0x2,
};

const normalizeParameters = {
	chatAutoModeration: 'Фильтр плохих слов',
	nicknameAutoModeration: 'Исправление никнеймов',
};

/**
 * @function
 * @param {string | Guild} guildId
 * @param {string} name
 * @returns {Promise<boolean>}
 */
export async function checkSettings(guildId, name) {
	const guild = guildId instanceof Guild ? guildId : await Guild.findByPk(guildId);
	return !!(settingsList[name] & guild?.settings);
}

/**
 * @function
 * @param {Array} fields
 * @param {Guild} guild
 * @param {string} name
 * @param {string|boolean} state
 * @returns {Promise<number>}
 */
export async function getSetting(fields, guild, name, state) {
	state = state === 'true';
	const oldState = await checkSettings(guild, name);
	fields.push({ name: normalizeParameters[name], value: getSettingText(oldState, state) });
	if (oldState !== state) return getSettingValue(name, state);
	return 0;
}

/**
 * @function
 * @param {string} name
 * @param {boolean} state
 * @returns {number}
 */
function getSettingValue(name, state) {
	return (state ? 1 : -1) * settingsList[name];
}

/**
 * @function
 * @param {boolean} oldState
 * @param {boolean} newState
 * @returns {string}
 */
function getSettingText(oldState, newState) {
	return oldState === newState ? 'Параметр уже находится в этом значении!' : newState ? 'включен' : 'выключен';
}
