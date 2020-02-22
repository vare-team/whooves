exports.help = {
  name: "spony",
  description: "Поиск по derpibooru.org",
  aliases: ['sderpi', 'sps'],
  usage: [{type: 'text', opt: 1, name: 'запрос'}],
  dm: 1,
  tier: 0,
  cooldown: 5
};

exports.run = async (client, msg, args) => {
  let imageId = await client.userLib.request({url: `https://derpi.vlos.ru/search.json?random_image=true&q=safe${args.length ? ',' + args.join(' ') : ''}`, json: true});
  imageId = imageId.id;
  if (!imageId) {
    let embedErr = new client.userLib.discord.RichEmbed().setTitle('Derpibooru IMAGE 404').setDescription("По вашему запросу ничего не найдено.").setImage('https://derpicdn.net/img/view/2019/12/29/2233270.gif').setFooter(msg.author.tag, msg.author.displayAvatarURL).setColor(client.userLib.colors.war);
    msg.channel.send(embedErr);return;
  }

  let pony = await client.userLib.request({url: `https://derpi.vlos.ru/api/v1/json/images/${imageId}`, json: true});
  pony = pony.image;

  let description = pony.tags.reduce((pr, cu) => pr + cu + ',', "**Тэги:** ").slice(0, -1);
  let embed = new client.userLib.discord.RichEmbed()
    .setTitle(`Derpibooru ${pony.format == 'webm' ? 'VIDEO' : 'IMAGE'}#${pony.id}`)
    .setImage(pony.representations.full)
    .setFooter(msg.author.tag, msg.author.displayAvatarURL)
    .setDescription(description.length <= 2000 ? description : '**Тэги:** слишком много')
    .addField('Оценки',`:star:**${pony.faves}** :thumbsup:**${pony.upvotes}** :thumbsdown:**${pony.downvotes}**`, true)
    .addField('Комментарии',`:pencil:**${pony.comment_count}**`, true)
    .setColor(client.userLib.colors.inf)
    .setURL('https://derpibooru.org/images/' + pony.id);
  msg.channel.send(embed);
};