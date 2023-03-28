import logger from '../utils/logger.js';

export default function (error) {
	logger(`Ошибка - ${error.message}`, 'core');
}
