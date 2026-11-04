const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;
const customError = require("./utils/customError.js")
const session = require('express-session')
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const mongoose = require("mongoose");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const user = require("./models/user/user.js")



app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}
main();

const sessionOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 7*24*3600*1000 }   
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
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});







app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});