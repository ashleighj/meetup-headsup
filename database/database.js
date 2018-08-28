"use strict"
let db = require('mysql')
let config = require('../config/config')

class Database {
    constructor() {
        this.connection = db.createConnection({
             host: config.DB_HOST,
             user: config.DB_USERNAME,
             password: config.DB_PASSWORD,
             database: config.DB_NAME
        })
    }

    query(sql, args) {
        return new Promise(
            (resolve, reject) => {
                this.connection.query(sql, args, (err, rows) => {
                    if (err)
                        return reject(err)
                    resolve(rows)
                })
            })
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end( err => {
                if (err)
                    return reject(err)
                resolve()
            })
        })
    }
}

module.exports = new Database()