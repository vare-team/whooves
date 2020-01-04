exports.help = {
  name: "pony",
  description: "Поиск по derpibooru.org",
  aliases: ['derpi', 'ps'],
  usage: "[запрос] [sfw/nsfw]",
  dm: 0,
  args: 0,
  tier: 0,
  cooldown: 5,
  hide: true
};

const dinky = require('dinky.js');

exports.run = async (client, msg) => {
  let derpi = await dinky().search(['artist:RainY105']).random();
  console.log(derpi);
  msg.channel.send('Пня найдена!', {files: [{attachment: 'https:'+derpi.image, name: `pony_${derpi.id}.png`}]});
};