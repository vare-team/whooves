module.exports = (client, msgs) => {
	client.userLib.sendLogChannel('messageDeleteBulk', msgs.first().guild, {
		user: {
			tag: 'NullPony#0000',
			id: '',
			avatar: client.user.defaultAvatarURL,
		},
		channel: { id: msgs.first().channel.id },
		size: msgs.size,
	});
};
