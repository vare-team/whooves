exports.help = {
  name: "setbalance",
  description: "Установить баланс участнику",
	aliases: ['sb'],
  usage: "[кол-во] [@кто]",
	dm: 0,
	args: 1,
  tier: 1,
  cooldown: 5
};

exports.run = (client, msg, args) => {
	let user = msg.mentions.users.first() || msg.author;
	client.userLib.db.query(`UPDATE users SET money = ? WHERE userId = ?`, [args[0], user.id]);
	msg.channel.send(`${msg.author} установил ${user} баланс **${args[0]}**`);
};