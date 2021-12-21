require('dotenv').config()

const { fstat } = require('fs');
const mariadb = require('mariadb');
const csv = require('csv-parser')
const fs = require('fs');
const pool = require('./dp_pool.js');



function testConnection() {  return new Promise((resolve, reject) => {
    connectionString = `SERVER=${process.env.DB_URL};USER=${process.env.DB_USER};PASSWORD=${process.env.DB_PASSWD};DATABASE=${process.env.DB_NAME};PORT=3306`
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

function deletePasses() {
    console.log("deleting Pass data...")
    return pool.query(`DELETE FROM ${process.env.DB_NAME}.Pass`)
}

function populateStations() { 
    return new Promise ( (fullfil, reject) => {
        console.log("populating Station table with default data...")
        const results = [];
        let values = ''
        fs.createReadStream('../database/csv_files/sampledata01_stations.csv')
        .pipe(csv({separator: ';'}))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            //console.log(results)
            results.forEach(object => {
                values += `("${object.stationID}", "${object.stationProvider}", "${object.stationName}"),\n`
            })
            values = values.slice(0, -2) + ';'

            pool.query(`INSERT INTO Station(stationID, stationProvider, stationName) VALUES ${values}`)
            .then(rows => {
                fullfil()
            })
            .catch(err => {
                reject(err)
            })
        })
    })
}


function populateVehicles() {
        return new Promise( (fullfil, reject) => {
        console.log("populating Tag table with default data...")
        const results = [];
        values = ''
        fs.createReadStream('../database/csv_files/sampledata01_vehicles_100.csv')
        .pipe(csv({separator: ';'}))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            //console.log(results)
            results.forEach(object => {
                values += `("${object.tagID}", "${object.tagProvider}", "${object.vehicleID}", "${object.licenseYear}"),\n`
            })
            values = values.slice(0, -2) + ';'
            
            pool.query(`INSERT INTO Vehicle(tagID, tagProvider, vehicleID, licenseYear) VALUES ${values}`)
            .then(rows => {
                fullfil()
            })
            .catch(err => {
                reject(err)
            })
        })
    })
}

function populatePasses() {
    return new Promise ( (fullfil, reject) => {
        console.log("populating Pass table with default data...")
        const results = [];
        values = ''
        fs.createReadStream('../database/csv_files/sampledata01_passes100_8000.csv')
        .pipe(csv({separator: ';'}))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            //console.log(results)
            results.forEach(object => {
                time = object.timestamp.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
                timestamp = time[3] + "-" + time[2].padStart(2, '0') + "-" +  time[1].padStart(2, '0') + " " + time[4] + ":" + time[5] + ":00"
                values += `("${object.passID}", "${timestamp}", "${object.stationRef}", "${object.vehicleRef}", ${object.charge}),\n`
            })
            values = values.slice(0, -2) + ';'
            
            pool.query(`INSERT INTO Pass(passID, timestamp, stationRef, vehicleRef, charge) VALUES ${values}`)
            .then(rows => {
                fullfil()
            })
            .catch(err => {
                reject(err)
            })
        })
    })
}



module.exports = {testConnection, deletePasses, populateStations, populateVehicles, populatePasses}