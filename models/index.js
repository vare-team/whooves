import { Sequelize } from 'sequelize';
import Guild from './guild.js';
import User from './user.js';
import Warn from './warn.js';

const { DB_NAME, DB_USER, DB_PWD, DB_HOST } = process.env;

export const models = {
	Guild,
	User,
	Warn,
};

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PWD, {
	host: DB_HOST,
	dialect: 'mariadb',
	// dialectOptions: { multipleStatements: true },
	define: {
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		timestamps: true,
		underscored: true,
		paranoid: false,
	},
	logging: false,
});

export default { sequelize, models };
