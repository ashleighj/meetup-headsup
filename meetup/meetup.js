"use strict"

let config = require('../config/config')
let meetupAPIKey = config.MEETUP_API_KEY
let request = require('request');

module.exports = {

    getEventsForUrl: (url) => {
        return new Promise((resolve, reject) => {
            let options = {
                url: url + "events?sign=true&key=" + meetupAPIKey,
                headers: {
                }
            }

            request.get(options, (err, resp, body) => {
                try {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(body))
                    }
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
}