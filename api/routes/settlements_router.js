const express = require('express');
const router = express.Router();
const db_settlements = require('../../backend/db_settlements.js');
const {parse} = require('json2csv');
const {formatDate, formatDateFromString} = require("../utilities/date_formater.js")


// api endpoint για την λήψη των οφειλών που αφορούν
// τον λειτουργό με το δοσμένο op_ID
router.get("/GetSettlements/:op_ID", (req, res) => {
    const requestTimestamp = new Date();

    // check if authorized
    authorized = true;
    if(!authorized){
        res.status(401).json({status:"failed", reason:"Not authorized"});
        return;
    }

    // get parameters
    operatorID = req.params.op_ID;
    format = req.query.format || "json";


    // ελέγχουμε αν οι παράμετροι είναι ορθές
    const regex_format = /^json$|^csv$/;

    good_request = regex_format.test(format);

    if(!good_request){
        res.status(400).json({status:"failed", reason:"Bad Request"});
        return;
    }

    // αν όλα καλά μέχρι στιγμής εκτελούμε το query προς την βάση
    db_settlements.getSettlements(operatorID)
    .then((result) => {
        if(result == null){
            res.status(402).json({status:"failed", reason:"No data"});
        }else{


            result.forEach((element) => {
                element.dateFrom = formatDate(element.dateFrom);
                element.dateTo = formatDate(element.dateTo);
            });
          
            if(format == "json"){

                output_obj = {
                    op_ID : operatorID,
                    RequestTimestamp: formatDate(requestTimestamp),

                    SettlementsLength: result.length,
                    SettlementsList: result


                }

                res.status(200).json(output_obj);

            }else{
                // αν είναι csv τότε επιστρέφουμε ουσιαστικά μόνο το PassesList
                res.status(200).set('Content-Type', 'text/csv').send(parse(result));
            }
        }
    })
    .catch((err) => {
        console.log("Error on GetSettlements:");
        console.log(err);
        res.status(500).json( {status:"failed", reason:"Internal server error"} );
    });

});

// api enpoint για την λήψη των διελεύσεων που αφορούν
// ένα συγκεκριμένο settlement
router.get("/GetPassesForSettlement/:settlement_ID", (req, res) =>{
   const requestTimestamp = new Date();

    // check if authorized
    authorized = true;
    if(!authorized){
        res.status(401).json({status:"failed", reason:"Not authorized"});
        return;
    }

    // get parameters
    settlementID = req.params.settlement_ID;
    format = req.query.format || "json";


    // ελέγχουμε αν οι παράμετροι είναι ορθές
    const regex_format = /^json$|^csv$/;

    good_request = regex_format.test(format);

    if(!good_request){
        res.status(400).json({status:"failed", reason:"Bad Request"});
        return;
    }

    // αν όλα καλά μέχρι στιγμής εκτελούμε το query προς την βάση
    db_settlements.getSettlementPasses(settlementID)
    .then((result) => {
        if(result == null){
            res.status(402).json({status:"failed", reason:"No data"});
        }else{


            // result.forEach((element) => {
            //     element.dateFrom = formatDate(element.dateFrom);
            //     element.dateTo = formatDate(element.dateTo);
            // });
          
            if(format == "json"){

                output_obj = {
                    settlementID : settlementID,
                    RequestTimestamp: formatDate(requestTimestamp),

                    PassesLength: result.length,
                    PassesList: result


                }

                res.status(200).json(output_obj);

            }else{
                // αν είναι csv τότε επιστρέφουμε ουσιαστικά μόνο το PassesList
                res.status(200).set('Content-Type', 'text/csv').send(parse(result));
            }
        }
    })
    .catch((err) => {
        console.log("Error on GetPassesForSettlement:");
        console.log(err);
        res.status(500).json( {status:"failed", reason:"Internal server error"} );
    });

    
});

// Προσπάθεια εξόφλησης οφειλής με χρήση του κωδικού συναλλαγής
router.post("/PaySettlement/:settlement_ID/:transaction", (req, res) =>{

  const requestTimestamp = new Date();

    // check if authorized
    authorized = true;
    if(!authorized){
        res.status(401).json({status:"failed", reason:"Not authorized"});
        return;
    }

    // get parameters
    settlementID = req.params.settlement_ID;
    transactionID = req.params.transaction
    format = req.query.format || "json";


    // ελέγχουμε αν οι παράμετροι είναι ορθές
    const regex_format = /^json$|^csv$/;

    good_request = regex_format.test(format);

    if(!good_request){
        res.status(400).json({status:"failed", reason:"Bad Request"});
        return;
    }

    // dummy έλεγχος με την τράπεζα

    db_settlements.getSettlementAmount(settlementID)
    .then((amount) => {return transactionCodeIsValid(transactionID, amount);})
    .then(() => {return db_settlements.clearSetlement(settlementID);})
    .then((result) => {
       
        res.status(200).json({status: "OK", Msg: "Settlement Cleared"});

        
    })
    .catch((err) => {
        console.log("Error on PaySettlement:");
        console.log(err);
        res.status(500).json( {status:"failed", reason:"Internal server error"} );
    });


    
});

// dumy bank check

function transactionCodeIsValid(transactionID, amount) {
    return new Promise((fullfil, reject) => {fullfil()});
}

module.exports = router;