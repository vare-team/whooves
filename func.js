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
		'321705723216134154': 0,
		'166610390581641217': 0
	};

	let replacer = {
		'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г',
		'i': 'ш', 'o': 'щ', 'p': 'з', '[': 'х', ']': 'ъ', '{': 'Х', '}': 'Ъ', 'a': 'ф', 's': 'ы',
		'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д',
		';': 'ж', '\'': 'э', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и',
		'n': 'т', 'm': 'ь', ',': 'б', '.': 'ю', '/': '.', '&': '?', '?': ',', '~': 'Ё', '`': 'ё'
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

	const {registerFont, createCanvas, loadImage, image} = require('canvas');
	// registerFont('./ds_moster.ttf', { family: 'Comic Sans' });
	this.createCanvas = createCanvas;
	this.loadImage = loadImage;

	/**
	 * @function
	 * @param {number} tier
	 * @param {Object} data
	 * @returns {boolean}
	 */
	this.checkPerm = (tier, data) => {
		if (this.admins.hasOwnProperty(data.member.id) && this.admins[data.member.id] == 0) return true;
		if (this.admins.hasOwnProperty(data.member.id) && tier < 0 && tier > this.admins[data.member.id]) return true;
		if (tier == -3 && (data.ownerID == data.member.id)) return true;
		if (tier == -2 && data.member.hasPermission('ADMINISTRATOR')) return true;
		return tier == -1 && data.member.hasPermission('MANAGE_MESSAGES');
	};

	/**
	 * @function
	 * @param {string} type
	 * @param {string} command
	 * @param msg
	 */
	this.generateUseLog = (type, command, msg) => {
		if (type === 'dm') {
			return `Use: ${command}, By: @${msg.author.tag}(${msg.author.id}), In: 'DM'`;
		}

		return `Use: ${command}, By: @${msg.author.tag}(${msg.author.id}), In: ${msg.guild.name}(${msg.guild.id}) => #${msg.channel.name}(${msg.channel.id})`;
	};

	/**
	 * @function
	 * @param {string} type
	 * @param {string} command
	 * @param msg
	 * @param {string} err
	 * @returns {string}
	 */
	this.generateErrLog = (type, command, msg, err) => {
		if (type === 'dm') {
			return `! Ошибка!\n! Команда - ${command}\n! Пользователь: ${msg.author.tag} (ID: ${msg.author.id})\n! Текст ошибки: ${err}`;
		}

		return `! Ошибка!\n! Команда - ${command}\n! Сервер: ${msg.guild.name} (ID: ${msg.guild.id})\n! Канал: ${msg.channel.name} (ID: ${msg.channel.id})\n! Пользователь: ${msg.author.tag} (ID: ${msg.author.id})\n! Текст ошибки: ${err}`;
	};

	/**
	 * @function
	 * @param {Array} usage
	 * @returns {string}
	 */
	this.generateUsage = (usage) => {
		let generate = '';
		for (let us of usage) {
			generate += generate ? ' ' : '';
			if (us.type === 'voice' || us.type === 'attach') {
				generate += us.opt ? '{' : '<';
				generate += us.type === 'voice' ? 'подключение' : 'вложение';
				generate += us.opt ? '}' : '>';
			} else {
				if (us.type === 'user') us.name = '@кто';
				if (us.type === 'channel') us.name = '#текстовый-канал';
				generate += us.opt ? '(' : '[';
				generate += us.name;
				generate += us.opt ? ')' : ']';
			}
		}
		return generate;
	};

	/**
	 * @function
	 * @param {string} log
	 * @param {string} type
	 */
	this.sendLog = (log = 'Clap one hand', type = 'Auto') => {
		const now = new Date;
		console.log(`${('00' + now.getDate()).slice(-2) + '.' + ('00' + (now.getMonth() + 1)).slice(-2) + ' ' + ('00' + now.getHours()).slice(-2) + ':' + ('00' + now.getMinutes()).slice(-2) + ':' + ('00' + now.getSeconds()).slice(-2)} | Shard[${client.shard.id}] | {${type}} : ${log}`);
	};

	this.colors = {
		err: '#F04747',
		suc: '#43B581',
		inf: '#3492CC',
		war: '#FAA61A'
	};

	this.emoji = {load: '<a:load:674326004990345217>', ready: '<a:checkmark:674326004252016695>', err: '<a:error:674326004872904733>'};

	this.discord = Discord;
	this.db = con;

	this.request = require('request-promise-native');

	this.moment = require('moment');
	this.moment.locale('ru');

	this.cooldown = new Map();

	this.promise = require('../SDCBotsModules/promise');
	this.sc = new schedule(this.sendLog);

	/**
	 * @function
	 * @param {number} servers
	 * @param {number} shards
	 */
	this.sendSDC = (servers = client.guilds.size, shards = client.shard.count) => {
		this.sendLog(`{SDC} Guilds: ${servers}, Shards: ${shards}`);
		this.request({
			method: 'POST',
			url: 'https://api.server-discord.com/v2/bots/' + client.user.id + '/stats',
			form: {servers, shards},
			headers: {'Authorization': 'SDC ' + process.env.sdc}
		});
		this.sendLog('{SDC} Send stats data');
		this.sc.pushTask({code: 'sendSDC', time: 12 * 60 * 60 * 1000});
	};

	/**
	 * @function
	 * @param {number} low
	 * @param {number} high
	 * @returns {number}
	 */
	this.randomIntInc = (low, high) => {
		return Math.floor(Math.random() * (high - low + 1) + low);
	};

	this.presenceCount = 0;
	this.presenceFunc = () => {
		switch (this.presenceCount) {
			case 0:
				client.user.setPresence({game: {name: `w.help`, type: 'WATCHING'}});
				break;
			case 1:
				client.user.setPresence({game: {name: `серверов: ${client.guilds.size}`, type: 'WATCHING'}});
				break;
			case 2:
				client.user.setPresence({game: {name: 'время', type: 'WATCHING'}});
				break;
			case 3:
				client.user.setPresence({game: {name: 'хуффингтон', type: 'STREAMING'}});
				this.presenceCount = 0;
		}
		this.presenceCount++;
		this.sc.pushTask({code: 'presence', time: 30000});
	};

	/**
	 * @function
	 * @param msg
	 * @param {string} reason
	 */
	this.retError = (msg, reason = 'Какая разница вообще?') => {
		msg.react('674326004872904733');
		let embed = new Discord.RichEmbed().setColor(this.colors.err).setTitle('Ошибка!').setDescription(reason).setFooter(msg.author.tag, msg.author.displayAvatarURL).setTimestamp();
		msg.channel.send(`<@${msg.author.id}>`, embed).then((msgErr) => msgErr.delete(10000));
	};

	/**
	 * @function
	 * @param {object} user
	 * @param {object} guild
	 * @param {object} channel
	 * @param {string} reason
	 */
	this.autowarn = (user, guild, channel, reason) => {
		client.userLib.db.insert('warns', {userId: user.id, guildId: guild.id, who: client.user.id, reason: '[AUTO] ' + reason}, () => {});

		let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.war).setTitle(`${user.tag} выдано предупреждение!`).setDescription('Причина:' + reason).setTimestamp().setFooter(client.user.tag, client.user.avatarURL);

		channel.send(embed);
		client.userLib.sendLogChannel("commandUse", guild, { user: { tag: client.user.tag, id: client.user.id, avatar: client.user.displayAvatarURL }, channel: { id: channel.id }, content: `выдача предупреждения ${user} по причине: ${reason}`});

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
		let logchannel = await this.promise(con, con.queryValue, 'SELECT logchannel FROM guilds WHERE guildId = ?', [guild.id]);
		logchannel = logchannel.res;
		if (!logchannel) return;
		let channel = guild.channels.get(logchannel);

		if (!channel) {
			con.update('guilds', {guildId: guild.id, logchannel: null}, () => { });
			return;
		}


		let now = new Date;
		let text = `[\`\`${('00' + now.getDate()).slice(-2) + '.' + ('00' + (now.getMonth() + 1)).slice(-2) + ' ' + ('00' + now.getHours()).slice(-2) + ':' + ('00' + now.getMinutes()).slice(-2) + ':' + ('00' + now.getSeconds()).slice(-2)}\`\`] `;


		if (!type) return console.warn('Error! Тип не указан');
		switch (type) {
			case 'memberAdd':
				text += `**Заход участника** <@${data.user.id}> (ID: ${data.user.id});\nАккаунт зарегистрирован __${this.moment(data.user.createdAt, 'WWW MMM DD YYYY HH:mm:ss').fromNow()}__ ||\`\`${data.user.createdAt}\`\`||;`;
				break;

			case 'memberRemove':
				text += `**Выход участника** <@${data.user.id}>;\nАккаунт зашёл на сервер __${this.moment(data.user.joinedAt, 'WWW MMM DD YYYY HH:mm:ss').fromNow()}__ ||\`\`${data.user.joinedAt}\`\`||;`;
				break;

			case 'messageDelete':
				text += `**Удаление сообщения** от <@${data.user.id}>, в канале <#${data.channel.id}>;\n${data.content.length > 1950 ? 'Сообщение больше 2k символов.' : `>>> ${data.content}`}`;
				break;

			case 'messageDeleteBulk':
				text += `**Массовое удаление сообщений** в канале <#${data.channel.id}>, было удалено __${data.size}__`;
				break;

			case 'messageUpdate':
				text += `**Изменение сообщения** от <@${data.user.id}>, в канале <#${data.channel.id}>;\n${data.oldContent.length + data.newContent.length > 1950 ? 'Сообщение больше 2k символов.' : `>>> ${data.oldContent}\n\`\`======\`\`\n${data.newContent}`}`;
				break;

			case 'voiceStateAdd':
				text += `**Подключение к каналу** от <@${data.user.id}>, канал "__${data.channel.name}__";`;
				break;

			case 'voiceStateRemove':
				text += `**Отключение от канала** от <@${data.user.id}>, канала "__${data.channel.name}__";`;
				break;

			case 'voiceStateUpdate':
				text += `**Перемещение между каналами** от <@${data.user.id}>, из канала "__${data.channel.oldName}__", в канал "__${data.channel.newName}__";`;
				break;

			case 'commandUse':
				text += `**Действие: "${data.content}"** от <@${data.user.id}>, в канале <#${data.channel.id}>;`;
				break;

			default:
				text += `Страшно. Очень страшно. Мы не знаем что это такое. Если бы мы знали что это такое, но мы не знаем что это такое.;`;
		}


		channel.send(text).catch(err => console.log(`\nОшибка!\nТекст ошибки: ${err}`));
	};
};
