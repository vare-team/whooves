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

exports.run = async (client, msg, args) => {
  if (!msg.magicMention.manageable) {
    client.userLib.retError(msg,'У меня не хватает прав для редактирования никнейма.');
    return;
  }

  let corrector = client.userLib.usernameCorrector(msg.magicMention.displayName),
      name = msg.magicMention.displayName;

  if (corrector) {
    msg.magicMention.edit({nick: corrector});
  } else {
    client.userLib.retError(msg, 'В никнейме не найдено спец. символов.')
  }

  let embed = new client.userLib.discord.MessageEmbed()
    .setColor(client.userLib.colors.suc)
    .setFooter(msg.author.tag, msg.author.displayAvatarURL())
    .setDescription(`Никнейм ${msg.magicMention} - "${name}" был изменён на "${corrector}"`);

  msg.channel.send(embed);
};