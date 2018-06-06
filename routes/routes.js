var express = require('express');
var router = new express.Router();
let utilities = require('../utility/utilities');
let request = require('request');
let config = require('../config/config');

let meetupAPIKey = config.MEETUP_API_KEY;

router.get('/', function(req, res) {
    res.send('Meetup Heads-up is working! Path Hit: ' + req.url);
});

router.post('/meetup', function(req, res) {
    let rawUrl = req.body.text;

    if (rawUrl.length < 1) {

    }

    let trimmedUrl = rawUrl.replace(/\"/g, "").replace(/\'/g, "").replace("www", "api");
    if (!trimmedUrl.endsWith("/")) {
        trimmedUrl += "/";
    }

    var getEvents = new Promise(function(resolve, reject){
        var options = {
            url: trimmedUrl + "events?sign=true&key=" + meetupAPIKey,
            headers: {
            }
        };

        request.get(options, function(err, resp, body) {
            try {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(body));
                }
            } catch (err) {
                res.send("Are you sure about that url?");
            }
        })
    });

    getEvents.then(function(events) {
        let response = {
            "parse": "full",
            "response_type": "in_channel",
            "text": "You have successfully subscribed to receive notifications about events by\n*" + events[0].group.name
                    + "*\nHere are their current upcoming events:",
            "attachments": utilities.getEventAttachments(events),
            "unfurl_media":true,
            "unfurl_links":true
        };

        res.send(response);
    }, function(err) {
        console.log("Couldn't do a damn thing.\n" + err);
        res.send("Small gremlin in the engine, please try again.");
    });
});

router.post('/slack/action', function(req, res) {
    res.send(req.body.challenge);
});

module.exports = router;