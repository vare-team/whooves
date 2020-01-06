exports.help = {
  name: "pony",
  description: "Поиск по derpibooru.org",
  aliases: ['derpi', 'ps'],
  usage: "[запрос] [sfw/nsfw]",
  dm: 0,
  args: 0,
  tier: 0,
  cooldown: 5,
  // hide: true
};

exports.run = async (client, msg) => {
  msg.channel.startTyping();
  
  let id = await client.userLib.request({url: 'https://derpi.vlos.ru/search.json?q=artist:RainY105&random_image=true', json: true});
  let pony = await client.userLib.request({url: `https://derpi.vlos.ru/api/v1/json/images/${id.id}`, json: true});
  console.log(pony);
  
  msg.channel.stopTyping();
  msg.channel.send('Пня найдена!', {files: [{attachment: pony.image.view_url, name: `pony_${pony.image.id}.png`}]});
};