"use strict"

let decodeHtml = (html) => {
    return html
        .replace(/<p>/g,"").replace(/<\/p>/g,"\n\n")
        .replace(/<br\/>/g,"\n").replace(/\<(.*?)\>/g, "")
}

module.exports = {

    getTrimmedUrl: (rawUrl) => {
        let trimmedUrl
            = rawUrl
            .replace(/\"/g, "")
            .replace(/\'/g, "")
            .replace("www", "api")

        if (!trimmedUrl.endsWith("/")) {
            trimmedUrl += "/"
        }

        return trimmedUrl
    },

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
    },

    getDbDateTimeString: (datetime) => {
        let date = datetime.toISOString().split("T")[0]
        let time = datetime.toISOString().split("T")[1]
        time = time.split(".")[0]

        return date + " " + time
    }
}