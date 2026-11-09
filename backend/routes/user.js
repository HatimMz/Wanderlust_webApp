const express = require("express")
const router = express.Router()
const user = require("../models/user/user.js")
const passport = require("passport")
const customError = require("../utils/customError.js")

router.post("/signup", async (req, res, next) => {
    try {
        const { username, password, email } = req.body
        const userObj = {
            username: username,
            email: email
        }

        const newUser = new user(userObj)
        const registeredUser = await user.register(newUser, password)

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            res.status(201).json({
                message: "User registered successfully",
                user: { id: registeredUser._id, username: registeredUser.username, email: registeredUser.email }
            })
        })

    } catch (err) {
        res.status(400).json({ message: err.message })
    }

})

router.post("/login", passport.authenticate("local"), (req, res) => {
    res.json({
        message: "Welcome back!",
        user: { id: req.user._id, username: req.user.username, email: req.user.email }
    })
})

router.get("/logout", (req,res,next)=>{
    req.logout((err)=>{
        if (err){
            return next(new customError(500 ,err.message))
        }
        res.json({ message: "Successfully logged out" })
    })
})

router.get("/me", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" })
    }
    res.json({ id: req.user._id, username: req.user.username, email: req.user.email })
})

module.exports = router