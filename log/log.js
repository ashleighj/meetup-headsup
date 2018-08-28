let getCurrentTime = function() {
    let now = new Date()
    let hours = now.getHours().toString().length > 1 ? now.getHours() : ("0" + now.getHours())
    let minutes = now.getMinutes().toString().length > 1 ? now.getMinutes() : ("0" + now.getMinutes())
    let seconds = now.getSeconds().toString().length > 1 ? now.getSeconds() : ("0" + now.getSeconds())
    return hours + ":" + minutes + ":" + seconds
};

module.exports = {

    logInfo: (message) => {
        console.log(getCurrentTime() + "  INFO  " + message)
    },

    logError: (message) => {
        console.log(getCurrentTime() + "  ERROR  " + message)
    }
};