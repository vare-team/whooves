exports.help = {
  name: "pony",
  description: "Поиск по derpibooru.org",
  aliases: ['derpi', 'ps'],
  usage: "[запрос] [sfw/nsfw]",
  dm: 0,
  args: 0,
  tier: 0,
  cooldown: 5
};

const dinky = require('dinky.js');

exports.run = async (client, msg, args) => {
  msg.reply(await dinky().search().random());
};