const pool = require('./dp_pool.js');


// Σε αυτό το αρχείο περιέχονται οι συναρτήσεις
// που χρησιμοποιούνται για τα endpoints της
// "Λειτουργίας του συστήματος" όπως γράφεται
// και στο έγγραφο των προδιαγραφών του API

// a
function getPassesPerStation(stationID, dateFrom, dateTo) {
    return new Promise( (fullfil, reject) => {
        fullfil({hello:"world"});
    });
}

// b
function getPassesAnalysis(opID_1, opID_2, dateFrom, dateTo) {
    return new Promise( (fullfil, reject) => {
        fullfil();
    });
}

// c
function getPassesCost(opID_1, opID_2, dateFrom, dateTo) {
    return new Promise( (fullfil, reject) => {
        fullfil();
    });
}

// d
function getChargesBy(opID, dateFrom, dateTo) {
    return new Promise( (fullfil, reject) => {
        fullfil();
    });
}

module.exports = {getPassesPerStation, getPassesAnalysis, getPassesCost, getChargesBy}