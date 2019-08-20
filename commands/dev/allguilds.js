
exports.help = {
    name: "allguilds",
    description: "allguilds",
    usage: "allguilds",
    flag: 0,
    cooldown: 500
}


exports.run = (client, msg, args, Discord) => {

	let x = '';client.guilds.forEach(guild =>  x += `${guild.id} - ${guild.name} - ${guild.memberCount}\n`);msg.reply(x);

	// client.guilds.forEach(guild => console.log(`${guild.id} - ${guild.name} - ${guild.memberCount}`))

  //msg.reply(parseInt("", 16))

	// client.guilds.get('334051998796349440').channels.random().createInvite()
 //  .then(invite => console.log(`Created an invite with a code of ${invite.code}`))
 //  .catch(console.error);

	// client.guilds.get('264445053596991498').leave()
 //  .then(g => console.log(`Left the guild ${g}`))
 //  .catch(console.error);

};