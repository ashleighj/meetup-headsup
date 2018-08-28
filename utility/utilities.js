"use strict"

let decodeHtml = (html) => {
    return html
        .replace(/<p>/g,"").replace(/<\/p>/g,"\n\n")
        .replace(/<br\/>/g,"\n").replace(/\<(.*?)\>/g, "")
}

module.exports = {

    getEventAttachments: (events) => {
        let attachments = []

        for (let i = 0; i < events.length; i++) {
            attachments[attachments.length] = {
                "title": events[i].name,
                "title_link": events[i].link,
                "text": decodeHtml(events[i].description),
                "color": "#ED1C40",
                "fields": [
                    {
                        "value": events[i].link,
                        "short": false
                    },
                    {
                        "title": "Current RSVPs",
                        "value": events[i].yes_rsvp_count,
                        "short": true
                    }
                ]
            }
        }
        return attachments
    },

    getUniqueEventLinks: (events) => {
        let links = []

        for (let i = 0; i < events.length; i++) {
            links[links.length] = events[i].link
        }

        return links
    }
}