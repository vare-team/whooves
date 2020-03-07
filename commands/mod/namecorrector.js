exports.help = {
  name: "namecorrector",
  description: "Исправление никнейма.",
  aliases: ['nc'],
  usage: [
    {type: 'user', opt: 0}
  ],
  dm: 0,
  tier: -1,
  cooldown: 5
};

exports.run = (client, msg, args) => {
  if (!msg.magicMention.manageable) {
    client.userLib.retError(msg,'У меня не хватает прав для редактирования никнейма.');
    return;
  }

  let name = msg.magicMention.displayName
    , correctName = client.userLib.getUsernameCorrect(name)
  ;

  if (!client.userLib.isUsernameCorrect(name)) {
    msg.magicMention.edit({nick: correctName});
  } else {
    client.userLib.retError(msg, 'В никнейме не найдено спец. символов.');
    return;
  }

  let embed = new client.userLib.discord.MessageEmbed()
    .setColor(client.userLib.colors.suc)
    .setFooter(msg.author.tag, msg.author.displayAvatarURL())
    .setDescription(`Никнейм ${msg.magicMention} - "${name}" был изменён на "${correctName}"`);

  msg.channel.send(embed);
};