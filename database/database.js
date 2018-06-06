let db = require('mysql');
let config = require('../config/config');

let con = db.createConnection(
{
     host: config.DB_HOST,
     user: config.DB_USERNAME,
     password: config.DB_PASSWORD
});

module.exports = {
    executeQuery: (sql) => {
        try {
            con.connect(function(err) {
                if (err) throw err;
                try {
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("Result: " + result);
                    });
                } catch (err) {
                    console.log("Query execution error: " + err + "\nSQL: " + sql);
                }
            });
        } catch (err) {
            console.log("Connection error: " + err);
        }
    }
};