const jwt = require('jsonwebtoken')
const ls = require('store2')

function authenticateToken(req, res, next) {
    console.log(req.headers)
    const authHeader = req.headers['x-observatory-auth']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({"status":"failed"})

    var active_tokens = ls.get("active_tokens")
    console.log("active tokens:", active_tokens)
    if (!active_tokens.includes(token)) return res.sendStatus(403)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({"status":"failed"})
        req.user = user
        next()
    })
}

module.exports = {authenticateToken}