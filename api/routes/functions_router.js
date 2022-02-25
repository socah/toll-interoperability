const e = require('express');
const express = require('express');
const router = express.Router();
const {parse} = require('json2csv');
const db_functions = require('../../backend/db_functions.js');
const {formatDate, formatDateFromString} = require("../utilities/date_formater.js")
const {authenticateToken} = require("../utilities/token_authentication.js")

// TODO : Do not forget to check format GET param for csv, json



router.get("/PassesPerStation/:stationID/:date_from/:date_to", (req, res) =>{
    
    const requestTimestamp = new Date();
    

    // check if authorized
    authorized = true;
    if(!authorized){
        res.status(401).json({status:"failed", reason:"Not authorized"});
        return;
    }

    // get parameters
    stationID = req.params.stationID;
    fromDate = String(req.params.date_from);
    toDate = String(req.params.date_to);
    format = req.query.format || "json";


    // ελέγχουμε αν οι παράμετροι είναι ορθές
    const regex_for_stationID = /^[A-Z][A-Z]\d\d$/; // Two capital letters followed by two digits
    const regex_date = /^\d{8}$/; // 8 digits in a row
    const regex_format = /^json$|^csv$/;

    good_request = regex_for_stationID.test(stationID) 
        && regex_date.test(fromDate) 
        && regex_date.test(toDate)
        && regex_format.test(format);

    if(!good_request){
        res.status(400).json({status:"failed", reason:"Bad Request"});
        return;
    }

    // αν όλα καλά μέχρι στιγμής εκτελούμε το query προς την βάση
    db_functions.getPassesPerStation(stationID, formatDateFromString(fromDate, "00:00:00"), formatDateFromString(toDate, "23:59:59"))
    .then((result) => {
        if(result == null){
            res.status(402).json({status:"failed", reason:"No data"});
        }else{
            // Προσθέτουμε τον αύξοντα αριθμό PassIndex για κάθε row
            // και κάνουμε format το timestamp
            result.rows.forEach((element, index) => {
                element.PassTimestamp = formatDate(element.PassTimestamp);
            });

            result.rows = result.rows.map((element, index) => Object.assign({PassIndex: index+1}, element))

            if(format == "json"){
               
                response_object =
                {
                    Station: stationID,
                    StationOperator: result.stationProvider,
                    RequestTimestamp: formatDate(requestTimestamp),
                    PeriodFrom: formatDateFromString(fromDate, "00:00:00"),
                    PeriodTo: formatDateFromString(toDate, "23:59:59"),
                    NumberOfPasses: result.rows.length,

                    PassesList : result.rows
                };

                res.status(200).json(response_object);
            }else{
                // αν είναι csv τότε επιστρέφουμε ουσιαστικά μόνο το PassesList
                res.status(200).set('Content-Type', 'text/csv').send(parse(result.rows));
            }
        }
    })
    .catch((err) => {
        console.log("Error on PassesPerStation:");
        console.log(err);
        res.status(500).json( {status:"failed", reason:"Internal server error"} );
    });
   
});


router.get("/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to", (req, res) =>{

    const requestTimestamp = new Date();

    // check if authorized
    authorized = true;
    if(!authorized){
        res.status(401).json({status:"failed", reason:"Not authorized"});
        return;
    }

    // get parameters
    stationProvider = String(req.params.op1_ID);
    tagProvider = String(req.params.op2_ID);
    fromDate = String(req.params.date_from);
    toDate = String(req.params.date_to);
    format = req.query.format || "json";


    // ελέγχουμε αν οι παράμετροι είναι ορθές
    const regex_date = /^\d{8}$/; // 8 digits in a row
    const regex_format = /^json$|^csv$/;

    good_request = regex_date.test(fromDate) 
        && regex_date.test(toDate)
        && regex_format.test(format);

    if(!good_request){
        res.status(400).json({status:"failed", reason:"Bad Request"});
        return;
    }

    // αν όλα καλά μέχρι στιγμής εκτελούμε το query προς την βάση
    db_functions.getPassesAnalysis(stationProvider, tagProvider, formatDateFromString(fromDate, "00:00:00"), formatDateFromString(toDate, "23:59:59"))
    .then((result) => {
        if(result == null){
            res.status(402).json({status:"failed", reason:"No data"});
        }else{
            // Προσθέτουμε τον αύξοντα αριθμό PassIndex για κάθε row
            // και κάνουμε format το timestamp
            result.rows.forEach((element, index) => {
                element.TimeStamp= formatDate(element.TimeStamp);
            });

            result.rows = result.rows.map((element, index) => Object.assign({PassIndex: index+1}, element))
            
            if(format == "json"){

                response_object =
                {
                    op1_ID: stationProvider,
                    op2_ID: tagProvider,
                    RequestTimestamp: formatDate(requestTimestamp),
                    PeriodFrom: formatDateFromString(fromDate, "00:00:00"),
                    PeriodTo: formatDateFromString(toDate, "23:59:59"),
                    NumberOfPasses: result.rows.length,

                    PassesList : result.rows
                };

                res.status(200).json(response_object);
            }else{
                // αν είναι csv τότε επιστρέφουμε ουσιαστικά μόνο το PassesList
                res.status(200).set('Content-Type', 'text/csv').send(parse(result.rows));
            }
        }
    })
    .catch((err) => {
        console.log("Error on PassesAnalysis:");
        console.log(err);
        res.status(500).json( {status:"failed", reason:"Internal server error"} );
    });
    
});

router.get("/PassesAnalysisAuth/:op1_ID/:op2_ID/:date_from/:date_to", authenticateToken, (req, res) =>{

    const requestTimestamp = new Date();

    // check if authorized
    authorized = true;
    if(!authorized){
        res.status(401).json({status:"failed", reason:"Not authorized"});
        return;
    }

    // get parameters
    stationProvider = String(req.params.op1_ID);
    tagProvider = String(req.params.op2_ID);
    fromDate = String(req.params.date_from);
    toDate = String(req.params.date_to);
    format = req.query.format || "json";

    operatorID = req.user.operatorID

    // ελέγχουμε αν ο λειτουργός όντως σχετίζεται με κάποιον τρόπο με το αίτημα που κάνει
    // αν δεν είναι ούτε ο λειτουργός των διοδίων ούτε ο ιδιοκτήτης του tag δεν έχει δικαίωμα να δεί τις διελεύσεις
    if(operatorID != stationProvider && operatorID != tagProvider){
        res.status(401).json({status:"failed", reason:"Not authorized"});
        return;
    }


    // ελέγχουμε αν οι παράμετροι είναι ορθές
    const regex_date = /^\d{8}$/; // 8 digits in a row
    const regex_format = /^json$|^csv$/;

    good_request = regex_date.test(fromDate) 
        && regex_date.test(toDate)
        && regex_format.test(format);

    if(!good_request){
        res.status(400).json({status:"failed", reason:"Bad Request"});
        return;
    }

    // αν όλα καλά μέχρι στιγμής εκτελούμε το query προς την βάση
    db_functions.getPassesAnalysis(stationProvider, tagProvider, formatDateFromString(fromDate, "00:00:00"), formatDateFromString(toDate, "23:59:59"))
    .then((result) => {
        if(result == null){
            res.status(402).json({status:"failed", reason:"No data"});
        }else{
            // Προσθέτουμε τον αύξοντα αριθμό PassIndex για κάθε row
            // και κάνουμε format το timestamp
            result.rows.forEach((element, index) => {
                element.TimeStamp= formatDate(element.TimeStamp);
            });

            result.rows = result.rows.map((element, index) => Object.assign({PassIndex: index+1}, element))
            
            if(format == "json"){

                response_object =
                {
                    op1_ID: stationProvider,
                    op2_ID: tagProvider,
                    RequestTimestamp: formatDate(requestTimestamp),
                    PeriodFrom: formatDateFromString(fromDate, "00:00:00"),
                    PeriodTo: formatDateFromString(toDate, "23:59:59"),
                    NumberOfPasses: result.rows.length,

                    PassesList : result.rows
                };

                res.status(200).json(response_object);
            }else{
                // αν είναι csv τότε επιστρέφουμε ουσιαστικά μόνο το PassesList
                res.status(200).set('Content-Type', 'text/csv').send(parse(result.rows));
            }
        }
    })
    .catch((err) => {
        console.log("Error on PassesAnalysis:");
        console.log(err);
        res.status(500).json( {status:"failed", reason:"Internal server error"} );
    });
    
});

router.get("/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to", (req, res) => {

    
    const requestTimestamp = new Date();

    // check if authorized
    authorized = true;
    if(!authorized){
        res.status(401).json({status:"failed", reason:"Not authorized"});
        return;
    }

    // get parameters
    stationProvider = String(req.params.op1_ID);
    tagProvider = String(req.params.op2_ID);
    fromDate = String(req.params.date_from);
    toDate = String(req.params.date_to);
    format = req.query.format || "json";


    // ελέγχουμε αν οι παράμετροι είναι ορθές
    const regex_date = /^\d{8}$/; // 8 digits in a row
    const regex_format = /^json$|^csv$/;

    good_request = regex_date.test(fromDate) 
        && regex_date.test(toDate)
        && regex_format.test(format);

    if(!good_request){
        res.status(400).json({status:"failed", reason:"Bad Request"});
        return;
    }

    // αν όλα καλά μέχρι στιγμής εκτελούμε το query προς την βάση
    db_functions.getPassesCost(stationProvider, tagProvider, formatDateFromString(fromDate, "00:00:00"), formatDateFromString(toDate, "23:59:59"))
    .then((result) => {
        if(result == null){
            res.status(402).json({status:"failed", reason:"No data"});
        }else{

            response_object =
            {
                op1_ID: stationProvider,
                op2_ID: tagProvider,
                RequestTimestamp: formatDate(requestTimestamp),
                PeriodFrom: formatDateFromString(fromDate, "00:00:00"),
                PeriodTo: formatDateFromString(toDate, "23:59:59"),

                PassesCost : result.rows[0].PassesCost
            };

            if(format == "json"){
                res.status(200).json(response_object);
            }else{
                res.status(200).set('Content-Type', 'text/csv').send(parse(response_object));
            }
        }
    })
    .catch((err) => {
        console.log("Error on PassesCost:");
        console.log(err);
        res.status(500).json( {status:"failed", reason:"Internal server error"} );
    });
    
    
});

router.get("/ChargesBy/:op_ID/:date_from/:date_to", (req, res) =>{

    const requestTimestamp = new Date();

    // check if authorized
    authorized = true;
    if(!authorized){
        res.status(401).json({status:"failed", reason:"Not authorized"});
        return;
    }

    // get parameters
    stationProvider = String(req.params.op_ID);
    fromDate = String(req.params.date_from);
    toDate = String(req.params.date_to);
    format = req.query.format || "json";


    // ελέγχουμε αν οι παράμετροι είναι ορθές
    const regex_date = /^\d{8}$/; // 8 digits in a row
    const regex_format = /^json$|^csv$/;

    good_request = regex_date.test(fromDate) 
        && regex_date.test(toDate)
        && regex_format.test(format);

    if(!good_request){
        res.status(400).json({status:"failed", reason:"Bad Request"});
        return;
    }

    // αν όλα καλά μέχρι στιγμής εκτελούμε το query προς την βάση
    db_functions.getChargesBy(stationProvider, formatDateFromString(fromDate, "00:00:00"), formatDateFromString(toDate, "23:59:59"))
    .then((result) => {
        if(result == null){
            res.status(402).json({status:"failed", reason:"No data"});
        }else{
            if(format == "json"){

                response_object =
                {
                    op1_ID: stationProvider,
                    RequestTimestamp: formatDate(requestTimestamp),
                    PeriodFrom: formatDateFromString(fromDate, "00:00:00"),
                    PeriodTo: formatDateFromString(toDate, "23:59:59"),

                    PPOList : result.rows
                };

                res.status(200).json(response_object);
            }else{
                res.status(200).set('Content-Type', 'text/csv').send(parse(result.rows));
            }
        }
    })
    .catch((err) => {
        console.log("Error on PassesCost:");
        console.log(err);
        res.status(500).json( {status:"failed", reason:"Internal server error"} );
    });
    
});

module.exports = router;