"use strict"
let express = require('express')
let router = new express.Router([])
let subscribe = require('./subscribe')

router.get('/', (req, res) => {
    res.send('Meetup Heads-up is working! Path Hit: ' + req.url)
})

router.post('/slack/action', (req, res) => {
    res.send(req.body.challenge)
})

router.use(subscribe)

module.exports = router