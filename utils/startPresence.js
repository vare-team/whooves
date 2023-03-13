let started = false;
/**
 *
 * @param client {Client}
 * @return {ClientPresence | void}
 */
export default function (client) {
	if (started) return;
	started = true;
	return client.user.setPresence({});
}
