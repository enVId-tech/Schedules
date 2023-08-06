import dotenv from 'dotenv';

dotenv.config({ path: './server/configs/credentials.env.local' });

const URI: string = process.env.MONGODB_URI! || 'null';
const CLIENT_DB: string = process.env.CLIENT_DB! || 'null';
const CLIENT_ID: string = process.env.CLIENT_ID! || 'null';
const APP_HOSTNAME: string = process.env.APP_HOSTNAME! || "localhost";
const SERVER_PORT: number = parseInt(process.env.SERVER_PORT!) || 3001;
const CLIENT_PORT: number = parseInt(process.env.CLIENT_PORT!) || 3000;
const CLIENT_SECRET: string = process.env.CLIENT_SECRET || 'null';

export {
    URI,
    CLIENT_DB,
    CLIENT_ID,
    APP_HOSTNAME,
    SERVER_PORT,
    CLIENT_PORT,
    CLIENT_SECRET
}