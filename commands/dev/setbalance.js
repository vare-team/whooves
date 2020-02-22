exports.help = {
  name: "setbalance",
  description: "Установить баланс участнику",
	aliases: ['sb'],
  usage: [{type: 'text', opt: 0, name: 'кол-во'},
	        {type: 'user', opt: 1}],
	dm: 0,
  tier: 1,
  cooldown: 5
};

exports.run = (client, msg, args) => {
	let user = msg.magicMention || msg.author;
	client.userLib.db.query(`UPDATE users SET money = ? WHERE userId = ?`, [args[0], user.id]);
	msg.channel.send(`${msg.author} установил ${user} баланс **${args[0]}**`);
};