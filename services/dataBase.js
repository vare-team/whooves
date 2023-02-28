import mysql2 from 'mysql2';
import logger from '../utils/logger.js';

const db = mysql2.createConnection({
	user: process.env.DB_LOGIN,
	password: process.env.DB_PASS,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	charset: 'utf8mb4',
	keepAliveInitialDelay: 7 * 60 * 1000,
	enableKeepAlive: true,
});

db.on('error', err => {
	if (err.code === 'ECONNRESET' || err.code === 'PROTOCOL_CONNECTION_LOST') db.connect();
	logger(err, 'dataBase', 'Warning');
});

db.connect(err => {
	if (err) return console.error(`Error connecting: ${err.stack}`);
	db.query('SET SESSION wait_timeout = 604800');
	logger(`Connected! (ID:${db.threadId})`, 'dataBase');
});

export default {
	query: db.promise().query.bind(db.promise()),

	async many(...args) {
		const query = await db.promise().query(...args);
		return query[0];
	},

	async one(...args) {
		const query = await db.promise().query(...args);
		return query[0][0];
	},
};
