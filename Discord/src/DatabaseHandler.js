import path from 'node:path';
import pkg from 'mysql2/promise';
const { mysql } = pkg;
import { resolveAPU } from '@lib/resolveAPU.js';

const configPath = resolveAPU('@src/ConfigHandler.js', 'path');
const { ConfigHandler } = await import(configPath);

class DatabaseHandler {
	constructor() {
		const configHandler = new ConfigHandler();
		const dbData = configHandler.getConfigValue('db_settings');

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

	async queryDatabase(query, values = []) {
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
