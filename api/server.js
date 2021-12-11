require('dotenv').config()

const express = require("express")
const app = express()


/*
pool.getConnection()
    .then(conn => {
        conn.query("SELECT 1 as val")
        .then((rows) => {
          console.log(rows); //[ {val: 1}, meta: ... ]
          //Table must have been created before 
          // " CREATE TABLE myTable (id int, val varchar(255)) "
          //return conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
          return conn.query("SELECT * FROM myTable");
        })
        .then((res) => {
          console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
          conn.end();
        })
        .catch(err => {
          //handle error
          console.log(err); 
          conn.end();
        })
        
    }).catch(err => {
      //not connected
    });
*/
app.use(express.json())

const subscribersRouter = require('./routes/admin_router')
app.use('/interoperability/api/admin', subscribersRouter)


/*
app.use(logger)

app.get("/", logger, logger, (req, res) => {
    console.log("Here")
    res.json({Hi: "Hello"})
})

const userRouter = require('./')

app.use("./server.js", userRouter)


function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}
*/
app.listen(3000)