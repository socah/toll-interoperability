const express = require('express')
const router = express.Router()
require('dotenv').config()

const jwt = require('jsonwebtoken')
const db = require('../../backend/db_auth.js')

const md5 = require("md5")

let active_tokens = []

router.post('/login', (req, res) => {
        console.log(req.query.username, md5(req.query.password));
        db.authUser(req.query.username, md5(req.query.password))
        .then((operatorID) => {
        if (operatorID != null) {
            const username = req.query.username
            const user = { name: username,  operatorID: operatorID }

            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

            if (!active_tokens.includes(accessToken)) {
                active_tokens.push(accessToken)
            }

            res.json({accessToken: accessToken})
        } else {
            res.status(401).json({"status":"failed"})
        }
    
    }) 
    .catch (err => {
        console.log("Error: " + err)
        res.status(500).json({"status":"failed"})
    })
})

router.get('/test_authentication',authenticateToken, (req, res) => {
    res.json({ "status": "OK"})
})

router.post('/logout', (req, res) => {
    active_tokens = active_tokens.filter(token => token != req.query.token)
    res.json({ "status": "OK"})
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({"status":"failed"})


    if (!active_tokens.includes(token)) return res.sendStatus(403)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({"status":"failed"})
        req.user = user
        next()
    })
}

module.exports = router;