module.exports = async (client, msg) => {
	if (msg.author.bot) return;

	if (msg.channel.type !== 'dm' && !client.userLib.checkPerm(-1, { ownerID: msg.guild.ownerID, member: msg.member })) {
		msg.badWordsCheck = msg.content
			.toLowerCase()
			.replace(/[^a-zа-яЁё ]/g, '')
			.replace('ё', 'е')
			.trim()
			.split(/ +/g);
		if (
			(await client.userLib.checkSettings(msg.guild.id, 'badwords')) &&
			client.userLib.badWords.some(w => msg.badWordsCheck.includes(w))
		) {
			client.userLib.autowarn(msg.author, msg.guild, msg.channel, 'Ненормативная лексика');
			msg.delete();
		}
	}

	client.userLib.db.query('INSERT INTO users (userId, tag) VALUES (?, ?) ON DUPLICATE KEY UPDATE xp = xp + ?', [
		msg.author.id,
		msg.author.tag,
		client.userLib.randomIntInc(1, 5),
	]);
};

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
