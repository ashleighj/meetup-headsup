"use strict"

let express = require('express')
let router = new express.Router([])
let utilities = require('../utility/utilities')
let dbService = require('../database/service')
let log = require('../log/log')
let meetup = require('../meetup/meetup')
let messages = require('../messages/messages')

module.exports = router.post('/meetup', (req, res) => {
    let rawUrl = req.body.text

    if (rawUrl.length < 1) {
        res.send(messages.errors.NO_MEETUP_URL_RECEIVED)
    }

    let trimmedUrl = utilities.getTrimmedUrl(rawUrl)

    meetup.getEventsForUrl(trimmedUrl).then((events) => {
        return new Promise(
            (resolve) => {
                let response = {
                    parse: "full",
                    response_type: "in_channel",
                    text: messages.info.successful_subscribe(events[0].group.name),
                    attachments: utilities.getEventAttachments(events),
                    unfurl_media: true,
                    unfurl_links: true
                }

                let requiredInfo = {
                    slackTeamId: req.body.team_id,
                    slackTeamName: req.body.team_domain,
                    slackChannelId: req.body.channel_id,
                    slackChannelName: req.body.channel_name,
                    meetupUrl: trimmedUrl,
                    events: utilities.getUniqueEventLinks(events),
                    responseUrl: req.body.response_url
                }

                res.send(response)
                resolve(requiredInfo)
                log.logInfo(messages.system.RESPONSE_SENT)
            })

        },(err) => {
            log.logError(err)
            res.send(messages.errors.GENERAL)

    }).then((requiredInfo) => {
        return new Promise(
            (resolve, reject) => {
                dbService.user
                    .insert(
                        requiredInfo.slackTeamId,
                        requiredInfo.slackTeamName)

                    .then((result) => {
                        log.logInfo(result)

                        dbService.user
                            .findUser(requiredInfo.slackTeamId)

                            .then((result) => {
                                requiredInfo.userId = result
                                resolve(requiredInfo)

                            },(err) => {
                                reject(err)
                            })
                     })
            })
    }).then((requiredInfo) => {
        dbService.eventSubscription
            .insert(
                requiredInfo.userId,
                requiredInfo.slackChannelId,
                requiredInfo.slackChannelName,
                requiredInfo.meetupUrl,
                requiredInfo.events,
                requiredInfo.responseUrl)

            .then((result) => {
                log.logInfo(result)

            }, (err) => {
                log.logError(err)
            })
    },(err) => {
        log.logError(err);
    })
})