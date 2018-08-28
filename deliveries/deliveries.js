"use strict"

let schedule = require('node-schedule')
let db = require('../database/database')

module.exports = {
    scheduleDeliveries: () => schedule.scheduleJob('* * */24 * *', deliveryJob)
}

let deliveryJob = () => {
    db.query("select * from event_subscription").then((result) => {

    },(err) => {

    })
}