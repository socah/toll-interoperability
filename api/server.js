require('dotenv').config()

const express = require("express");
const morgan = require("morgan");
const https = require('https');
const fs = require('fs');


const app = express();

// middleware
app.use(morgan("dev")); // simple console logger
app.use(express.json());

const subscribersRouter = require('./routes/admin_router');
app.use('/interoperability/api/admin', subscribersRouter);

const functionsRouter = require('./routes/functions_router');
app.use('/interoperability/api/', functionsRouter);

const settlementsRouter = require('./routes/settlements_router');
app.use('/interoperability/api/', settlementsRouter);

// TODO: αφαίρεσε το, απλά υπάρχει για testing
const pool = require('../backend/dp_pool');
app.get("/", (req, res) => {

    pool.query("SELECT NOW()")
    .then((rows) => {
        console.log(rows)
        res.status(200).send(rows);

        return setTimeout(() => {console.log("Active db connections : " + pool.activeConnections())}, 2000);
    })
    .catch((err) => {console.log("Something went wrong!" + err)});

})


https.createServer({
    key: fs.readFileSync('./SSL/key.pem'),
    cert: fs.readFileSync('./SSL/cert.pem'),
}, app)
.listen(9103, () => {console.log("The server has started...")});




// TODO : We probably do not need them
// Handlers
process.on("exit", (code) => {
    console.log("Exiting with code " + code)
})

process.on("before_exit", (code) => {
    console.log("Before exiting with code " + code)
})

process.on('uncaughtException', (err, origin) => {
    console.log("!!! Uncaught Exception !!!");

    console.log(err);
    console.log(origin);

    process.exit();
})

process.on('SIGINT', () => {
    console.log("Interrupt Signal");

    process.exit();
})

