let schedule = require('node-schedule');
let db = require('../database/database');

module.exports = {
    scheduleDeliveries: () => schedule.scheduleJob('* * */24 * *', function(){
        console.log('The answer to life, the universe, and everything!');
    })
};