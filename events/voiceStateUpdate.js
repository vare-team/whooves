import { sendLogChannel } from '../services/guild-log.js';

/**
 *
 * @param oldState {VoiceState}
 * @param newState {VoiceState}
 * @return {Promise<undefined|*>}
 */
export default async function (oldState, newState) {
	if (!oldState.channel) {
		await sendLogChannel('voiceStateAdd', newState.guild, {
			user: { tag: newState.member.user.tag, id: newState.member.id, avatar: newState.member.user.displayAvatarURL() },
			channel: { name: newState.channel.name },
		});
	}

	if (!newState.channel) {
		await sendLogChannel('voiceStateRemove', oldState.guild, {
			user: { tag: oldState.member.user.tag, id: oldState.member.id, avatar: oldState.member.user.displayAvatarURL() },
			channel: { name: oldState.channel.name },
		});
	}

	if (oldState.channel && newState.channel && oldState.channelId !== newState.channelId) {
		await sendLogChannel('voiceStateUpdate', oldState.guild, {
			user: { tag: oldState.member.user.tag, id: oldState.member.id, avatar: oldState.member.user.displayAvatarURL() },
			channel: { oldName: oldState.channel.name, newName: newState.channel.name },
		});
	}
}
