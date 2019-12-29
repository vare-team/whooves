exports.help = {
	name: "allguilds",
	description: "Список гильдий с количеством серверов",
	aliases: ['ag'],
	usage: "",
	dm: 1,
	args: 0,
	tier: 1,
	cooldown: 0
};

exports.run = (client, msg, args) => {
	let temp = '```\n';
	for (let i of client.guilds.array()) {
		if ((temp+`${i.name} - ${i.memberCount} (ID: ${i.id})\n\`\`\``).length >= 2000) {
			msg.channel.send(temp+'```');
			temp = '```\n';
		}
		temp += `${i.name} - ${i.memberCount} (ID: ${i.id})\n`;
	}
	if (temp.length) msg.channel.send(temp+'```');
};