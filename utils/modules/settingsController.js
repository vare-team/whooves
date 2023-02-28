export const settingsList = {
	chatAutoModeration: 0x1,
	nicknameAutoModeration: 0x2,
};

/**
 * @function
 * @param {string} guildId
 * @param {string} setNumber
 * @returns {boolean}
 */
export async function checkSettings(guildId, setNumber) {
	let setting = await con.promise().query('SELECT settings FROM guilds WHERE guildId = ?', [guildId]);
	setting = setting[0][0].settings;

	return !!(settingsList[setNumber] & setting);
}

/**
 * @function
 * @param {string} guildId
 * @param {string} setNumber
 * @param {boolean} state
 * @returns {boolean}
 */
export async function setSettings(guildId, setNumber, state) {
	if ((await this.checkSettings(guildId, setNumber)) === state) return false;

	con.query(`UPDATE guilds SET settings = settings ${state ? '+' : '-'} ? WHERE guildId = ?`, [
		this.settings[setNumber],
		guildId,
	]);
	return true;
}
