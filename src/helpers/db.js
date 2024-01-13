import { Pool } from "pg"
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST
});

const connectDatabase = async () => {
    try {
        await pool.connect();
        console.log('PostgreSQL database connected');
    } catch (err) {
        console.error('Error connecting to PostgreSQL database', err);
    }
}

connectDatabase();
export { pool };