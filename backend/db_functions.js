const pool = require('./dp_pool.js');


// Σε αυτό το αρχείο περιέχονται οι συναρτήσεις
// που χρησιμοποιούνται για τα endpoints της
// "Λειτουργίας του συστήματος" όπως γράφεται
// και στο έγγραφο των προδιαγραφών του API



// a
function getPassesPerStation(stationID, dateFrom, dateTo) {

    return new Promise((fullfil, reject) => {
        stationProvider = null;

        // εκτελούμε το πρώτο query για την λήψη του stationProvider πχ 'aodos'
        pool.query("SELECT S.stationProvider FROM Station as S WHERE S.stationID = ? AND S.deleted = 0", [stationID])
        .then((rows) => {
            // μόλις τελειώσει το πρώτο query εκτελούμε τα παρακάτω
            if(rows.length == 0){
                console.log("No station found with ID: " + stationID);
                fullfil(null); // Return No Data
                return;
            }

            stationProvider = rows[0].stationProvider;

            // κάνουμε το δεύτερο query για να λάβουμε τις διελεύσεις
            return pool.query(`SELECT P.passID as PassID, P.timestamp as PassTimestamp,
                P.vehicleRef as VehicleID, V.tagProvider as TagProvider,
                if(V.tagProvider = S.stationProvider, "home", "visitor") as PassType,
                P.charge as PassCharge
                FROM (Pass as P JOIN Vehicle as V ON P.vehicleRef = V.vehicleID)
                JOIN Station as S ON S.stationID = P.stationRef
                WHERE P.stationRef = ? AND S.deleted = 0 AND P.timestamp BETWEEN ? AND ?;`, [stationID, dateFrom, dateTo]);
        })
        .then((rows) => {
            output = {
                stationProvider: stationProvider,
                rows: rows
            }
            fullfil(output);
        })
        .catch((err) => reject(err));
    });
  
}

// b
function getPassesAnalysis(opID_1, opID_2, dateFrom, dateTo) {
    return new Promise((fullfil, reject) => {

        // κάνουμε query για να λάβουμε τις διελεύσεις
        return pool.query(`SELECT P.passID as PassID, P.stationRef as StationID, 
            P.timestamp as TimeStamp, P.vehicleRef as VehicleID, P.charge as Charge
            FROM Pass as P
            JOIN Station as S ON S.stationID=P.stationRef 
            JOIN Vehicle as V ON V.vehicleID=P.vehicleRef
            WHERE S.stationProvider = ? AND S.deleted = 0 AND V.tagProvider = ? AND P.timestamp BETWEEN ? AND ?;`, [opID_1, opID_2, dateFrom, dateTo])
        .then((rows) => {
            console.log("Received Rows:" + rows);
            output = {
                rows: rows
            }
            fullfil(output);
        })
        .catch(err => reject(err));
    });
}

// c
function getPassesCost(stationProvider, tagProvider, dateFrom, dateTo) {
    return new Promise( (fullfil, reject) => {
        
        // κάνουμε query για να λάβουμε τo πλήθος και το άθροισμα των διελεύσεων
        return pool.query(`
            SELECT count(*) as NumberOfPasses, sum(P.charge) as PassesCost
            FROM Pass as P
            JOIN Station as S ON S.stationID=P.stationRef 
            JOIN Vehicle as V ON V.vehicleID=P.vehicleRef
            WHERE S.stationProvider = ? AND V.tagProvider = ? 
            AND S.deleted = 0 AND V.deleted = 0 AND P.timestamp BETWEEN ? AND ?`
            , [stationProvider, tagProvider, dateFrom, dateTo])
        .then((rows) => {
            output = {
                rows: rows
            }
            fullfil(output);
        })
        .catch(err => reject(err));

    });
}

// d
function getChargesBy(opID, dateFrom, dateTo) {
    
    return new Promise((fullfil, reject) => {

        // κάνουμε query για να λάβουμε τις διελεύσεις
        return pool.query(`SELECT V.tagProvider as VistingOperator, count(*) as NumberOfPasses, sum(P.charge) as PassesCost
            FROM (Pass as P JOIN Station as S ON P.stationRef = S.stationID)
            JOIN Vehicle as V ON P.vehicleRef = V.vehicleID
            WHERE S.deleted = 0 AND V.deleted = 0 S.stationProvider != V.tagProvider AND S.stationProvider = ? AND P.timestamp BETWEEN ? AND ?
            GROUP BY V.tagProvider`, [opID, dateFrom, dateTo])
        .then((rows) => {
            console.log("Received Rows:" + rows);
            output = {
                rows: rows
            }
            fullfil(output);
        })
        .catch(err => reject(err));
    });
}

module.exports = {getPassesPerStation, getPassesAnalysis, getPassesCost, getChargesBy}