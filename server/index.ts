/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Express } from "express";
import dotenv from "dotenv";
import connectMongoDBSession from "connect-mongodb-session";
import session from "express-session";
import mongoFuncs from "./modules/mongoDB";
import encrypts from "./modules/encryption"

const app: Express = express();
app.use(express.static("public"));

const MongoDBStore = connectMongoDBSession(session);

const SECRET: string = encrypts.permanentEncryptPassword(encrypts.generateRandomNumber(256, "alphanumeric"))

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoDBStore({
        uri: process.env.MONGO_URI,
        databaseName: process.env.CLIENT_DB,
        collection: "SchedulesUsers",
        expires: 1000 * 60 * 60 * 24 * 7, // 1 week
        autoRemove: "interval",
        autoRemoveInterval: 1000 /* Milliseconds */ * 10 /* Seconds */
    })
}))

// DotENV Credentials
dotenv.config({ path: "./server/credentials.env" });

const PORT = process.env.PORT || 3001;

try {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.error(`Error starting server: ${error}`);
    throw new Error(error);
}