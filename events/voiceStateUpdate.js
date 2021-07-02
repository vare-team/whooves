module.exports = async (client, oldState, newState) => {
	if (!oldState.channel) {
		client.userLib.sendLogChannel('voiceStateAdd', newState.guild, {
			user: { tag: newState.member.user.tag, id: newState.member.id, avatar: newState.member.user.displayAvatarURL() },
			channel: { name: newState.channel.name },
		});
	}

	if (!newState.channel) {
		client.userLib.sendLogChannel('voiceStateRemove', oldState.guild, {
			user: { tag: oldState.member.user.tag, id: oldState.member.id, avatar: oldState.member.user.displayAvatarURL() },
			channel: { name: oldState.channel.name },
		});
	}

	if (oldState.channel && newState.channel && oldState.channelID != newState.channelID) {
		client.userLib.sendLogChannel('voiceStateUpdate', oldState.guild, {
			user: { tag: oldState.member.user.tag, id: oldState.member.id, avatar: oldState.member.user.displayAvatarURL() },
			channel: { oldName: oldState.channel.name, newName: newState.channel.name },
		});
	}
};
