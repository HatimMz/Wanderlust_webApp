require("dotenv").config({ path: require("node:path").resolve(__dirname, ".env") });

const express = require("express");
const app = express();
const cors = require("cors");
const customError = require("./utils/customError.js")
const session = require('express-session')
const { MongoStore } = require("connect-mongo");
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const mongoose = require("mongoose");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const user = require("./models/user/user.js")

const { MONGODB_URI, SESSION_SECRET, CLIENT_ORIGIN } = process.env;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI must be set.");
}
if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set.");
}

app.set("trust proxy", 1);
app.use(cors({
    origin: CLIENT_ORIGIN || (process.env.NODE_ENV === "production" ? false : "http://localhost:5173"),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let connectionPromise;
async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) {
        return;
    }
    if (mongoose.connection.readyState !== 2) {
        connectionPromise = undefined;
    }
    if (!connectionPromise) {
        connectionPromise = mongoose.connect(MONGODB_URI).catch((error) => {
            connectionPromise = undefined;
            throw error;
        });
    }
    await connectionPromise;
}

app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        next(error);
    }
});

const sessionOptions = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        collectionName: "sessions",
        ttl: 7 * 24 * 60 * 60
    }),
    cookie: {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

app.use(session(sessionOptions))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new user({
//         email: "delta@gmail.com",
//         username: "deltaStudent"
//     });

//     let registeredUser = await user.register(fakeUser, "delta123");
//     res.send(registeredUser)
// })

// home route
app.get("/", (req, res) => {
    res.json({ message: "WanderLust API is running" });
});

app.get('/api/health', (req,res) => res.json({ ok: true, message: 'API healthy' }));

//user router
app.use("/api/users", userRouter);


//listing router 
app.use("/api/listings", listingRouter);


// review router
app.use("/api/listings/:id/reviews", reviewRouter);


// page not found middleware
app.use((req, res, next) => {
    next(new customError(404, "Page not found"));
});


// error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    if (statusCode >= 500) {
        console.error(err);
    }
    res.status(statusCode).json({
        success: false,
        statusCode,
        message: statusCode >= 500 ? "Something went wrong" : err.message
    });
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is listening at port ${PORT}`);
    });
}

module.exports = app;