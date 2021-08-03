const Discord = require('discord.js'),
	client = new Discord.Client(),
	{ readdir, lstatSync } = require('fs'),
	func = require('./func');
let con = require('mysql2').createConnection({
	user: process.env.dblogin,
	password: process.env.dbpass,
	database: 'Whooves',
	host: process.env.dbhost,
	charset: 'utf8mb4',
});
con.on('error', err => {
	console.warn(err);
});
con.connect(() => {
	client.userLib.sendLog(`{DB Connected} (ID:${con.threadId})`);
});
let util = require('mysql-utilities');
util.upgrade(con);
util.introspection(con);

client.userLib = new func(Discord, client, con);
client.statistic = { executedcmd: 0, erroredcmd: 0 };

readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	files
		.filter(file => file.endsWith('.js'))
		.forEach(file => {
			try {
				const event = require(`./events/${file}`);
				client.on(file.split('.')[0], event.bind(null, client));
				delete require.cache[require.resolve(`./events/${file}`)];
				client.userLib.sendLog(`[EVENT] "${file}" loaded.`, 'START');
			} catch (e) {
				console.warn(e);
				client.userLib.sendLog(`[EVENT] Loading failed "${file}".`, 'START');
			}
		});
});

client.ws.on('INTERACTION_CREATE', async interaction => {
	let args, cmd, command;

	switch (interaction.type) {
		case 1:
			console.log('Ping?');
			break;
		case 2:
			cmd = client.commands.get(interaction.data.name);

			// if (cmd.help.hide) return client.userLib.retError(interaction, 'Команда в данный момент отключена!');

			if (!interaction.hasOwnProperty('guild_id') && !cmd.help.dm) {
				client.userLib.retError(interaction, 'Команда не доступна для использования в ЛС.');
				return;
			}
			// if (
			// 	cmd.help.tier &&
			// 	!client.userLib.checkPerm(
			// 		cmd.help.tier,
			// 		msg.channel.type === 'dm'
			// 			? { ownerID: msg.author.id, member: msg.author }
			// 			: { ownerID: msg.guild.ownerID, member: msg.member }
			// 	)
			// ) {
			// 	client.userLib.retError(interaction, 'Недостаточно прав!');
			// 	return;
			// }

			// if (!client.userLib.admins.hasOwnProperty(msg.author.id)) {
			// 	if (!client.userLib.cooldown.has(cmd.help.name)) {
			// 		client.userLib.cooldown.set(cmd.help.name, new Map());
			// 	}
			//
			// 	const now = Date.now();
			// 	const times = client.userLib.cooldown.get(cmd.help.name);
			// 	if (times.has(msg.author.id)) {
			// 		let expirationTime = times.get(msg.author.id) + cmd.help.cooldown * 1000;
			// 		if (now <= expirationTime) {
			// 			let timeLeft = (expirationTime - now) / 1000;
			// 			client.userLib.retError(
			// 				msg,
			// 				`Убери копыта от клавиатуры, пожалуйста.\nУспокойся, досчитай до \`\`${Math.round(
			// 					timeLeft
			// 				)}\`\` и попробуй снова!`
			// 			);
			// 			client.userLib.sendLog(
			// 				`Try use: ${command}, Time left: ${timeLeft}, By: @${msg.author.tag}(${msg.author.id}), In: ${msg.guild.name}(${msg.guild.id}) => #${msg.channel.name}(${msg.channel.id})`,
			// 				'Info'
			// 			);
			// 			return;
			// 		}
			// 	}
			//
			// 	times.set(msg.author.id, now);
			//
			// 	client.userLib.sc.pushTask({ code: 'unCooldown', time: cmd.help.cooldown * 1000, params: [times, msg.author.id] });
			// }

			if (interaction.data.hasOwnProperty('options'))
				interaction.data.options = client.userLib.interactionOpt(interaction);
			// try {
			client.userLib.sendLog(
				client.userLib.generateUseLog(interaction.hasOwnProperty('guild_id'), cmd.help.name, interaction),
				'Info'
			);
			await cmd.run(client, interaction);
			client.statistic.executedcmd++;
			// } catch (err) {
			// 	client.userLib.sendLog(client.userLib.generateErrLog(msg.channel.type, cmd.help.name, msg, err), 'ERROR!');
			// 	client.userLib.sendWebhookLog(client.userLib.generateErrLog(msg.channel.type, cmd.help.name, msg, err));
			// 	client.userLib.retError(msg, 'Произошло исключение в работе команды!');
			// 	client.statistic.erroredcmd++;
			// }
			break;

		case 3:
			args = client.userLib.AESdecrypt(interaction.data['custom_id']).split(':');

			if (!interaction.member) {
				interaction.member = {};
				interaction.member.user = interaction.user;
			}

			if (args[1] !== interaction.member.user.id) return;

			command = args[0];
			cmd = client.commands.get(command);
			if (!cmd || !cmd.help.interactions) return;

			cmd.interaction(client, interaction, args);
			client.userLib.sendLog(client.userLib.generateUseLog('interaction', cmd.help.name, interaction), 'Info');
			break;
	}
});

client.commands = new Discord.Collection();

readdir('./commands/', (error, directories) => {
	if (error) return console.warn(error);
	directories
		.filter(dir => lstatSync(`./commands/${dir}`).isDirectory())
		.forEach(module => {
			client.userLib.sendLog(`[MODULE] "${module}" module found.`, 'START');
			readdir(`./commands/${module}/`, (err, files) => {
				if (err) return console.error(err);
				files
					.filter(file => file.endsWith('.js'))
					.forEach(file => {
						try {
							const props = require(`./commands/${module}/${file}`);
							if (!props.help.hide) {
								props.help.module = module;
								client.commands.set(file.split('.')[0], props);
							}
							client.userLib.sendLog(`[COMMAND] "${module}/${file}" loaded.`, 'START');
						} catch (e) {
							console.warn(e);
							client.userLib.sendLog(`[COMMAND] Loading failed "${file}".`, 'START');
						}
					});
			});
		});
});

client.login(process.env.token);
