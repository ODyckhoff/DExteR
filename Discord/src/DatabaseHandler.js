import path from 'node:path';
import mysql from 'mysql2/promise';
import { resolveAPU } from '@lib/resolveAPU.js';

const configPath = resolveAPU('@src/ConfigHandler.js', 'path');
const { ConfigHandler } = await import(configPath);

class DatabaseHandler {
	constructor() {
		this.init();
	}

	async init() {
		const configHandler = new ConfigHandler();
		const dbData = await configHandler.getConfigValue('db_settings');

		try {
			this.pool = mysql.createPool({
				host: dbData.dbhost,
				user: dbData.dbuser,
				password: dbData.dbpass,
				database: dbData.dbname,
				waitForConnections: true,
				connectionLimit: 10,
				queueLimit: 0
			});
		}
		catch (error) {
			console.error(`Error connecting to Database: ${error}`);
		}
	}

	queryDatabase = async (query, values = []) => {
		while(!this.pool) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}
		const connection = await this.pool.getConnection();
		try {
			const [rows] = await connection.execute(query, values);
			return rows;
		}
		catch (error) {
			console.error(`Error querying database: ${error}`);
		}
		finally {
			connection.release();
		}
	}
}

export { DatabaseHandler };
