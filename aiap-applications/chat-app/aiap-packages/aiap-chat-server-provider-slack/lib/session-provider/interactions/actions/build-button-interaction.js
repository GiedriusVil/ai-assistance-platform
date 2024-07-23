/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const buildButtonInteraction = (params) => {
    const BUTTON_PAYLOAD = ramda.path(['buttonPayload'], params);
    const PAYLOAD_TYPE = ramda.path(['type'], BUTTON_PAYLOAD);
    const TEXT = ramda.pathOr('', ['message'], params);
    const BUTTON = {
        type: PAYLOAD_TYPE,
        user: ramda.path(['user', 'id'], BUTTON_PAYLOAD),
        channel: ramda.path(['container', 'channel_id'], BUTTON_PAYLOAD),
        tab: 'messages',
        ts: ramda.path(['container', 'message_ts'], BUTTON_PAYLOAD),
        text: TEXT
    };
    return BUTTON;
}

module.exports = {
    buildButtonInteraction
}
