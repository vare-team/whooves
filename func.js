module.exports = function(Discord, client, con) {

	this.colors = {
		err: "#F04747",
		suc: "#43B581",
		inf: "#3492CC",
		war: "#FAA61A"
  };
  this.owners = ["166610390581641217", "194384673672003584", "532196405612380171", "178404926869733376"];
	this.discord = Discord;
	this.db = con;
	this.moment = require('moment');
  this.moment.locale("ru");
  // this.cooldown = new Map();
  this.promise = require('./promise');

  this.sendLog = (log) => {
	  const now = new Date();
	  console.log(`${('00' + now.getHours()).slice(-2) + ':' + ('00' + now.getMinutes()).slice(-2) + ':' + ('00' + now.getSeconds()).slice(-2)} | Shard[${client.shard.id}] : ${log}`);
	};

	this.presenseCount = 0;
	this.presenseFunc = () => {
		switch (this.presenseCount) {
			case 0:
			client.user.setPresence({ game: { name: `a.help`, type: 'WATCHING' }});
			break;
			case 1:
		client.user.setPresence({ game: { name: `серверов: ${client.guilds.size}`, type: 'WATCHING' }});
			this.presenseCount = 0;
			break;
		}
		this.presenseCount++;
	};

	this.sendLogChannel = async (type, guild, data) => {
    let logchannel = await this.promise(con, con.queryValue, 'SELECT logchannel FROM guilds WHERE id = ?', [guild.id]);
    logchannel = logchannel.res;
    if(!logchannel) return;
    let channel = guild.channels.get(logchannel);

    if(!channel) {
      con.update('guilds', {id: guild.id, logchannel: null}, () => {});
      return;
    };

		let embed = new Discord.RichEmbed().setTimestamp().setAuthor(data.user.tag, data.user.avatar).setFooter(`ID: ${data.user.id}`);

		if(!type) return console.warn('Error! Тип не указан');
		switch (type) {
		  case "memberAdd":
        embed.setColor(this.colors.suc)
          .setTitle('Новый участник на сервере!')
          .setDescription(`Аккаунт зарегистрирован **${this.moment(data.user.createdAt, "WWW MMM DD YYYY HH:mm:ss").fromNow()}**`);
		  break;
	  
		  case "memberRemove":
        embed.setColor(this.colors.err)
          .setTitle('Участник покинул сервер!');
      break;
      
      case "messageDelete":
          embed.setColor(this.colors.err)
          .setTitle('Удалённое сообщение')
          .setDescription(`\`\`\`${data.content.replace(/`/g, "")}\`\`\``)
          .addField('Канал', `<#${data.channel.id}>`);
        break;

        case "messageUpdate":
          embed.setColor(this.colors.err)
          .setTitle('Изменённое сообщение')
          .addField('Старое сообщение', `\`\`\`${data.oldContent.replace(/`/g, "")}\`\`\``)
          .addField('Новое сообщение', `\`\`\`${data.newContent.replace(/`/g, "")}\`\`\``)
          .addField('Канал', `<#${data.channel.id}>`);
        break;

        case "voiceStateAdd":
          embed.setColor(this.colors.suc)
            .setTitle(`Подключился к "${data.channel.name}"`);
        break;

        case "voiceStateRemove":
          embed.setColor(this.colors.err)
          .setTitle(`Отключился от "${data.channel.name}"`);
        break;

        case "voiceStateUpdate":
          embed.setColor(this.colors.inf)
            .setTitle(`Переместился из "${data.channel.oldName}" в "${data.channel.newName}"`);
        break;
			  
		  default:
			embed.setTitle('unknown log!')
			  .setColor(this.colors.err);
		}
    channel.send(embed).catch(err => console.log(`\nОшибка!\nТекст ошибки: ${err}`));
	}
}