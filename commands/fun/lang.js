let replacer = {
  "q":"й", "w":"ц", "e":"у", "r":"к", "t":"е", "y":"н", "u":"г",
  "i":"ш", "o":"щ", "p":"з", "[":"х", "]":"ъ", "{":"Х", "}":"Ъ", "a":"ф", "s":"ы",
  "d":"в", "f":"а", "g":"п", "h":"р", "j":"о", "k":"л", "l":"д",
  ";":"ж", "'":"э", "z":"я", "x":"ч", "c":"с", "v":"м", "b":"и",
  "n":"т", "m":"ь", ",":"б", ".":"ю", "/":".", "&":"?", "?":",", "~":"Ё", "`":"ё"
};

exports.help = {
  name: "lang",
  description: "Перевести текст в русскую раскладку.",
  aliases: ['l'],
  usage: "[текст]",
  dm: 1,
  args: 1,
  tier: 0,
  cooldown: 5
};

function translate(str = '') {
  return str.replace(/[A-z/,.;?&'`~}{\]\[]/g, (x) => {
    return x == x.toLowerCase() ? replacer[x] : replacer[x.toLowerCase()].toUpperCase();
  });
}

exports.run = (client, msg, args) => {
    let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.suc).setDescription(translate(args.join(' '))).setAuthor(msg.author.tag, msg.author.avatarURL);
    msg.channel.send(embed);
};