/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const { checkForExistingUser } = require('../../utils/index');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const buildAppHomeOpenedEvent = async (params) => {
    const MESSAGE = ramda.path(['message'], params);
    const BODY = ramda.path(['body'], params);
    const SETTINGS = ramda.path(['settings'], params);
    let userMessage = {};
    const EXISTING_USER = await checkForExistingUser({
        rawUpdate: MESSAGE,
        settings: SETTINGS
    });
    if (lodash.isEmpty(EXISTING_USER)) {
        userMessage = MESSAGE;
        userMessage['ts'] = ramda.path(['event_ts'], MESSAGE);
        userMessage['text'] = '§§§RESTART_CONVERSATION'
        userMessage['team'] = ramda.path(['authorizations', 0, 'team_id'], BODY);
        return userMessage;
    } else {
        return userMessage;
    }
}

module.exports = {
    buildAppHomeOpenedEvent
}
