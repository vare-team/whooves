const schedule = require('../SDCBotsModules/schedule');

/**
 * Generate userLib.
 * @module
 * @param Discord
 * @param client - Discord client
 * @param con - mysql connection
 */
module.exports = function (Discord, client, con) {
	// con.queryKeyValue('SELECT id, tier FROM admins WHERE 1', (err, result) => client.userLib.admins = result);

	this.admins = {
		"321705723216134154": 0,
		"166610390581641217": 0
	};

	let replacer = {
		"q":"й", "w":"ц", "e":"у", "r":"к", "t":"е", "y":"н", "u":"г",
		"i":"ш", "o":"щ", "p":"з", "[":"х", "]":"ъ", "{":"Х", "}":"Ъ", "a":"ф", "s":"ы",
		"d":"в", "f":"а", "g":"п", "h":"р", "j":"о", "k":"л", "l":"д",
		";":"ж", "'":"э", "z":"я", "x":"ч", "c":"с", "v":"м", "b":"и",
		"n":"т", "m":"ь", ",":"б", ".":"ю", "/":".", "&":"?", "?":",", "~":"Ё", "`":"ё"
	};

	/**
	 * @function
	 * @param {string} str
	 * @returns {string}
	 */
	this.translate = (str = '') => {
		return str.replace(/[A-z/,.;?&'`~}{\]\[]/g, (x) => {
			return x == x.toLowerCase() ? replacer[x] : replacer[x.toLowerCase()].toUpperCase();
		});
	};

	const { registerFont, createCanvas, loadImage } = require('canvas');
	// registerFont('./ds_moster.ttf', { family: 'Comic Sans' });
	this.createCanvas = createCanvas;
	this.loadImage = loadImage;

	/**
	 * @function
	 * @param {number} tier
	 * @param {string} ownerID
	 * @param member
	 * @returns {boolean}
	 */
	this.checkPerm = (tier, ownerID, member) => {
		if (this.admins.hasOwnProperty(member.id) && this.admins[member.id] == 0) return true;
		if (this.admins.hasOwnProperty(member.id) && tier < 0 && tier > this.admins[member.id]) return true;
		if (tier == -3 && (ownerID == member.id)) return true;
		if (tier == -2 && member.hasPermission('ADMINISTRATOR')) return true;
		return tier == -1 && member.hasPermission('MANAGE_MESSAGES');
	};

	/**
	 * @function
	 * @param {string} log
	 * @param {string} type
	 */
	this.sendLog = (log = 'Clap one hand', type = 'Auto') => {
		const now = new Date;
		console.log(`${('00' + now.getDate()).slice(-2) + '.' + ('00' + (now.getMonth()+1)).slice(-2) + ' ' + ('00' + now.getHours()).slice(-2) + ':' + ('00' + now.getMinutes()).slice(-2) + ':' + ('00' + now.getSeconds()).slice(-2)} | Shard[${client.shard.id}] | {${type}} : ${log}`);
	};

	this.colors = {
		err: "#F04747",
		suc: "#43B581",
		inf: "#3492CC",
		war: "#FAA61A"
	};

	this.discord = Discord;
	this.db = con;

	this.request = require('request-promise-native');

	this.moment = require('moment');
	this.moment.locale("ru");

	this.cooldown = new Map();

	this.promise = require('../SDCBotsModules/promise');
	this.sc = new schedule(this.sendLog);

	/**
	 * @function
	 * @param {number} servers
	 * @param {number} shards
	 */
	this.sendSDC = (servers, shards) => {
		this.request({method: "POST", url: 'https://api.server-discord.com/v2/bots/'+client.user.id+'/stats', form: {servers, shards}, headers: {'Authorization':'SDC '+process.env.sdc}});
		this.sendLog('{SDC} Send stats data');
	};

	/**
	 * @function
	 * @param {number} low
	 * @param {number} high
	 * @returns {number}
	 */
	this.randomIntInc = (low, high) => {
		return Math.floor(Math.random() * (high - low + 1) + low)
	};

	this.presenceCount = 0;
	this.presenceFunc = () => {
		switch (this.presenceCount) {
			case 0:
				client.user.setPresence({ game: { name: `w.help`, type: 'WATCHING' } });
				break;
			case 1:
				client.user.setPresence({ game: { name: `серверов: ${client.guilds.size}`, type: 'WATCHING' } });
				break;
			case 2:
				client.user.setPresence({ game: { name: 'время', type: 'WATCHING' } });
				break;
			case 3:
				client.user.setPresence( { game: { name: 'хуффингтон', type: 'STREAMING' } } );
				this.presenceCount = 0;
		}
		this.presenceCount++;
		this.sc.pushTask({code: 'presence', time: 30000});
	};

	/**
	 * @function
	 * @param channel
	 * @param {Object} author
	 * @param {string} reason
	 */
	this.retError = (channel, author, reason = 'Какая разница вообще?') => {
		let embed = new Discord.RichEmbed().setColor(this.colors.err).setTitle('Ошибка!').setDescription(reason).setFooter(author.tag, author.displayAvatarURL).setTimestamp();
		channel.send(`<@${author.id}>`, embed).then((msgErr) => msgErr.delete(10000));
	};

	/**
	 * Send Guild custom log
	 * @function
	 * @param {string} type - Type of log
	 * @param guild
	 * @param {object} data - Nedded data
   // * @param {object} data.user - User data
   // * @param {*} data.user.id - User id
   // * @param {Date} data.user.createdAt - User created data
   // * @param {object} data.channel - Channel data
   // * @param {string} data.channel.id - Channel id
   // * @param {string} data.channel.name - Channel name
   // * @param {string} data.channel.oldName - Channel name
   // * @param {string} data.channel.newName - Channel name
   // * @param {string} data.content - Message
   // * @param {string} data.oldContent - Old Message
   // * @param {string} data.newContent - New Message
	 */
	this.sendLogChannel = async (type, guild, data) => {
		let logchannel = await this.promise(con, con.queryValue, 'SELECT logchannel FROM guilds WHERE id = ?', [guild.id]);
		logchannel = logchannel.res;
		if (!logchannel) return;
		let channel = guild.channels.get(logchannel);

		if (!channel) {
			con.update('guilds', { id: guild.id, logchannel: null }, () => { });
			return;
		}

		const embed = new Discord.RichEmbed().setTimestamp().setAuthor(data.user.tag, data.user.avatar).setFooter(`ID: ${data.user.id}`);

		if (!type) return console.warn('Error! Тип не указан');
		switch (type) {
			case "memberAdd":
				embed
					.setColor(this.colors.suc)
					.setTitle('Новый участник на сервере!')
					.setDescription(`Аккаунт зарегистрирован **${this.moment(data.user.createdAt, "WWW MMM DD YYYY HH:mm:ss").fromNow()}**`);
				break;

			case "memberRemove":
				embed
					.setColor(this.colors.err)
					.setTitle('Участник покинул сервер!');
				break;

			case "messageDelete":
				embed
					.setColor(this.colors.err)
					.setTitle('Удалённое сообщение')
					.setDescription(`\`\`\`${data.content.replace(/`/g, "")}\`\`\``)
					.addField('Канал', `<#${data.channel.id}>`);
				break;

			case "messageDeleteBulk":
				embed
					.setColor(this.colors.inf)
					.setTitle(`Массовое удаление сообщений`)
					.setDescription(`Было удалено **${data.size}**`)
					.addField('Канал', `<#${data.channel.id}>`);
				break;

			case "messageUpdate":
				embed
					.setColor(this.colors.err)
					.setTitle('Изменённое сообщение')
					.addField('Старое сообщение', `\`\`\`${data.oldContent.replace(/`/g, "")}\`\`\``)
					.addField('Новое сообщение', `\`\`\`${data.newContent.replace(/`/g, "")}\`\`\``)
					.addField('Канал', `<#${data.channel.id}>`);
				break;

			case "voiceStateAdd":
				embed
					.setColor(this.colors.suc)
					.setTitle(`Подключился к "${data.channel.name}"`);
				break;

			case "voiceStateRemove":
				embed
					.setColor(this.colors.err)
					.setTitle(`Отключился от "${data.channel.name}"`);
				break;

			case "voiceStateUpdate":
				embed
					.setColor(this.colors.inf)
					.setTitle(`Переместился из "${data.channel.oldName}" в "${data.channel.newName}"`);
				break;

			default:
				embed
					.setTitle('unknown log!')
					.setColor(this.colors.err);
		}

		channel.send(embed).catch(err => console.log(`\nОшибка!\nТекст ошибки: ${err}`));
	}
};
