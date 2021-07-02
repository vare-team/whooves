module.exports = (client, rateLimitInfo) => {
	if (!rateLimitInfo.limit) client.userLib.sendLog(`RateLimit! - ${rateLimitInfo.path}`);
};
