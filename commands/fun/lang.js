
exports.help = {
    name: "lang",
    description: "Перевести текст в русскую раскладку.",
    usage: "lang [текст]",
    flag: 3,
    cooldown: 5000
}

function change( str ) {
  replacer = {
    "q":"й", "w":"ц", "e":"у", "r":"к", "t":"е", "y":"н", "u":"г",
    "i":"ш", "o":"щ", "p":"з", "[":"х", "]":"ъ", "{":"Х", "}":"Ъ", "a":"ф", "s":"ы", 
    "d":"в", "f":"а", "g":"п", "h":"р", "j":"о", "k":"л", "l":"д",
    ";":"ж", "'":"э", "z":"я", "x":"ч", "c":"с", "v":"м", "b":"и",
    "n":"т", "m":"ь", ",":"б", ".":"ю", "/":".", "&":"?", "?":",", "~":"Ё", "`":"ё"
  };       
  return str.replace(/[A-z/,.;?&\'`~}{\]\[]/g, function ( x ){
    return x == x.toLowerCase() ? replacer[ x ] : replacer[ x.toLowerCase() ].toUpperCase();
  });
}


exports.run = (client, msg, args, Discord) => {

  client.db.queryValue('SELECT prefix FROM servers WHERE id = ?', [msg.guild.id], (err, prefix) => {

    let text = msg.content.slice(prefix.length+4);
    if (text == '') {embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Вы не ввели текст!`); return msg.channel.send({embed})};

    embed = new Discord.RichEmbed().setColor(client.config.colors.suc).setDescription(change(text)).setAuthor(msg.author.tag, msg.author.avatarURL);
    msg.channel.send({embed});

  });

};