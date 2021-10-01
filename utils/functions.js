const schedule = require('./schedule');
const { ru2en, en2ru } = require('../models/keyTranslator');
const permissionsArrayTranslator = require('../models/permissionsArrayTranslator');

/**
 * Generate userLib.
 * @module
 * @param Discord
 * @param client - Discord client
 * @param con - mysql connection
 */
module.exports = function (Discord, client, con) {
	if (process.env.webhookId && process.env.webhookToken)
		this.webhook = new Discord.WebhookClient(process.env.webhookId, process.env.webhookToken);

	this.presenceCount = 0;
	this.presenceFunc = () => {
		switch (this.presenceCount) {
			case 0:
				client.user.setPresence({ activity: { name: `w.help`, type: 'WATCHING' } });
				break;
			case 1:
				client.user.setPresence({ activity: { name: `серверов: ${client.guilds.cache.size}`, type: 'WATCHING' } });
				break;
			case 2:
				client.user.setPresence({ activity: { name: 'время', type: 'WATCHING' } });
				break;
			case 3:
				client.user.setPresence({ activity: { name: 'хуффингтон', type: 'STREAMING' } });
				this.presenceCount = 0;
		}
		this.presenceCount++;
		this.sc.pushTask({ code: 'presence', time: 30000 });
	};

	/**
	 * @function
	 * @param {string} log
	 * @param {string} type
	 */
	this.sendLog = (log = 'Clap one hand', type = 'Auto') => {
		const now = new Date();
		console.log(
			`${
				('00' + now.getDate()).slice(-2) +
				'.' +
				('00' + (now.getMonth() + 1)).slice(-2) +
				' ' +
				('00' + now.getHours()).slice(-2) +
				':' +
				('00' + now.getMinutes()).slice(-2) +
				':' +
				('00' + now.getSeconds()).slice(-2)
			} | Shard[${client.shard.ids}] | {${type}} : ${log}`
		);
	};

	/**
	 * @function
	 * @param {string} content
	 */
	this.sendWebhookLog = (content = 'Clap one hand') => {
		if (!this.webhook) return;

		const now = new Date();

		this.webhook.send(`<t:${Math.floor(now.getTime() / 1000)}:T> | Shard[${client.shard.ids}] | : ${content}`);
	};

	this.badWords = require('../models/badwords.js');

	this.correctorList = require('../models/corrector.js');

	this.admins = {
		'321705723216134154': 0,
		'166610390581641217': 0,
	};

	this.colors = {
		err: '#F04747',
		suc: '#43B581',
		inf: '#3492CC',
		war: '#FAA61A',
	};

	this.emoji = {
		load: '<a:load:793027778554888202>',
		ready: '<a:checkmark:674326004252016695>',
		err: '<a:error:674326004872904733>',
		readyObj: { id: '849711299020849243', name: 'em1', animated: false },
		errObj: { id: '849711300082401310', name: 'em', animated: false },
	};

	this.discord = Discord;
	this.db = con;

	this.request = require('request-promise-native');

	this.moment = require('moment');
	this.moment.locale('ru');

	this.crypt = require('crypto-js');

	this.cooldown = new Map();

	this.promise = require('./promise');
	this.sc = new schedule(this.sendLog);

	const { createCanvas, loadImage } = require('canvas');
	this.createCanvas = createCanvas;
	this.loadImage = loadImage;

	this.settings = {
		badwords: 0x1,
		usernamechecker: 0x2,
	};

	this.nicknameReplacerFirst = /^[^A-Za-zА-Яа-я]+/;
	this.nicknameReplacer = /[^0-9A-Za-zА-Яа-яЁё .|-]/g;
	this.mentionDetect = /@everyone|@here/gm;

	this.nicknameParts = {
		prefixes: ['A', 'Ex', 'Im', 'Il', 'In', 'Ret', 'Un', 'De', 'Int'],
		root: ['bler', 'ses', 'wis', 'let', 'ger', 'mon', 'lot', 'far'],
		suffixes: ['er', 'or', 'an', 'ian', 'ist', 'ant', 'ee', 'ess', 'ent', 'ity', 'ance', 'ion', 'dom', 'th'],
	};

	/**
	 * @function
	 * @param {Array} args
	 * @returns {string}
	 */
	this.AEScrypt = (args = []) => {
		return this.crypt.AES.encrypt(args.join(':'), process.env.secret).toString();
	};

	/**
	 * @function
	 * @param {string} string
	 * @returns {string}
	 */
	this.AESdecrypt = (string = '') => {
		return this.crypt.AES.decrypt(string, process.env.secret).toString(this.crypt.enc.Utf8);
	};

	/**
	 * @function
	 * @param {number} ms
	 * @returns {Promise<unknown>}
	 */
	this.delay = ms => {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	/**
	 * @function
	 * @param {string} str
	 * @param {string} mode
	 * @returns {string}
	 */
	this.translate = (str = '', mode) => {
		if (mode === 'en2ru') {
			return str.replace(/[A-z/,.;?&'`~}{\]\[]/g, x => {
				return x === x.toLowerCase() ? en2ru[x] : en2ru[x.toLowerCase()].toUpperCase();
			});
		} else if (mode === 'ru2en') {
			return str.replace(/[А-я.?,]/g, x => {
				return x === x.toLowerCase() ? ru2en[x] : ru2en[x.toLowerCase()].toUpperCase();
			});
		}
	};

	/**
	 * @function
	 * @param {number} tier
	 * @param {Object} data
	 * @returns {boolean}
	 */
	this.checkPerm = (tier, data) => {
		if (this.admins.hasOwnProperty(data.member.id) && this.admins[data.member.id] == 0) return true;
		if (this.admins.hasOwnProperty(data.member.id) && tier < 0 && tier > this.admins[data.member.id]) return true;
		if (tier == -3 && data.ownerID == data.member.id) return true;
		if (tier == -2 && data.member.hasPermission('ADMINISTRATOR')) return true;
		return tier == -1 && data.member.hasPermission('MANAGE_MESSAGES');
	};

	/**
	 * @function
	 * @param {Array} array
	 * @returns {Array}
	 */
	this.permissionsArrayToString = (array) => {
		return array.map((el) => permissionsArrayTranslator[el]);
	};

	/**
	 * @function
	 * @param {string} type
	 * @param {string} command
	 * @param {object} interaction
	 * @return {string}
	 */
	this.generateUseLog = (type, command, interaction) => {
		switch (interaction.type) {
			case 'APPLICATION_COMMAND':
				return `Use: ${command}, By: @${interaction.user.username}#${interaction.user.discriminator}(${interaction.user.id}), ${
					interaction.guildId !== undefined ? `Guild ID: ${interaction.guildId}` : 'DM'
				} => #${interaction.channelId}`;

			case 'MESSAGE_COMPONENT':
				return `Interaction: ${command}, By: @${interaction.user.username}#${interaction.user.discriminator}(${interaction.user.id}), ${
					interaction.guildId !== undefined ? `Guild ID: ${interaction.guildId}` : 'DM'
				} => ${interaction.channelId}, custom_id: "${interaction.data.custom_id}"(${this.AESdecrypt(
					interaction.data.custom_id
				)})`;
		}
	};

	/**
	 * @function
	 * @param {boolean} inGuild
	 * @param {string} command
	 * @param {object} interaction
	 * @param {string} err
	 * @returns {string}
	 */
	this.generateErrLog = (inGuild, command, interaction, err) => {
		if (inGuild) {
			return `Ошибка!\n! Команда - ${command}\n! Сервер: ${interaction.guild.name} (ID: ${interaction.guild.id})\n! Канал: ${interaction.channel.name} (ID: ${interaction.channel.id})\n! Пользователь: ${interaction.user.tag} (ID: ${interaction.user.id})\n! Текст ошибки: ${err}`;
		} else {
			return `Ошибка!\n! Команда - ${command}\n! Пользователь: ${interaction.user.tag} (ID: ${interaction.user.id})\n! Текст ошибки: ${err}`;
		}
	};

	/**
	 * @function
	 * @param {number} servers
	 * @param {number} shards
	 */
	this.sendSDC = (servers = client.guilds.cache.size, shards = client.shard.count) => {
		this.sendLog(`{SDC} Guilds: ${servers}, Shards: ${shards}`);
		this.request({
			method: 'POST',
			url: 'https://api.server-discord.com/v2/bots/' + client.user.id + '/stats',
			form: { servers, shards },
			headers: { Authorization: 'SDC ' + process.env.sdc },
		});
		this.sendLog('{SDC} Send stats data');
		this.sc.pushTask({ code: 'sendSDC', time: 12 * 60 * 60 * 1000 });
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

	/**
	 * @function
	 * @param interaction
	 * @param {string} reason
	 */
	this.retError = (interaction, reason = 'Какая разница вообще?') => {
		let embed = new Discord.MessageEmbed()
			.setColor(this.colors.err)
			.setDescription( this.emoji.err + ' **Ошибка:** ' + reason);

		if (interaction.deferred) interaction.editReply({ embeds: [embed], ephemeral: true });
		else interaction.reply({ embeds: [embed], ephemeral: true });
	};

	/**
	 * @function
	 * @param interaction
	 * @param {string} reason
	 */
	this.retSuccess = (interaction, reason = 'Какая разница вообще?') => {
		let embed = new Discord.MessageEmbed()
			.setColor(this.colors.suc)
			.setDescription( this.emoji.ready + ' ' + reason);

		if (interaction.deferred) interaction.editReply({ embeds: [embed] });
		else interaction.reply({ embeds: [embed] });
	};

	/**
	 * @function
	 * @param {object} user
	 * @param {object} guild
	 * @param {object} channel
	 * @param {string} reason
	 */
	this.autowarn = (user, guild, channel, reason) => {
		con.insert(
			'warns',
			{ userId: user.id, guildId: guild.id, who: client.user.id, reason: '[AUTO] ' + reason },
			(err, id) => {
				con.query('SELECT COUNT(*) FROM warns WHERE userId = ? AND guildId = ?', [user.id, guild.id], (err, count) => {
					let embed = new Discord.MessageEmbed()
						.setColor(this.colors.war)
						.setTitle(`${user.tag} выдано предупреждение!`)
						.setDescription(
							`Причина: **${reason ? reason : 'Не указана'}**\nВсего предупреждений: **${
								count[0]['COUNT(*)']
							}**\nID предупреждения: **${id}**`
						)
						.setTimestamp()
						.setFooter(client.user.tag, client.user.displayAvatarURL());
					channel.send(embed);

					this.sendLogChannel('commandUse', guild, {
						user: { tag: client.user.tag, id: client.user.id, avatar: client.user.displayAvatarURL() },
						channel: { id: channel.id },
						content: `выдача предупреждения (ID: ${id}) ${user} по причине: ${reason}`,
					});
				});
			}
		);
	};

	/**
	 * @function
	 * @param {string} guildId
	 * @param {string} setNumber
	 * @returns {boolean}
	 */
	this.checkSettings = async (guildId, setNumber) => {
		let setting = await con.promise().query('SELECT settings FROM guilds WHERE guildId = ?', [guildId]);
		setting = setting[0][0].settings;

		return !!(this.settings[setNumber] & setting);
	};

	/**
	 * @function
	 * @param {string} guildId
	 * @param {string} setNumber
	 * @param {boolean} state
	 * @returns {boolean}
	 */
	this.setSettings = async (guildId, setNumber, state) => {
		if ((await this.checkSettings(guildId, setNumber)) === state) return false;

		con.query(`UPDATE guilds SET settings = settings ${state ? '+' : '-'} ? WHERE guildId = ?`, [
			this.settings[setNumber],
			guildId,
		]);
		return true;
	};

	/**
	 * @function
	 * @param {string} nickname
	 * @returns {boolean}
	 */
	this.isUsernameCorrect = nickname =>
		!(this.nicknameReplacerFirst.test(nickname) || this.nicknameReplacer.test(nickname));

	/**
	 * @function
	 * @param {string} nickname
	 * @returns {string}
	 */
	this.getUsernameCorrect = nickname => {
		let corrected = '';

		for (let char = 0; char < nickname.length; char++) {
			if (this.correctorList.hasOwnProperty(nickname[char])) corrected += this.correctorList[nickname[char]];
			else if (this.correctorList.hasOwnProperty(nickname[char] + nickname[char + 1]))
				corrected += this.correctorList[nickname[char] + nickname[char + 1]];
			else corrected += nickname[char];
		}

		return (
			corrected.replace(this.nicknameReplacerFirst, '').replace(this.nicknameReplacer, '') || this.getRandomNickname()
		);
	};

	/**
	 * @function
	 * @returns {string}
	 */
	this.getRandomNickname = () => {
		return (
			this.nicknameParts.prefixes[this.randomIntInc(0, this.nicknameParts.prefixes.length - 1)] +
			this.nicknameParts.root[this.randomIntInc(0, this.nicknameParts.root.length - 1)] +
			this.nicknameParts.suffixes[this.randomIntInc(0, this.nicknameParts.suffixes.length - 1)]
		);
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
		let logchannel = await this.promise(con, con.queryValue, 'SELECT logchannel FROM guilds WHERE guildId = ?', [
			guild.id,
		]);
		logchannel = logchannel.res;
		if (!logchannel) return;
		let channel = guild.channels.cache.get(logchannel);

		if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
			con.update('guilds', { guildId: guild.id, logchannel: null }, () => {});
			return;
		}

		let now = new Date();
		let text = `[\`\`${
			('00' + now.getDate()).slice(-2) +
			'.' +
			('00' + (now.getMonth() + 1)).slice(-2) +
			' ' +
			('00' + now.getHours()).slice(-2) +
			':' +
			('00' + now.getMinutes()).slice(-2) +
			':' +
			('00' + now.getSeconds()).slice(-2)
		}\`\`] `;

		if (!type) return console.warn('Error! Тип не указан');
		switch (type) {
			case 'memberAdd':
				text += `📈 **Заход участника** ${data.user.tag} (ID: ${
					data.user.id
				});\nАккаунт зарегистрирован __${this.moment(
					data.user.createdAt,
					'WWW MMM DD YYYY HH:mm:ss'
				).fromNow()}__ ||\`\`${data.user.createdAt}\`\`||;`;
				break;

			case 'memberRemove':
				text += `📉 **Выход участника** ${data.user.tag}  (ID: ${
					data.user.id
				});\nАккаунт зашёл на сервер __${this.moment(
					data.user.joinedAt,
					'WWW MMM DD YYYY HH:mm:ss'
				).fromNow()}__ ||\`\`${data.user.joinedAt}\`\`||;`;
				break;

			case 'messageDelete':
				text += `✂ **Удаление сообщения** от ${data.user.tag}  (ID: ${data.user.id}), в канале <#${
					data.channel.id
				}>;\n${data.content.length > 1950 ? 'Сообщение больше 2k символов.' : `>>> ${data.content}`}`;
				break;

			case 'messageDeleteBulk':
				text += `✂📂 **Массовое удаление сообщений** в канале <#${data.channel.id}>, было удалено __${data.size}__`;
				break;

			case 'messageUpdate':
				text += `✏ **Изменение сообщения** ${data.user.tag}  (ID: ${data.user.id}), в канале <#${data.channel.id}>;\n${
					data.oldContent.length + data.newContent.length > 1950
						? 'Сообщение больше 2k символов.'
						: `>>> ${data.oldContent}\n\`\`======\`\`\n${data.newContent}`
				}`;
				break;

			case 'voiceStateAdd':
				text += `☎ **Подключение к каналу** ${data.user.tag}  (ID: ${data.user.id}), канал "__${data.channel.name}__";`;
				break;

			case 'voiceStateRemove':
				text += `☎ **Отключение от канала** ${data.user.tag}  (ID: ${data.user.id}), канала "__${data.channel.name}__";`;
				break;

			case 'voiceStateUpdate':
				text += `☎ **Перемещение между каналами** ${data.user.tag}  (ID: ${data.user.id}), из канала "__${data.channel.oldName}__", в канал "__${data.channel.newName}__";`;
				break;

			case 'commandUse':
				text += `🔨 **Действие: "${data.content}"** от ${data.user.tag}  (ID: ${data.user.id}), в канале <#${data.channel.id}>;`;
				break;

			default:
				text += `Страшно. Очень страшно. Мы не знаем что это такое. Если бы мы знали что это такое, но мы не знаем что это такое.;`;
		}

		channel.send(text).catch(err => console.log(`\nОшибка!\nТекст ошибки: ${err}`));
	};
};