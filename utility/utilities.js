module.exports = {

    decodeHtml: (html) => {
        return html
            .replace(/<p>/g,"").replace(/<\/p>/g,"\n\n")
            .replace(/<br\/>/g,"\n").replace(/\<(.*?)\>/g, "");
    },

    getEventAttachments: (events) => {
        let attachments = [];

        for (let i = 0; i < events.length; i++) {
            attachments[attachments.length] = {
                "title": events[i].name,
                "title_link": events[i].link,
                "text": this.decodeHtml(events[i].description),
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
            };
        }
        return attachments;
    }
};