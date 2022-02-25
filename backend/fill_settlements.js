require('dotenv').config({path: "./../api/.env"})

const pool = require('./dp_pool.js');


// Αυτό το αρχείο περιέχει κώδικα για τον υπολογισμό των
// οφειλών μεταξύ των λειτουργών και την αποθήκευση τους στην βάση δεδομένων

// Επίσης διαγράφει τυχόν settlements που υπάρχουν ήδη στην βάση
// και τις αναφορές των διελεύσεων σε αυτά

settlementID = 1;

function monthToString(month){
    return month < 10 ? "0" + month : month;
}


async function calculate_month(year, month){

    last_date = [31, 
        (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? 29 : 28,
         31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    last_date = last_date[month-1];

    try{

        // υπολογίζουμε πόσα χρήματα χρωστάει ο καθένας στον άλλο
        result = await pool.query(`
        SELECT V.tagProvider, S.stationProvider, sum(charge) as amount
        FROM (SELECT * FROM Pass WHERE timestamp BETWEEN "${year}-${monthToString(month)}-01 00:00:00" AND "${year}-${monthToString(month)}-${last_date} 23:59:59") as P 
        
        JOIN ( SELECT vehicleID, tagProvider FROM Vehicle WHERE deleted = 0) as V 
        ON P.vehicleRef = V.vehicleID
        
        JOIN ( SELECT * FROM Station WHERE deleted = 0) as S
        ON P.stationRef = S.stationID
        
        GROUP BY V.tagProvider, S.stationProvider
        HAVING V.tagProvider != S.stationProvider`)

        
        //console.log(result);

    }catch(e){
        console.log(e)
    }


    while (result.length != 0) {

        a = result[0];


        // πόσα οφείλει ο a.tagProvider στον a.stationProvider
        amount = a.amount;

        // ψάχνουμε αν ο a.stationProvider χρωστάει στον a.tagProvider και αφαιρούμε τα χρηματα από το amount
        other_index = result.findIndex((e) => (e.tagProvider == a.stationProvider && e.stationProvider == a.tagProvider)); 

        if(other_index >= 0){
            
            // αν όντως υπάρχει
            amount = amount - result[other_index].amount;

            // το αφαιρούμε από το array 
            result.splice(other_index, 1)

        }

        // αφαιρούμε το πρώτο στοιχείο από το array
        result.splice(0, 1)


        debited_operator = a.tagProvider;
        credited_operator = a.stationProvider;

        if(amount < 0){ // αν είναι αρνητικό τότε ανταλλάσσονται οι ρόλοι των providers
            debited_operator = a.stationProvider;
            credited_operator = a.tagProvider;
            amount = -amount; // το κάνουμε θετικό
        }

        // δημιουργούμε ένα settlement στην βάση

        await pool.query(`
        INSERT INTO Settlement 
        VALUES (${settlementID},
        "${year}-${monthToString(month)}-01 00:00:00",
        "${year}-${monthToString(month)}-${last_date} 23:59:59",
        ${amount},NULL,0,
        '${credited_operator}','${debited_operator}');`);


        

        // ενημερώνουμε το settlementID στα passes
        await pool.query(`
        UPDATE Pass
        SET settlementID=${settlementID}, timestamp = timestamp
        WHERE passID in
        (SELECT passID  
        FROM (SELECT * FROM Pass WHERE timestamp BETWEEN "${year}-${monthToString(month)}-01 00:00:00" AND "${year}-${monthToString(month)}-${last_date} 23:59:59") as P 
        
        JOIN ( SELECT vehicleID, tagProvider FROM Vehicle WHERE deleted = 0) as V 
        ON P.vehicleRef = V.vehicleID
        
        JOIN ( SELECT * FROM Station WHERE deleted = 0) as S
        ON P.stationRef = S.stationID
        WHERE (V.tagProvider = "${credited_operator}" AND S.stationProvider = "${debited_operator}") OR (V.tagProvider = "${debited_operator}" AND S.stationProvider = "${credited_operator}"));`);

        // το αυξάνω για τον επόμενο
        settlementID = settlementID + 1;
    }

}


async function fill(){

    try{

        // αφαιρούμε όλες τις αναφορές των διελεύσεων προς τα settlements
        await pool.query(`
        UPDATE Pass as P
        SET settlementID=NULL, P.timestamp = P.timestamp;
        `);

        // διαγράφω διάφορα τυχόν settlements
        await pool.query(`DELETE FROM Settlement;`)
    }catch(e){
        console.log(e)
        return;
    }

    // await calculate_month(2018, 12);

    for(let year = 2018; year <= 2021; year++){
        console.log("YEAR :" + year);
        for(let month = 1; month <= 12; month++){
            console.log("MONTH :" + month);
            await calculate_month(year, month);
        }
    }

    await pool.end();
}


// do the work
fill();