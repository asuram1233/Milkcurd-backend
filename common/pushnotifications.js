'use strict';

import gcm from 'node-gcm';

const sendNotificationCampaign = (gcmKey, pushTokens, pushMessage) => {
    let sender = new gcm.Sender(gcmKey + "");

    let message = new gcm.Message({
        data: pushMessage
    });

    // Actually send the message
    sender.send(message, { registrationTokens: pushTokens }, function (err, response) {
        if (err) console.error("err ", err);
        else console.log("response ", response);
    });
}

export {
    sendNotificationCampaign
}
