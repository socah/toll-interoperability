const pool = require('./dp_pool.js');

function getSettlements(operatorID) {

    return new Promise((fullfil, reject) => {

        // εκτελούμε το πρώτο query για την λήψη των οφειλών του operator
        pool.query("SELECT * , if(operatorCredited = ?, 'credit', 'debited') as Type FROM Settlement WHERE operatorCredited = ? OR operatorDebited = ?", [operatorID,operatorID,operatorID])
        .then((rows) => {
            if(rows.length == 0){
                console.log("No settlement found for : " + operatorID);
                fullfil(null); // Return No Data
                return;
            }else{
                fullfil(rows);
            }

        })
        .catch((err) => reject(err));
    });
  
}

function getSettlementPasses(settlementID) {

    return new Promise((fullfil, reject) => {

        // παίρνουμε τα σοτιχεία των settlemnets που αφορούν την συγκεκριμένη οφειλή
        pool.query(`SELECT P.passID, P.timestamp, P.stationRef, P.charge, V.tagID
            FROM Pass as P JOIN Vehicle as V ON P.vehicleRef = V.vehicleID
            WHERE settlementID = ?;`, [settlementID])
        .then((rows) => {
            if(rows.length == 0){
                console.log("No settlement found for : " + operatorID);
                fullfil(null); // Return No Data
                return;
            }else{
                fullfil(rows);
            }

        })
        .catch((err) => reject(err));
    });
  
}

function getSettlementAmount(settlementID){
    return new Promise((fullfil, reject) => {

            // παίρνουμε τα σοτιχεία των settlemnets που αφορούν την συγκεκριμένη οφειλή
            pool.query(`SELECT amount FROM Settlement WHERE settlementID = ?;`, [settlementID])
            .then((rows) => {
                if(rows.length == 0){
                    console.log("No settlement found for : " + operatorID);
                    reject("Settlement n ot found"); // Return No Data
                    return;
                }else{
                    fullfil(rows[0].amount);
                }

            })
            .catch((err) => reject(err));
        }); 
}

function clearSetlement(settlementID){
    return pool.query(`UPDATE Settlement SET paid = 1 WHERE settlementID = ?;`, [settlementID])
}

module.exports = {getSettlements, getSettlementPasses, getSettlementAmount, clearSetlement};