import badWords from '../models/badwords.js';
import { ChannelType } from 'discord.js';
import { randomIntInc } from '../utils/functions.js';

//TODO: бдшка
export default async function (message) {
	if (message.author.bot) return;

	if (
		message.channel.type !== ChannelType.DM &&
		!client.userLib.checkPerm(-1, { ownerID: message.guild.ownerID, member: message.member })
	) {
		message.badWordsCheck = message.content
			.toLowerCase()
			.replace(/[^a-zа-яЁё ]/g, '')
			.replace('ё', 'е')
			.trim()
			.split(/ +/g);
		if (
			(await client.userLib.checkSettings(message.guild.id, 'badwords')) &&
			badWords.some(w => message.badWordsCheck.includes(w))
		) {
			client.userLib.autowarn(message.author, message.guild, message.channel, 'Ненормативная лексика');
			message.delete();
		}
	}

	client.userLib.db.query('INSERT INTO users (userId, tag) VALUES (?, ?) ON DUPLICATE KEY UPDATE xp = xp + ?', [
		message.author.id,
		message.author.tag,
		randomIntInc(1, 5),
	]);
}

/*
  tier
  -3 - Owner guild
  -2 - Admin guild
  -1 - Moderator guild
  0 - user
  1 - admin tier 0
  2 - admin tier 1

  help export

exports.help = {
	name: '',
	description: '',
	aliases: ['', ''],
	tier: 0,
	dm: 0,
	args: 0,
	usage: '',
	cooldown: 0
};

let usage = [
	{type: 'text', opt: 0, name: ''},
	{type: 'text', opt: 1, name: ''},
	{type: 'user', opt: 0},
	{type: 'channel', opt: 1},
	{type: 'voice'},
	{type: 'attach', opt: 1}
];

*/
