import logger from '../utils/logger.js';

export default function (client, rateLimitInfo) {
	if (!rateLimitInfo.limit) logger(`RateLimit! - ${rateLimitInfo.path}`, 'rateLimit.js');
}
