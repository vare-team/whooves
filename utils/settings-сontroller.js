import Guild from '../models/guild.js';

const settingsList = {
	chatAutoModeration: 0x1,
	nicknameAutoModeration: 0x2,
};

/**
 * @function
 * @param {string} guildId
 * @param {string} setNumber
 * @returns {Promise<boolean>}
 */
export async function checkSettings(guildId, setNumber) {
	const guild = await Guild.findByPk(guildId);
	return !!(settingsList[setNumber] & guild?.settings);
}

/**
 * @function
 * @param {string} guildId
 * @param {string} setNumber
 * @param {boolean} state
 * @returns {boolean}
 */
export async function setSettings(guildId, setNumber, state) {
	if ((await checkSettings(guildId, setNumber)) === state) return false;

	await Guild.increment({ settings: (state ? 1 : -1) * settingsList[setNumber] }, { where: { id: guildId } });
	return true;
}
