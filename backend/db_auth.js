require('dotenv').config()

const mariadb = require('mariadb');
const pool = require('./dp_pool.js');

function authUser(username, password_hash) {

    return new Promise ( (fulfill, reject) => {
        console.log("authenticating user...")
        pool.query(`SELECT operatorID FROM Account WHERE Username='${username}' AND MD5PasswordHash='${password_hash}' AND deleted=0`)
            .then(rows => {
                console.log(rows);
                if(rows.length == 0){
                    console.log("Incorrect username/password");
                    fulfill(null);
                    return;
                }
                fulfill(rows[0].operatorID);
            })
            .catch(err => {
                reject(err)
            })
    })
}

module.exports = {authUser}