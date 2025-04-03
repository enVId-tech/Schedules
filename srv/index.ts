/**
 * FILEPATH: c:\Users\theli\Documents\Visual-Studio-Projects\React-HTML\Schedules-MAIN\server\index.ts
 * 
 * This file contains the server-side code for the Schedules application. It initializes the Express app, connects to MongoDB, and sets up authentication with Google OAuth2. It also defines API endpoints for saving user schedule data.
 * 
 * Libraries used: 
 * - body-parser
 * - connect-mongodb-session
 * - cors
 * - express
 * - express-session
 * - mongoose
 * - passport
 * - passport-google-oauth20
 * 
 * Modules used:
 * - encryption.ts
 * - mongoDB.ts
 * 
 * Global variables:
 * - userDataID: string
 * 
 * API endpoints:
 * - GET /auth/google
 * - GET /auth/google/callback
 * - POST /api/saveperiods
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Libraries
import bodyParser from "body-parser";
import connectMongoDBSession from "connect-mongodb-session";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import path from 'path';
import { fileURLToPath } from 'url';
import { CLIENT_DB, CLIENT_ID, CLIENT_SECRET, SERVER_PORT } from "./configs/env.js";
import encrypts from "./modules/encryption.js";
import mongoFuncs from "./modules/mongoDB.js";

declare module "express-session" {
    interface Session {
        dataIDNumber?: string;
    }
}

// File Path Initialization
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express Initialization
const app: Express = express();

//Library Initialization
app.use(express.json());
app.use(cors());
app.set('trust proxy', true);

const SECRET: string = encrypts.permanentEncryptPassword(encrypts.generateRandomNumber(256, "alphanumeric"))

// Globals

// MongoDB Credentials
const MongoDBStore = connectMongoDBSession(session);

app.use(bodyParser.urlencoded({ extended: true }));
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
            callbackURL: "http://etrecore.csproject.org:19638/auth/google/callback"
            //callbackURL: "http://127.0.0.1:3001/auth/google/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

mongoFuncs.deleteFromDatabase({}, "SchedulesSessions", "many", true)

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

        req.session.dataIDNumber = dataIDRandom;

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
                    grade: "",
                    theme: "dark",
                    visible: "public", // public, private, friends, unlisted
                    friends: [],
                    blocked: [],
                    canLogInMultipleDevices: true,
                },
                unlistedSettings: {
                    isTerminated: false,
                    isStudent: true,
                    isTeacher: false,
                },
                dataIDNumber: dataIDRandom,
            }

            const write = await mongoFuncs.writeToDatabase(newUser, "SchedulesUsers", false) || false;

            if (write) {
                //res.redirect("http://127.0.0.1:3000/home");
                res.redirect("/home");
            } else {
                //res.redirect("http://127.0.0.1:3000/login");
                res.redirect("/login");
            }
        } else {
            const findExistingData: any = JSON.parse(await mongoFuncs.getItemsFromDatabase("SchedulesUsers", false, { email: user._json.email }));

            findExistingData.dataIDNumber = dataIDRandom;

            const updateExistingData: number = await mongoFuncs.modifyInDatabase({ email: user._json.email }, findExistingData, "SchedulesUsers", false);

            if (updateExistingData > 0) {
                //res.redirect("http://127.0.0.1:3000/home");
                res.redirect("/home");
            } else {
                //res.redirect("http://127.0.0.1:3000/login");
                res.redirect("/login");
            }
        }
    } else {
        //res.redirect("http://127.0.0.1:3000/login");
        res.redirect("/login");
    }
});

app.post('/api/saveperiods', async (req: Request, res: Response) => {
    try {
        const data: any = req.body;

        const findExistingData: any = JSON.parse(await mongoFuncs.getItemsFromDatabase("SchedulesUsers", false, { dataIDNumber: req.session.dataIDNumber })); // Use session dataIDNumber

        findExistingData.schedule = data.periods;
        findExistingData.settings.grade = data.currentGrade;

        const updateExistingData: number = await mongoFuncs.modifyInDatabase({ dataIDNumber: req.session.dataIDNumber }, findExistingData, "SchedulesUsers", false);

        res.send({ numberUpdated: updateExistingData });
    } catch (err) {
        res.send({ error: err })
    }
});
app.get("/api/getstudentdata", async (req: Request, res: Response) => {
    const data: any = JSON.parse(await mongoFuncs.getItemsFromDatabase("SchedulesUsers", false, { dataIDNumber: req.session.dataIDNumber }));
    res.send(data);
});

app.get("/api/getteachers", async (req: Request, res: Response) => {
    const data: any = JSON.parse(await mongoFuncs.getItemsFromDatabase("TeachersAvailable", false));

    res.send(data);
});

app.get("/api/getstudentschedules", async (req: Request, res: Response) => {
    const data: any[] = JSON.parse(await mongoFuncs.getItemsFromDatabase("SchedulesUsers", false));

    let newData: any[] = [];

    for (let i = 0; i < data.length; i++) {
        try {
            if (data[i].settings.visible === "public") {
                if (data[i].schedule.length > 0) {
                    let newDataItem: any = {};

                    newDataItem.displayName = data[i].displayName;
                    newDataItem.studentID = data[i].email.split("@")[0];
                    newDataItem.schedule = data[i].schedule;
                    newDataItem.grade = data[i].settings.grade;
                    newDataItem.profilePicture = data[i].profilePicture;

                    newData.push(newDataItem);
                }
            }
        } catch (err) {
            console.error("\x1b[31m", err);
            console.error("\x1b[31m", "Error with user: " + data[i].displayName);
            console.error("\x1b[31m", "Data:" + JSON.stringify(data[i]));
        }
    }

    res.send(newData);
});

app.get('/api/getallusersettings', async (req: Request, res: Response) => {
    const data: any = JSON.parse(await mongoFuncs.getItemsFromDatabase("SchedulesUsers", false, { dataIDNumber: req.session.dataIDNumber }));

    let newData: any[] = [];

    try {
        let newDataItem: any = {};

        newDataItem.displayName = data.displayName;
        newDataItem.studentID = data.email.split("@")[0];
        newDataItem.grade = data.settings.grade;
        newDataItem.settings = data.settings;

        newData.push(newDataItem);
    } catch (err) {
        console.error("\x1b[31m", err);
        console.error("\x1b[31m", "Error with user: " + data.displayName);
        console.error("\x1b[31m", "Data:" + JSON.stringify(data));
    }

    res.send(newData);
});

app.post('/api/savesettings', async (req: Request, res: Response) => {
    try {
        const data: any = req.body;

        const findExistingData: any = await JSON.parse(await mongoFuncs.getItemsFromDatabase("SchedulesUsers", false, { dataIDNumber: req.session.dataIDNumber }));

        findExistingData.firstName = data.firstName;
        findExistingData.lastName = data.lastName;
        findExistingData.displayName = data.firstName + " " + data.lastName;
        findExistingData.siteUsername = data.username;
        findExistingData.settings.visible = data.visible;
        if (Number(findExistingData.settings.grade) !== Number(data.grade)) {
            findExistingData.schedule = [];
        }
        findExistingData.settings.grade = data.grade;
        if (data.password !== "") {
            findExistingData.sitePassword = encrypts.permanentEncryptPassword(data.password);
        } else {
            findExistingData.sitePassword = "null";
        }

        const updateExistingData: number = await mongoFuncs.modifyInDatabase({ dataIDNumber: req.session.dataIDNumber }, findExistingData, "SchedulesUsers", false);

        if (updateExistingData > 0) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    } catch (err) {
        console.error("\x1b[31m", err);
        res.sendStatus(500);
    }
});

app.post('/user/login', async (req: Request, res: Response) => {
    try {
        const data: any = req.body;

        const findExistingData: any = JSON.parse(await mongoFuncs.getItemsFromDatabase("SchedulesUsers", false, { siteUsername: data.username }));

        if (findExistingData === null) {
            res.sendStatus(500);
        } else {
            if (!findExistingData.sitePassword.includes("null")) {
                if (await encrypts.comparePassword(data.password, findExistingData.sitePassword)) {
                    findExistingData.dataIDNumber = encrypts.generateRandomNumber(64, "alphanumeric");

                    req.session.dataIDNumber = findExistingData.dataIDNumber;

                    const updateExistingData: number = await mongoFuncs.modifyInDatabase({ siteUsername: data.username }, findExistingData, "SchedulesUsers", false);

                    if (updateExistingData > 0) {
                        const sessionData = {
                            secret: SECRET,
                            resave: true, // Set to true to ensure session is saved on every request
                            saveUninitialized: true, // Set to true to save uninitialized sessions
                            cookie: {
                                maxAge: 1000 * 60 * 60 * 24 * 7
                            },
                            store: new MongoDBStore({
                                uri: process.env.MONGODB_URI!,
                                collection: "SchedulesSessions",
                                expires: 1000 * 60 * 60 * 24 * 7, // 1 week
                                databaseName: CLIENT_DB,
                                idField: "_id",
                                expiresKey: "sessionTime",
                                expiresAfterSeconds: 1000 * 60 * 60 * 24 * 7 // 1 week
                            }),
                        };

                        app.use(session(sessionData));

                        req.session.dataIDNumber = findExistingData.dataIDNumber;

                        res.sendStatus(200);
                    } else {
                        res.sendStatus(500);
                    }
                } else {
                    res.sendStatus(500);
                }
            } else {
                res.sendStatus(500);
            }
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/student/data/logout', async (req: Request, res: Response) => {
    try {
    await mongoFuncs.deleteFromDatabase({ _id: req.sessionID }, "SchedulesSessions", "one", false);

    const data: any = JSON.parse(await mongoFuncs.getItemsFromDatabase("SchedulesUsers", false, { dataIDNumber: req.session.dataIDNumber }));

    data.dataIDNumber = "";

    const updateExistingData: number = await mongoFuncs.modifyInDatabase({ dataIDNumber: req.session.dataIDNumber }, data, "SchedulesUsers", false);

    req.session.destroy((err: any) => {
        if (err) {
            res.sendStatus(500);
        }
    });

    if (updateExistingData > 0) {
        res.sendStatus(200);
    }
    } catch (err) {
        res.sendStatus(500);
    }
});

// GOOGLE OAUTH FIX DOCUMENTATION
// Use the code below for your build.
// IMPORTANT: Make sure that this code is placed AFTER the /google/auth (or equivalent) and /google/auth/callback (or equivalent) route.

app.use(express.static(path.join(__dirname, '..', 'public')));

// Handle all other routes by serving the 'index.html' file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(SERVER_PORT, () => {
    console.warn('\x1b[33m%s\x1b[0m', `Server is running on port ${SERVER_PORT}`);
});

process.on("SIGINT", async () => {
    console.warn('\x1b[33m%s\x1b[0m', "Shutting down server...");

    await mongoFuncs.deleteFromDatabase({}, "SchedulesUsers", "many", true)

    await mongoose.connection.close();

    process.exit();
});