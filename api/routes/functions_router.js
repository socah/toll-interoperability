const express = require('express');
const router = express.Router();
const db_functions = require('../../backend/db_functions.js');

// TODO : Do not forget to check format GET param for csv, json

router.get("/PassesPerStation/:stationID/:date_from/:date_to", (req, res) =>{
    // TODO : check format
    // TODO : send csv
    

    // check if authorized
    authorized = true;
    if(!authorized){
        res.status(401).json({status:"failed", reason:"Not authorized"});
        return;
    }

    // ελέγχουμε αν οι παράμετροι είναι ορθές
    good_request = true;
    if(!good_request){
        res.status(400).json({status:"failed", reason:"Bad Request"});
        return;
    }

    // αν όλα καλά μέχρι στιγμής εκτελούμε το query προς την βάση
    db_functions.getPassesPerStation()
    .then((result) => {
        if(result == null){
            res.status(402).json({status:"failed", reason:"No data"});
        }else{
            res.status(200).json(result);
        }
    })
    .catch(() => res.status(500).json( {status:"failed", reason:"Internal server error"} ));
   
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