require('dotenv').config({path: "./../api/.env"})

const pool = require('./dp_pool.js');;
const {testConnection, deletePasses, populateStations, populateVehicles, populatePasses} = require('./db_admin.js');
const {authUser} = require("./db_auth.js");
const {getPassesPerStation, getPassesAnalysis, getPassesCost, getChargesBy} = require("./db_functions.js");
const {getSettlements, getSettlementPasses, getSettlementAmount, clearSetlement} = require("./db_settlements.js");

const mocha = require("mocha")
const assert = require("assert")
const {formatDate, formatDateFromString} = require("../api/utilities/date_formater.js")






describe("db_admin.js",  () => {

    it("testConnection()", async () => {
        await testConnection();
    })

    // did not add tests for the rest of db_admin.js
    // it would change the DB too much

})

describe("db_auth.js", () => {

    username = "tralalala";
    password_hash = "5f4dcc3b5aa765d61d8327deb882cf99"; // md5 hash of "password"
    provider = "aodos";

    before(async () =>{
        await pool.query(`INSERT INTO Account (Username, MD5PasswordHash, operatorID) VALUES ('${username}', '${password_hash}', '${provider}')`)
    })

    after(async () => {
        await pool.query(`DELETE FROM Account WHERE Username='${username}'`) 
    })


    it("authUser()", async () => {

        value = await authUser(username, password_hash);

        assert(value == provider);
     
    })

})

describe("db_functions.js", () => {


    it("getPassesPerStation()", async () => {
        stationID = "NE08"
        dateFrom =  "20210117"
        dateTo =    "20210120"

        result = await getPassesPerStation(stationID, formatDateFromString(dateFrom, "00:00:00"), formatDateFromString(dateTo, "23:59:59"));
    

        assert(result.stationProvider == "nea_odos");
        
        expected_rows =
        [
            {
              PassID: 'JCX6175558',
              PassTimestamp: new Date("2021-01-17T23:43:00.000Z"),
              VehicleID: 'IW53OQE31439',
              TagProvider: 'egnatia',
              PassType: 'visitor',
              PassCharge: 2.2
            },
            {
              PassID: 'OEE5160485',
              PassTimestamp: new Date("2021-01-18T03:34:00.000Z"),
              VehicleID: 'MA30QLI76818',
              TagProvider: 'gefyra',
              PassType: 'visitor',
              PassCharge: 2.5
            },
            {
              PassID: 'WCJ0058925',
              PassTimestamp: new Date("2021-01-19T01:49:00.000Z"),
              VehicleID: 'JV67MTI17124',
              TagProvider: 'nea_odos',
              PassType: 'home',
              PassCharge: 2.5
            },
        ]


        assert(JSON.stringify(result.rows) == JSON.stringify(expected_rows));
    })

    it("getPassesAnalysis()", async () => {
        opID_1 = "aodos";
        opID_2 = "gefyra";
        dateFrom =  "20210120";
        dateTo =    "20210125";

        result = await getPassesAnalysis(opID_1, opID_2, formatDateFromString(dateFrom, "00:00:00"), formatDateFromString(dateTo, "23:59:59"));

        expected_rows = [
            {
                PassID: 'UFL2436261',
                StationID: 'AO06',
                TimeStamp: new Date("2021-01-24T04:33:00.000Z"),
                VehicleID: 'CK97FAU13897',
                Charge: 2.8
              },
              {
                PassID: 'WFY6778676',
                StationID: 'AO00',
                TimeStamp: new Date("2021-01-21T02:12:00.000Z"),
                VehicleID: 'CP56DAO45598',
                Charge: 2.8
              },
        ]

        assert(JSON.stringify(result.rows) == JSON.stringify(expected_rows))
    })

    it("getPassesCost()", async () => {
        stationProvider = "aodos";
        tagProvider = "egnatia";
        dateFrom = "20190613";
        dateTo = "20210613";

        result = await getPassesCost(stationProvider, tagProvider, formatDateFromString(dateFrom, "00:00:00"), formatDateFromString(dateTo, "23:59:59"));
    
        expected_obj = { NumberOfPasses: 217, PassesCost: 607.6 };

        assert(JSON.stringify(result.rows[0]) == JSON.stringify(expected_obj))
    })

    it("getChargesBy()", async () => {
        opID = "aodos"
        dateFrom = "20210120"
        dateTo = "20210222"

        result = await getChargesBy(opID, formatDateFromString(dateFrom, "00:00:00"), formatDateFromString(dateTo, "23:59:59"));

        expected = [
            {
                VistingOperator: 'egnatia',
                NumberOfPasses: 13,
                PassesCost: 36.4
            },
            {
                VistingOperator: 'gefyra',
                NumberOfPasses: 8,
                PassesCost: 22.4 
            },
            {
                VistingOperator: 'kentriki_odos',
                NumberOfPasses: 13,
                PassesCost: 36.4
            },
            {
                VistingOperator: 'moreas', 
                NumberOfPasses: 16, 
                PassesCost: 44.8 
            },
            {
                VistingOperator: 'nea_odos',
                NumberOfPasses: 4,
                PassesCost: 11.2
            },
            {
                VistingOperator: 'olympia_odos',
                NumberOfPasses: 10,
                PassesCost: 28
            }
        ];

        assert(JSON.stringify(result.rows) == JSON.stringify(expected));
    })    
})

describe("db_settlements.js", () => {

    settlement_id = 123123;
    fromDate = "2020-01-01";
    toDate = "2020-02-01";
    amount = 123;
    op_credited = "aodos";
    op_debided = "gefyra";

    transactionID = "hahahaha-123";

    before(async () => {
        await pool.query(`INSERT INTO Settlement VALUES (${settlement_id},'${fromDate}','${toDate}',${amount},NULL,0,'${op_credited}','${op_debided}')`)
    })

    after(async () => {
        await pool.query(`DELETE FROM Settlement WHERE settlementID=${settlement_id}`)
    })

    it("getSettlements()", async () => {

        result = await getSettlements(op_credited);

        assert(result != null); // if there are no settlements it returns null

        // check if the settlement is added
        assert( result.find((element) => {
            return element.settlementID == settlement_id && element.Type == "credit"
        }) != undefined );

    })

    it("getSettlementPasses()", async () => {

        result = await getSettlementPasses(settlement_id);

        // for now no passes are assosiated with the settlement
        assert(result == null);

    })

    it("getSettlementAmount()", async () => {

        result = await getSettlementAmount(settlement_id);

        // for now no passes are assosiated with the settlement
        assert(result == amount);

    })

    it("clearSetlement()", async () => {

        await clearSetlement(settlement_id, transactionID);

        // find the settlement and check if it is paid

        result = await pool.query("SELECT * FROM Settlement WHERE settlementID = ?", [settlement_id]);


        assert( result[0].paid == 1);
        assert(result[0].transactionID == transactionID);

    })


})

describe("dummy test to close pool", () => {

    it("closed pool", async () => {
        await pool.end();
    })
})
