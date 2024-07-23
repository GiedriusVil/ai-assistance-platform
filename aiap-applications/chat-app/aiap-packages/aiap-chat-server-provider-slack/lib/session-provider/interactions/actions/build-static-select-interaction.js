
/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const buildStaticSelectInteraction = (payload) => {
    const OPTIONS_VALUE = payload.actions[0].selected_option.value
    const RET_VAL = {
        type: payload.type,
        user: ramda.path(['user', 'id'], payload),
        channel: ramda.path(['container', 'channel_id'], payload),
        tab: 'messages',
        ts: ramda.path(['container', 'message_ts'], payload),
        text: OPTIONS_VALUE
    };
    return RET_VAL;
}
module.exports = {
    buildStaticSelectInteraction
}
