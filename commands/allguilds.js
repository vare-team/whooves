exports.help = {
    name: "allguilds",
    description: "allguilds",
    usage: "allguilds",
    flag: 0,
    cooldown: 500
};

exports.run = (client, msg, args, Discord) => {
  let x = '';
  client.guilds.forEach(guild => x += `${guild.name} (${guild.id}) | Участников: ${guild.memberCount}\n`);
  msg.reply(new Discord.RichEmbed().setColor(client.userLib.config.colors.inf).setDescription(x));
};