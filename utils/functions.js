import permissionsArrayTranslator from '../models/permissionsArrayTranslator.js';
import { MessageEmbed } from 'discord.js';

export const mentionDetect = /@everyone|@here/gm;

/**
 * @function
 * @param txt {string}
 * @returns {string}
 */
export function codeBlock(txt) {
	return `\`\`\` ${txt} \`\`\``;
}

/**
 * @function
 * @param txt {string}
 * @returns {string}
 */
export function cssBlock(txt) {
	return codeBlock(`css\n${txt}`);
}

/**
 * @function
 * @param txt {string}
 * @returns {string}
 */
export function cBlock(txt) {
	return codeBlock(`c\n${txt}`);
}

/**
 * @function
 * @param txt {string}
 * @returns {string}
 */
export function boldText(txt) {
	return codeBlock(`**${txt}**`);
}

/**
 * @function
 * @param commands {Object[]}
 * @param dm_permission {boolean}
 * @returns {Object[]}
 */
export function mapCommand(commands, dm_permission = true) {
	return commands.map(x => {
		const cmd = Object(x);
		cmd.command.dm_permission = dm_permission;
		return cmd;
	});
}

/**
 * @function
 * @param {Array} array
 * @returns {Array}
 */
export const permissionsArrayToString = array => array.map(el => permissionsArrayTranslator[el]);

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
