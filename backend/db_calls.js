const { fstat } = require('fs');
const mariadb = require('mariadb');
require('dotenv').config()
const csv = require('csv-parser')
const fs = require('fs')
const results = [];

const pool = mariadb.createPool({
     host: process.env.DB_URL,
     user: process.env.DB_USER, 
     password: process.env.DB_PASSWD,
     database: process.env.DB_NAME,
     connectionLimit: 5
});

pool.getConnection((err, connection) => {
    if(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Database connection lost');
        }
        if (err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Database has too many connections')
        }
        if (err.code === 'ECONNREFUSED'){
            console.error('Database connection was refused')
        }
    }
    if(connection) connection.release()

    return
})

function testConnection() {  return new Promise((resolve, reject) => {
    connectionString = process.env.DB_USER+'@'+process.env.DB_URL
    console.log("testing db connection...")
    pool.getConnection()
    .then(conn => {
        //successfull connection
        conn.release()
        resolve(connectionString)
    })
    .catch(err => {
        //failed to connect
        reject(connectionString)
    })
})
}

async function deletePasses() {
    console.log("deleting Pass data...")
        await pool.query(`DELETE FROM ${process.env.DB_NAME}.Pass`)
}

async function populateStations() {
    console.log("populating Station table with default data...")
    const results = [];
    let values = ''
    fs.createReadStream('../backend/sampledata01_stations.csv')
    .pipe(csv({separator: ';'}))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        //console.log(results)
        results.forEach(object => {
            values += `("${object.stationID}", "${object.stationProvider}", "${object.stationName}"),\n`
        })
        values = values.slice(0, -2) + ';'

        // ERROR HANDLING IS WRONG
        pool.query(`INSERT INTO Station(stationID, stationProvider, stationName) VALUES ${values}`)
        .catch(err => {
            throw err
        })
    })
    .catch(err => {
        throw err
    })
}


async function populateTags() {
    console.log("populating Tag table with default data...")
    const results = [];
    values = ''
    fs.createReadStream('../backend/sampledata01_vehicles_100.csv')
    .pipe(csv({separator: ';'}))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        //console.log(results)
        results.forEach(object => {
            values += `("${object.tagID}", "${object.tagProvider}", "${object.vehicleID}", "${object.licenseYear}"),\n`
        })
        values = values.slice(0, -2) + ';'
        
        // ERROR HANDLING IS WRONG
        pool.query(`INSERT INTO Tag(tagID, tagProvider, vehicleID, licenseYear) VALUES ${values}`)
        .catch(err => {
            throw err
        })
    })
    .catch(err => {
        throw err
    })
}



module.exports = {testConnection, deletePasses, populateStations, populateTags}