import permissionsArrayTranslator from '../models/permissionsArrayTranslator.js';

export const mentionDetect = /@everyone|@here/gm;

/**
 *
 * @param commands {[Command]}
 * @return {Object.<string, (function(): Promise<*>)>}
 */
export function mapRunners(commands) {
	return commands.reduce((data, command) => ({ ...data, [command.builder.name]: command.run }), {});
}
/**
 *
 * @param commands {[Command]}
 * @return {Object<string, (function(): Promise<*>)>}
 */
export function mapAutocomplete(commands) {
	return commands.reduce((data, command) => ({ ...data, [command.builder.name]: command.autocomplete }), {});
}

/**
 *
 * @param baseBuilder {SlashCommandBuilder}
 * @param commands {[SlashCommandSubcommandBuilder]}
 * @returns {SlashCommandBuilder}
 */
export function mapSubcommands(baseBuilder, commands) {
	for (const command of commands) {
		baseBuilder.addSubcommand(command);
	}

	return baseBuilder;
}

/**
 * @function
 * @param {Array} array
 * @returns {Array}
 */
export function permissionsArrayToString(array) {
	return array.map(el => permissionsArrayTranslator[el]);
}

/**
 * @function
 * @param {number} servers
 * @param {number} shards
 */
// export const sendSDC = (servers = discordClient.guilds.cache.size, shards = discordClient.shard.count) => {
// 	this.sendLog(`{SDC} Guilds: ${servers}, Shards: ${shards}`);
// 	this.request({
// 		method: 'POST',
// 		url: 'https://api.server-discord.com/v2/bots/' + discordClient.user.id + '/stats',
// 		form: { servers, shards },
// 		headers: { Authorization: 'SDC ' + process.env.sdc },
// 	});
// 	this.sendLog('{SDC} Send stats data');
// 	this.sc.pushTask({ code: 'sendSDC', time: 12 * 60 * 60 * 1000 });
// };

/**
 * @function
 * @param {number} low
 * @param {number} high
 * @returns {number}
 */
export function randomIntInc(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

/**
 * @function
 * @param {object} user
 * @param {object} guild
 * @param {object} channel
 * @param {string} reason
 */
// export const autowarn = (user, guild, channel, reason) => {
// 	_dataBase.insert(
// 		'warns',
// 		{ userId: user.id, guildId: guild.id, who: discordClient.user.id, reason: '[AUTO] ' + reason },
// 		(err, id) => {
// 			con.query('SELECT COUNT(*) FROM warns WHERE userId = ? AND guildId = ?', [user.id, guild.id], (err, count) => {
// 				let embed = new MessageEmbed()
// 					.setColor(this.colors.war)
// 					.setTitle(`${user.tag} выдано предупреждение!`)
// 					.setDescription(
// 						`Причина: **${reason ? reason : 'Не указана'}**\nВсего предупреждений: **${
// 							count[0]['COUNT(*)']
// 						}**\nID предупреждения: **${id}**`
// 					)
// 					.setTimestamp()
// 				channel.send(embed);
//
// 				sendLogChannel('commandUse', guild, {
// 					user: { tag: discordClient.user.tag, id: discordClient.user.id, avatar: discordClient.user.displayAvatarURL() },
// 					channel: { id: channel.id },
// 					content: `выдача предупреждения (ID: ${id}) ${user} по причине: ${reason}`,
// 				});
// 			});
// 		}
// 	);
// };
