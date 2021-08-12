exports.help = {
	name: 'Unshorter',
	description: 'Рассократитель ссылок',
};

exports.command = {
	name: exports.help.name,
	type: 3,
};

const urlFinder = new RegExp(
	/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
);

exports.run = async (client, interaction) => {
	await interaction.deferReply({ ephemeral: true });
	const url = interaction.options.getMessage('message').content.match(urlFinder);
	if (url === null) return client.userLib.retError(interaction, 'Ссылка не найдена!');

	let body = await client.userLib.request(`https://unshorten.me/s/${url}`, {
		json: true,
	});

	interaction.editReply({ content: body, ephemeral: true });
};
