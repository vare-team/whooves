exports.help = {
  name: "pony",
  description: "Поиск по derpibooru.org\n**Для снятие цензуры, команду необходимо использовать в NSFW канале!**",
  aliases: ['derpi', 'ps'],
  usage: "(запрос) / >(ID)",
  dm: 1,
  tier: 0,
  cooldown: 5
};

exports.run = async (client, msg, args) => {

  let pony;
  let embedErr = new client.userLib.discord.RichEmbed()
    .setTitle('Derpibooru IMAGE 404')
    .setDescription("По вашему запросу ничего не найдено.")
    .setImage('https://derpicdn.net/img/view/2019/12/29/2233270.gif').setFooter(msg.author.tag, msg.author.displayAvatarURL)
    .setColor(client.userLib.colors.war);

  let imageId = {id: ''};
  if (args[0] && args[0].startsWith(">")) imageId.id = parseInt(args[0].replace(/\D+/g,""));
  else imageId = await client.userLib.request({url: `https://derpi.vlos.ru/search.json?q=explicit${args[0] ? ','+args[0] : ''}&random_image=true&filter_id=175480`, json: true});

  try {
    pony = await client.userLib.request({url: `https://derpi.vlos.ru/api/v1/json/images/${imageId.id}`, json: true});
  } catch (e) {
    msg.channel.send(embedErr);
    return;
  }

  if (!imageId.id) {
    msg.channel.send(embedErr);
    return;
  }

  let description = "**Тэги:** ";

  pony.image.tags.forEach(
    (tag) => {description += tag + ','}
    );

  let embed = new client.userLib.discord.RichEmbed()
    .setTitle(`${pony.image.tags.indexOf("gay") != -1 ? ':rainbow_flag: ' : ''}Derpibooru ${pony.image.tags.indexOf("webm") != -1 ? 'VIDEO' : 'IMAGE'}#${imageId.id}`)
    .setImage(pony.image.representations.full).setFooter(msg.author.tag, msg.author.displayAvatarURL)
    .setDescription(description.length > 2000 ? '**Тэги:** слишком много' : description.slice(0, -1))
    .addField('Оценки',`:star:**${pony.image.faves}** :thumbsup:**${pony.image.upvotes}** :thumbsdown:**${pony.image.downvotes}**`, true)
    .addField('Комментарии',`:pencil:**${pony.image.comment_count}**`, true)
    .setColor(client.userLib.colors.inf)
    .setURL('https://derpibooru.org/' + imageId.id);

  if (!msg.channel.nsfw && pony.image.tags.indexOf("explicit") != -1) embed.setImage("https://derpicdn.net/media/2014/01/07/21_08_05_460_rect4.png");

  msg.channel.send(`${pony.image.tags.indexOf("futa") != -1 ? '<@264773177815728129>' : ''}`,embed);

};