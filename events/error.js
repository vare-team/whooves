import logger from '../utils/logger.js';

export default function (client, error) {
	logger(`Ошибка - ${error.message}`, 'error.js');
}
