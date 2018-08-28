"use strict"

let db = require('../database/database')
let messages = require('../messages/messages')

let recordExists = (userId, slackChannelId, meetupUrl) => {
    let existsQuery =
        `select exists(
            select 1 
            from event_subscription 
            where user_id like '${userId}' 
                and slack_channel_id like '${slackChannelId}' 
                and meetup_url_subscribed like '${meetupUrl}') 
        as already_exists;`

    return new Promise((resolve, reject) => {

        db.query(existsQuery).then((result) => {
            resolve(result[0].already_exists === 1)
        },(err) => {
            reject(err)
        })
    })
}

module.exports = {

    insert: (
        userId,
        slackChannelId,
        slackChannelName,
        meetupUrl,
        lastEventsPulled,
        responseUrl) => {

        let insertQuery =
            `insert into 
                event_subscription(
                   user_id, 
                   slack_channel_id, 
                   slack_channel_name, 
                   meetup_url_subscribed, 
                   last_event_pull_datetime, 
                   last_events_pulled,
                   response_url) 
                values(
                  ${userId}, 
                  '${slackChannelId}', 
                  '${slackChannelName}', 
                  '${meetupUrl}', 
                  '${new Date().toISOString().split("T")[0]}', 
                  '${JSON.stringify(lastEventsPulled)}', 
                  '${responseUrl}');`

        return new Promise((resolve, reject) => {

            recordExists(userId, slackChannelId, slackChannelName).then((exists) => {

                if (!exists) {
                    db.query(insertQuery).then(() => {
                        resolve(messages.system.EVENT_SUB_INSERT_SUCCESS)

                    }, (err) => {
                        reject(err)
                    })
                }
                resolve(messages.system.EVENT_SUB_EXISTS)

            },(err) => {
                reject(err)
            })
        })
    }
}