const express = require('express');
const router = express.Router();
const db_functions = require('../../backend/db_functions.js');

// TODO : Do not forget to check format GET param for csv, json


function formatDate(date){
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

function formatDateFromString(date, time){
    return date.slice(0,4) + "-" + date.slice(4,6) + "-" + date.slice(6, 8) + " " + time;
}


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
            if(format == "csv"){
                // TODO : add csv conversion
            }

            // Προσθέτουμε τον αύξοντα αριθμό PassIndex για κάθε row
            // και κάνουμε format το timestamp
            result.rows.forEach((element, index) => {
                element.PassIndex = index+1;
                element.PassTimestamp = formatDate(element.PassTimestamp);
            });

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
        }
    })
    .catch((err) => {
        console.log("Error on PassesPerStation:");
        console.log(err);
        res.status(500).json( {status:"failed", reason:"Internal server error"} );
    });
   
});


router.get("/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to", (req, res) =>{

    res.status(404).send("Not implemented Yet");

});

router.get("/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to", (req, res) =>{

    res.status(404).send("Not implemented Yet");
    
});

router.get("/ChargesBy/:op_ID/:date_from/:date_to", (req, res) =>{

    res.status(404).send("Not implemented Yet");
    
});

module.exports = router;