const moment = require('moment'); // Used to get current time

// Changes all messages sent from server to be an object instead of string
function formatMessage(username, text){
    return {
        username: username,
        text: text,
        time: moment().format('h:mm a') // Hours, minutes, AM/PM
    };
}

module.exports = formatMessage;