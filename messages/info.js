"use strict"

module.exports = {
    successful_subscribe: (group) => {
        return `You have successfully subscribed to receive notifications about events by *${group}*
                \nHere are their current upcoming events:`
    }
}