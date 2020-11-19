const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = new mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const {SENDGRID_API,EMAIL} = require('../config/keys')



const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:SENDGRID_API
    }
}))


router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Add required fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ exist: "User already exists" })
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        name: name,
                        pic: pic
                    })
                    user.save()
                        .then((user) => {
                            transporter.sendMail({
                                to: user.email,
                                from: "praveenreddy1798@gmail.com",
                                subject: "signup successful",
                                html: "<h1>Welcome to Instapost</h1>"

                            })
                            res.json({ message: "User saved successfully" })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
        })
        .catch((err) => {
            console.log(err)
        }
        )
})

router.post('/login', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Fill in the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "invalid email or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then((doMatch) => {
                    if (doMatch) {
                       
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email, followers, following, pic } = savedUser
                        return res.json({ token, loggeduser: { _id, name, email, followers, following, pic } })
                    }
                    else {
                        res.status(422).json({ error: "invalid username and password" })

                    }

                })
                .catch(err => {
                    console.log(err)
                })
        })
})


router.post('/resetpassword', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }

        const token = buffer.toString('hex')
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "user not found" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save()
                    .then(result => {
                        transporter.sendMail({
                            to: user.email,
                            from: "praveenreddy1798@gmail.com",
                            subject: "reset password",
                            html:`
                                    <p>You requested for password reset</p>
                                   <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                   `

                        })
                        res.json({ message: "check your email to reset password" })
                    })
                    .catch((err) => {
                        console.log(err)
                    })

            })

    })
})

router.post('/newpassword',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router