/* eslint-disable @typescript-eslint/no-unused-vars */
// Libraries
import connectMongoDBSession from "connect-mongodb-session";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import encrypts from "./modules/encryption.ts";
import mongoFuncs from "./modules/mongoDB.ts";
import { CLIENT_DB, SERVER_PORT, CLIENT_ID, CLIENT_SECRET } from "./configs/env.ts";
import "./configs/db.ts";

// Express Initialization
const app: Express = express();
//app.use(express.static("public"));

//Library Initialization
app.use(express.json());
app.use(cors());
app.set('trust proxy', true);

const SECRET: string = encrypts.permanentEncryptPassword(encrypts.generateRandomNumber(256, "alphanumeric"))

// MongoDB Credentials
const MongoDBStore = connectMongoDBSession(session);

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoDBStore({
        uri: process.env.MONGODB_URI!,
        collection: "SchedulesUsers",
        expires: 1000 * 60 * 60 * 24 * 7, // 1 week
        databaseName: CLIENT_DB,
        idField: "_id",
        expiresKey: "sessionTime",
        expiresAfterSeconds: 1000 * 60 * 60 * 24 * 7 // 1 week
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3.5, // 3.5 days
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

// Google OAuth2 Credentials
passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req: Request, res: Response) => {
    res.redirect("/home");
});

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});

process.on("SIGINT", async () => {
    console.log("Shutting down server...");

    await mongoFuncs.deleteFromDatabase({}, "SchedulesUsers", "many", true)

    await mongoose.connection.close();

    process.exit();
});