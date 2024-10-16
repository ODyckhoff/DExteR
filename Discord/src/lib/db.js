import { createPool } from 'mysql2/promise';

let pool;

async function connectToDatabase(dbHost, dbUser, dbPassword, dbName) {
    if (!pool) {
        try {
            pool = createPool({
                host: dbHost,
                user: dbUser,
                password: dbPassword,
                database: dbName,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        }
        catch (error) {
            console.error(`DB fucked up: ${error}`);
        }
    }
}

async function queryDatabase(query, values = []) {
    await connectToDatabase();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(query, values);
        return rows;
    }
    catch (error) {
        console.error('Error querying database: ', error);
    }
    finally {
        connection.release();
    }
}

export default {
    queryDatabase,
}
