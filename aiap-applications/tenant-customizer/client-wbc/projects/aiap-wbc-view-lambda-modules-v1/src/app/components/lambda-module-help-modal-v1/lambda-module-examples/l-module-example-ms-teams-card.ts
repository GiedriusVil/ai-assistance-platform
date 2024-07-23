/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
export const L_MODULE_EXAMPLE_MS_TEAMS_CARD = `
#### MS Teams Card
\`\`\`javascript
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ACTION_TYPE = {
    SUBMIT_USER_SELECTION: 'buttons',
};
const AdaptiveCard = (context, params) => {
    const MESSAGE = ramda.path(['message'], params);
    const CARD = {
        type: 'AdaptiveCard',
        version: '1.4',
        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
        body: [],
        actions: []
    }
    if (MESSAGE.text) {
        CARD.body.push({
            type: 'TextBlock',
            text: MESSAGE.text,
            wrap: true
        });
    }
    const ATTACHMENTS = ramda.path(['attachment', 'attachments'], MESSAGE);
    if (ATTACHMENTS) {
        ATTACHMENTS.forEach(item => {
            CARD.actions.push({
                type: 'Action.Execute',
                title: item.payload,
                verb: ACTION_TYPE.SUBMIT_USER_SELECTION,
                //set empty (or with payload) data object for correct loading on iOS Teams app
                data: {
                    payload: item.payload,
                }
            });
        });
    }
    return CARD;
};
module.exports = {
    AdaptiveCard
};
\`\`\`
`;
