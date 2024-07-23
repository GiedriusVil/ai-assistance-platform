/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const addDateToConversationId = (conversationId) => {
    const CONVERSATION_ID = conversationId;
    const CONVERSATION_DATE = new Date();
    const CONVERSATION_DATE_SANITIZED = CONVERSATION_DATE.getFullYear() + '-' + CONVERSATION_DATE.getMonth() + 1 + '-' + CONVERSATION_DATE.getDate();
    const RET_VAL = CONVERSATION_ID + ':' + CONVERSATION_DATE_SANITIZED;
    return RET_VAL;
}

module.exports = {
    addDateToConversationId,
}; 
