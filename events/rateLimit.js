module.exports = (client, rateLimitInfo) => {
	client.userLib.sendLog(`RateLimit! - ${rateLimitInfo.path}`);
};