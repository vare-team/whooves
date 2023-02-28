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
export async function sendLogChannel(type, guild, data) {
	let logchannel = await this.promise(con, con.queryValue, 'SELECT logchannel FROM guilds WHERE guildId = ?', [
		guild.id,
	]);
	logchannel = logchannel.res;
	if (!logchannel) return;
	const channel = guild.channels.cache.get(logchannel);

	if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
		con.update('guilds', { guildId: guild.id, logchannel: null }, () => {});
		return;
	}

	const now = new Date();
	let text = `[<t:${Math.floor(now / 1000)}:R>] `;

	if (!type) return console.warn('Error! Тип не указан');
	switch (type) {
		case 'memberAdd':
			text += `📈 **Заход участника** ${data.user.tag} (ID: ${data.user.id});\nАккаунт зарегистрирован <t:${data.user.createdAt}:R>;`;
			break;

		case 'memberRemove':
			text += `📉 **Выход участника** ${data.user.tag}  (ID: ${data.user.id});\nАккаунт зашёл на сервер <t:${data.user.joinedAt}:R>`;
			break;

		case 'messageDelete':
			text += `✂ **Удаление сообщения** от ${data.user.tag}  (ID: ${data.user.id}), в канале <#${data.channel.id}>;\n${
				data.content.length > 1950 ? 'Сообщение больше 2k символов.' : `>>> ${data.content}`
			}`;
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
}
