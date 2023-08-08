/* eslint-disable @typescript-eslint/no-unused-vars */
// Libraries
import connectMongoDBSession from "connect-mongodb-session";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "./configs/db.ts";
import { CLIENT_DB, CLIENT_ID, CLIENT_SECRET, SERVER_PORT } from "./configs/env.ts";
import encrypts from "./modules/encryption.ts";
import mongoFuncs from "./modules/mongoDB.ts";

// Express Initialization
const app: Express = express();
//app.use(express.static("public"));

//Library Initialization
app.use(express.json());
app.use(cors());
app.set('trust proxy', true);

const SECRET: string = encrypts.permanentEncryptPassword(encrypts.generateRandomNumber(256, "alphanumeric"))

// Globals
var userDataID: string = "";

// MongoDB Credentials
const MongoDBStore = connectMongoDBSession(session);

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoDBStore({
        uri: process.env.MONGODB_URI!,
        collection: "SchedulesSessions",
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

mongoFuncs.deleteFromDatabase({}, "ScheduleSessions", "many", true)

// Google OAuth2 Credentials
passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), async (req: Request, res: Response) => {
    const user = req.user as any;

    const validEmailDomains = ["student.auhsd.us"];

    if (validEmailDomains.includes(user._json.hd)) {
        // Generate a random 64 bit string that's also encrypted
        const dataIDRandom: string = encrypts.permanentEncryptPassword(encrypts.generateRandomNumber(64, "alphanumeric"));

        userDataID = dataIDRandom;

        const fileData: any = JSON.parse(await mongoFuncs.getItemsFromDatabase("SchedulesUsers", true, { email: user._json.email })) || -1;

        if (fileData === -1) {
            const newUser: any = {
                displayName: user.displayName,
                firstName: user.name.givenName,
                lastName: user.name.familyName,
                email: user.emails[0].value,
                profilePicture: user.photos[0].value,
                schedule: {
                    P1: "",
                    P2: "",
                    P3: "",
                    P4: "",
                    P5: "",
                    P6: "",
                    P7: "",
                    P8: "",
                },
                siteUsername: "",
                sitePassword: "",
                settings: {
                    theme: "dark",
                    visible: "public", // public, private, friends, unlisted
                    friends: [],
                    blocked: [],
                    canLogInMultiple: false,
                },
                unlistedSettings: {
                    isTerminated: false,
                    isStudent: true,
                    isTeacher: false,
                },
                dataIDNumber: dataIDRandom,
            }

            const write = await mongoFuncs.writeToDatabase(newUser, "SchedulesUsers", true) || false;

            if (write) {
                res.redirect("http://localhost:3000/home");
            } else {
                res.redirect("http://localhost:3000/login");
            }
        } else {
            const findExistingData: any = JSON.parse(await mongoFuncs.getItemsFromDatabase("SchedulesUsers", true, { email: user._json.email }));

            findExistingData.dataIDNumber = dataIDRandom;

            const updateExistingData: boolean = await mongoFuncs.modifyInDatabase({ email: user._json.email }, findExistingData, "SchedulesUsers", true);

            if (updateExistingData) {
                res.redirect("http://localhost:3000/home");
            } else {
                res.redirect("http://localhost:3000/login");
            }
        }
    } else {
        res.redirect("http://localhost:3000/login");
    }
});

app.post('/api/saveperiods', async (req: Request, res: Response) => {
    const data: any = req.body;

    const findExistingData: any = JSON.parse(await mongoFuncs.getItemsFromDatabase("SchedulesUsers", true, { dataIDNumber: userDataID }));

    findExistingData.schedule = data;

    const updateExistingData: boolean = await mongoFuncs.modifyInDatabase({ dataIDNumber: userDataID }, findExistingData, "SchedulesUsers", true);

    if (updateExistingData) {
        res.send({ success: "Success updating data" });
    } else {
        res.send({ error: "Error updating data" });
    }
});

app.get("/api/getstudentdata", async (req: Request, res: Response) => {
    const data: any = JSON.parse(await mongoFuncs.getItemsFromDatabase("SchedulesUsers", true, { dataIDNumber: userDataID }));
    res.send(data);
});

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});

app.get("/api/getteachers", async (req: Request, res: Response) => {
    const data: any = JSON.parse(await mongoFuncs.getItemsFromDatabase("TeachersAvailable", true));

    res.send(data);
});

process.on("SIGINT", async () => {
    console.log("Shutting down server...");

    await mongoFuncs.deleteFromDatabase({}, "SchedulesUsers", "many", true)

    await mongoose.connection.close();

    process.exit();
});