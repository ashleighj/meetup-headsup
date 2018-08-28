let express = require('express')
let router = new express.Router([])
let utilities = require('../utility/utilities')
let request = require('request')
let config = require('../config/config')
let db = require('../database/database')
let log = require('../log/log')

let meetupAPIKey = config.MEETUP_API_KEY

module.exports = router.post('/meetup', (req, res) => {
    let rawUrl = req.body.text

    if (rawUrl.length < 1) {
        res.send(
            "We're going to need the URL of the Meetup "
            + "group whose events you'd like to subscribe to.")
    }

    let trimmedUrl = rawUrl.replace(/\"/g, "").replace(/\'/g, "").replace("www", "api")
    if (!trimmedUrl.endsWith("/")) {
        trimmedUrl += "/"
    }

    let getEvents = new Promise((resolve, reject) => {
        let options = {
            url: trimmedUrl + "events?sign=true&key=" + meetupAPIKey,
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
                res.send("Are you sure about that url?")
            }
        })
    })

    getEvents.then((events) => {
        return new Promise(
            (resolve) => {
                let response = {
                    "parse": "full",
                    "response_type": "in_channel",
                    "text": "You have successfully subscribed to receive notifications about events by\n*"
                            + events[0].group.name
                            + "*\nHere are their current upcoming events:",
                    "attachments": utilities.getEventAttachments(events),
                    "unfurl_media": true,
                    "unfurl_links": true
                }

                let requiredInfo = {
                    slackTeamId: req.body.team_id,
                    slackTeamName: req.body.team_domain,
                    slackChannelId: req.body.channel_id,
                    slackChannelName: req.body.channel_name,
                    meetupUrl: trimmedUrl,
                    events: utilities.getUniqueEventLinks(events)
                }

                res.send(response)
                resolve(requiredInfo)
            })

        },(err) => {
            log.logError("Couldn't do a damn thing.\n" + err)
            res.send("Small gremlin in the engine, please try again.")

    }).then((requiredInfo) => {
        return new Promise(
            (resolve) => {
                let existsQuery = "select exists(select 1 from user where slack_id like '"
                                  + requiredInfo.slackTeamId + "') as already_exists;"

                let addQuery = "insert into user(slack_id, slack_domain) values ('"
                               + requiredInfo.slackTeamId + "', '" + requiredInfo.slackTeamName + "');"

                let findUserQuery = "select id from user where slack_id like '" + requiredInfo.slackTeamId + "'"

                // Check user exists. If not, add.
                db.query(existsQuery).then((result) => {
                    if (result[0].already_exists === 0) {

                        // New user - add 'em
                        db.query(addQuery).then((result) => {
                            log.logInfo("New user successfully added to DB")
                            log.logInfo("Result: " + result.toString())

                            db.query("select LAST_INSERT_ID() as user_id;").then((result) => {
                                requiredInfo.userId = result[0].user_id
                                resolve(requiredInfo)

                            },(err) => {
                                log.logError("Could not retrieve last inserted user_id.\nError:" + err)
                            })

                        }, (err) => {
                            log.logError("DB query to add new user has failed.\nError: " + err)
                        })
                    }

                    db.query(findUserQuery).then((result) => {
                            requiredInfo.userId = result[0].id
                            resolve(requiredInfo)

                    }, (err) => {
                        log.logError("DB query to add new user has failed.\nError: " + err)
                    })

                }, (err) => {
                    log.logError("DB query to check if the user exists has failed.\nError: " + err)
                })
            })
        },(err) => {
            log.logError("Everything went to shit when trying to handle user\n" + err);
    }).then((requiredInfo) => {
        let existsQuery = "select exists(select 1 from event_subscription where "
                          + "user_id like '" + requiredInfo.userId + "' and "
                          + "slack_channel_id like '" + requiredInfo.slackChannelId + "' and "
                          + "meetup_url_subscribed like '" + requiredInfo.meetupUrl + "') as already_exists;"

        let addQuery = "insert into event_subscription("
                            + "user_id, "
                            + "slack_channel_id, "
                            + "slack_channel_name, "
                            + "meetup_url_subscribed, "
                            + "last_event_pull_datetime, "
                            + "last_events_pulled) "
                       + "values("
                            + requiredInfo.userId + ", '"
                            + requiredInfo.slackChannelId + "', '"
                            + requiredInfo.slackChannelName + "', '"
                            + requiredInfo.meetupUrl + "', '"
                            + new Date().toISOString().split("T")[0] + "', '"
                            + JSON.stringify(requiredInfo.events) + "' "
                       + ");"

        // Check if subscription exists. If not, add.
        db.query(existsQuery).then((result) => {
            if (result[0].already_exists === 0) {

                // New event subscription - add it
                db.query(addQuery).then((result) => {
                    log.logInfo("New subscription successfully added to DB")

                }, (err) => {
                    log.logError("DB query to add new subscription has failed.\nError: " + err)
                })
            }
        
        }, (err) => {
            log.logError("DB query to check if the subscription exists has failed.\nError: " + err)
        })
    },(err) => {
        log.logError("Everything went to shit when trying to handle event sub\n" + err);
    })

})