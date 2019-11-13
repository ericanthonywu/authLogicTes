const {decrypt} = require("../securityHelper");
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const moment = require('moment')
const jwt = require('jsonwebtoken')

const {user: User} = require('../model')

exports.login = (req, res) => {
    const data = decrypt(req)
    Object.keys(data).forEach(key => {
        if (data[key] === "") {
            return res.status(400).json()
        }
    })
    User.findOne({
        $or: [{
            username: data.usernameoremail
        },
            {
                email: data.usernameoremail
            }]
    })
        .select("password email email_status phone phone_code nickname")
        .then(userData => {
            if (userData) {
                bcrypt.compare(data.password, userData.password).then(check => {
                    if (check) {
                        if (userData.email_status) {
                            const jwtData = {
                                email: userData.email,
                                nickname: userData.nickname,
                                username: data.username,
                                phone: userData.phone,
                                phone_code: userData.phone_code
                            }
                            jwt.sign(jwtData, process.env.JWTSECRETKEY, (err, token) => {
                                if (err) {
                                    res.status(500).json(err)
                                } else {
                                    res.status(200).json({
                                        token: token,
                                        ...jwtData
                                    })
                                }
                            })
                        } else {
                            res.status(403).json()
                        }
                    } else {
                        res.status(401).json()
                    }
                }).catch(err => res.status(500).json(err))
            } else {
                res.status(404).json()
            }
        }).catch(err => res.status(500).json(err))

}

exports.register = (req, res) => {
    const data = decrypt(req)
    Object.keys(data).forEach(key => {
        if (data[key] === "") {
            return res.status(400).json()
        }
    })
    const token = Math.floor((Math.random() * 1000000) + 1);
    data.email_verification_token = token
    data.email_verification_token_expire = moment(Date.now()).add(3, 'minutes').toISOString()
    bcrypt.hash(data.password, bcrypt.genSaltSync(Math.random(), Math.random())).then(hashed_password => {
        data.password = hashed_password
        new User(data).save().then(() => {
            nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                service: "Gmail",
                requireTLS: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAILPASSWORD
                }
            }).sendMail({
                from: "Email Verification",
                to: data.email,
                subject: "Email Verification",
                html: `Thank you for registering! Here is your token <b>${token}</b>`
            }, err => {
                if (err) {
                    return res.status(500).json(err)
                }
            })
            res.status(201).json()
        }).catch(err => res.status(500).json(err))
    })
}

exports.verifyEmail = (req, res) => {
    const data = decrypt(req)
    Object.keys(data).forEach(key => {
        if (data[key] === "") {
            return res.status(400).json()
        }
    })
    User.findOne({
        email_verification_token: parseInt(data.token),
        email: data.email,
    }).select("email_verification_token_expire").then(userData => {
        if (userData) {
            if (moment(userData.email_verification_token_expire).isBefore(moment(Date.now()).toISOString())) {
                User.findOneAndUpdate({
                    email_verification_token: parseInt(data.token),
                    email: data.email,
                }, {
                    email_status: true,
                    email_verification_token: 0
                })
                    .then(() => res.status(200).json())
                    .catch(err => res.status(500).json(err))
            } else {
                res.status(401).json()
            }
        } else {
            res.status(404).json()
        }
    })
}
