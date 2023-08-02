/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectMongoDBSession from "connect-mongodb-session";
import session from "express-session";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import passport from "passport";
import mongoFuncs from "./modules/mongoDB";
import encrypts from "./modules/encryption"
import mongoose from "mongoose";

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

app.use(passport.initialize());
app.use(passport.session());

// DotENV Credentials
dotenv.config({ path: "./server/credentials.env" });

// Globals
var loggedIn: boolean = false;
var tempDataIDNum: number = 0;
var mainServerAuthTag: string = "";

// Server Ports
const PORT = process.env.PORT || 3001;
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const CLIENT_URL = `http://localhost:${CLIENT_PORT}`;

// Google OAuth2 Credentials
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

// App hostname
const APP_HOSTNAME = process.env.HOSTNAME || "localhost";

// Requests for the main server
passport.serializeUser((user: any, done) => {
    done(null, user);
});

passport.deserializeUser((user: any, done) => {
    done(null, user);
});

// Google OAuth2 Page
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `http://${APP_HOSTNAME}:${PORT}/auth/google/callback`
},
    (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }
));

// User Data Interface
interface UserData {
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    hd: string;
    hasSchedule: boolean;
    schedule: object;
    siteUsername: string;
    sitePassword: string;
    settings: object;
    dataIDNum: number;
    sessionTime: number;
}

// Google Login Page
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }),
    async (req: any, res: any) => {
        try {
            const userProfile: any = req.user;

            const validStudentIDS: string[] = ["1069869", "1071039"];
            const validEmailDomains: string[] = ["@student.auhsd.us"];

            if (validStudentIDS.includes(userProfile["id"]) && validEmailDomains.includes(userProfile["emails"][0]["value"].slice(-17))) {
                const randomNumber: string = encrypts.generateRandomNumber(256, "alphanumeric");

                const fileData: string = await mongoFuncs.getItemsFromDatabase("SchedulesUsers", true);
                const fileDataJSON: any = JSON.parse(fileData);

                const userExists: boolean = fileDataJSON.some((user: any) => user["id"] === userProfile["id"]);

                if (!userExists) {
                    const userData: UserData = {
                        displayName: userProfile["displayName"],
                        firstName: userProfile["name"]["givenName"],
                        lastName: userProfile["name"]["familyName"],
                        email: userProfile["emails"][0]["value"],
                        profilePicture: userProfile["photos"][0]["value"],
                        hd: userProfile["_json"]["hd"],
                        hasSchedule: false,
                        schedule: {
                            "Period 1": "",
                            "Period 2": "",
                            "Period 3": "",
                            "Period 4": "",
                            "Period 5": "",
                            "Period 6": "",
                            "Period 7": "",
                            "Period 8": "",
                        },
                        siteUsername: "",
                        sitePassword: "",
                        settings: {
                            theme: "dark",
                            schedule: "public",
                            permissions: "private", // private, public, friends
                            friends: [],
                            isLoggedIn: true,
                            isTerminated: false,
                            latestIP: encrypts.encryptIP(req.ip),
                            
                        },
                        dataIDNum: fileDataJSON.length,
                        sessionTime: 1000 * 60 * 60 * 24 * 3.5 // 3.5 days
                    }

                    await mongoFuncs.writeToDatabase(userData, "SchedulesUsers", true);

                    req.session.user = userData;
                    req.session.save();

                    loggedIn = true;

                    res.redirect(`${CLIENT_URL}/dashboard/${randomNumber}`);
                } else {
                    
                }
            }
        } catch (error) {
            console.error(`Error authenticating user: ${error}`);
            throw new Error(error);
        }
    }
);

try {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.error(`Error starting server: ${error}`);
    throw new Error(error);
}

process.on("SIGINT", async () => {
    console.log("Shutting down server...");

    await mongoFuncs.deleteFromDatabase({}, "SchedulesUsers", "many", true)

    // Close the database connection if it is open
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
    }

    process.exit();
});