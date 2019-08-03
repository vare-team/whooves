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

	this.sendLogChannel = (guild, type, text) => {
		let embed = new Discord.RichEmbed();

		if(!type) return console.error('Error! Тип не указан');
		switch (type) {
		  case "memberAdd":
			embed.setTitle('Пользователь присоединился!');
			embed.setColor('#33af33');
		  break;
	  
		  case "memberRemove":
			embed.setTitle('Пользователь вышел!');
			embed.setColor('#ff9000')
		  break;
	  
		  case "memberBan":
			embed.setTitle('Забанен!');
			embed.setColor('#FF4000');
		  break;
			  
		  default:
			embed.setTitle('unknown log!');
			embed.setColor(config.color);
		}
		if(text) embed.setDescription(text);

    con.queryValue('SELECT logchannel FROM guilds WHERE id = ?', [guild.id], (err, logchannel) => {
			if(err) throw err;
			if(!logchannel) return;
			return client.channels.get(logchannel).send(embed);
		});
	}
}