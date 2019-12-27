exports.help = {
	name: "allguilds",
	description: "",
	usage: "",
	flag: 0,
	cooldown: 500
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

	// let x = '';
	// client.guilds.forEach(guild =>  x += `${guild.id} - ${guild.name} - ${guild.memberCount}\n`);
	// msg.reply(x);

	// client.guilds.forEach(guild => console.log(`${guild.id} - ${guild.name} - ${guild.memberCount}`))

};