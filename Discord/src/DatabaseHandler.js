import path from 'node:path';
import pkg from 'mysql2/promise';
const { mysql } = pkg;

const configPath = path.join(global.__rootdir, 'src/ConfigHandler.js');
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
