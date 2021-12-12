require('dotenv').config()

const express = require("express")
const app = express()

app.use(express.json())

const subscribersRouter = require('./routes/admin_router')
app.use('/interoperability/api/admin', subscribersRouter)

app.listen(3000)