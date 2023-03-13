import { sendLogChannel } from '../utils/modules/guildLog.js';

/**
 *
 * @param oldState {VoiceState}
 * @param newState {VoiceState}
 * @return {Promise<undefined|*>}
 */
export default function (oldState, newState) {
	if (!oldState.channel) {
		return sendLogChannel('voiceStateAdd', newState.guild, {
			user: { tag: newState.member.user.tag, id: newState.member.id, avatar: newState.member.user.displayAvatarURL() },
			channel: { name: newState.channel.name },
		});
	}

	if (!newState.channel) {
		return sendLogChannel('voiceStateRemove', oldState.guild, {
			user: { tag: oldState.member.user.tag, id: oldState.member.id, avatar: oldState.member.user.displayAvatarURL() },
			channel: { name: oldState.channel.name },
		});
	}

	if (oldState.channel && newState.channel && oldState.channelId !== newState.channelId) {
		return sendLogChannel('voiceStateUpdate', oldState.guild, {
			user: { tag: oldState.member.user.tag, id: oldState.member.id, avatar: oldState.member.user.displayAvatarURL() },
			channel: { oldName: oldState.channel.name, newName: newState.channel.name },
		});
	}
}
