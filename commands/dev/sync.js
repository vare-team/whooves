exports.help = {
	name: "sync",
	description: "Синхронизация",
	aliases: [],
	usage: [],
	dm: 1,
	tier: 1,
	cooldown: 0
};

exports.run = async (client, msg) => {
	msg.channel.startTyping();

	let res = await client.shard.broadcastEval(`[ ...this.guilds.cache.keys() ]`);
	let temp = [];
	for (let i of res) temp.push(...i);
	res = temp;

	client.userLib.db.queryCol(`SELECT guildId FROM guilds WHERE guildId IN (?)`, [res], async (err, result) => {
		result = res.filter(item => result.indexOf(item) == -1);
		let temp = '';
		console.log(result);
		for (let i of result) {
			client.userLib.db.insert('guilds', {guildId: i}, () => {});
			temp += 'no in db: ' + i + ' ' + (await client.shard.broadcastEval(`this.guilds.cache.get('${i}') ? this.guilds.cache.get('${i}').name : 0`)).find(l => l) + '\n';
		}
		msg.channel.send(temp).catch(() => msg.channel.send('Серверов нет'));
	});

	msg.channel.stopTyping();
};