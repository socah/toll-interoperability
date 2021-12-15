const express = require('express')
const router = express.Router()

const db = require('../../backend/db_calls.js')

router.get('/healthcheck', (req, res) => {
    db.testConnection()
    .then(connectionString => {
        res.status(200).json({"status":"OK", "dbconnection":connectionString})
    })
    .catch(connectionString => {
        res.status(500).json({"status":"failed", "dbconnection":connectionString})
    })
})

/* Doesent work...
router.use(logger)

async function logger(req, res, next) {
    try {    
        await next()
        res.status(200).json({"status":"OK"})
    }   
    catch(err) {
        console.log('failure')
        res.status(500).json({"status":"failed"})
    }
}

*/

router.post('/resetpasses', async function(req, res)  {
    try { // try-catch could be in common middleware
        await db.deletePasses()
        res.status(200).json({"status":"OK"})
    } catch(err) { 
        console.log(err)
        res.status(500).json({"status":"failed"})
    }
})

router.post('/resetstations', async function(req, res) {
    try {
        await db.populateStations()
        res.status(200).json({"status":"OK"})
    } catch(err) { 
        console.log(err)
        res.status(500).json({"status":"failed"})
    }
})

router.post('/resetvehicles', async function(req, res) {
    try {
        await db.populateTags()
        res.status(200).json({"status":"OK"})
    } catch(err) { 
        console.log(err)
        res.status(500).json({"status":"failed"})
    }
})

router.post('/addpasses', async function(req, res) {
    try {
        await db.populatePasses()
        res.status(200).json({"status":"OK"})
    } catch(err) { 
        console.log(err)
        res.status(500).json({"status":"failed"})
    }
})

module.exports = router

