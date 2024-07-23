/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const getConversationIdWithDate = (update) => {
  const CONVERSATION_ID = ramda.path(['activity', 'conversation', 'id'], update);
  const CONVERSATION_DATE = new Date();
  const CONVERSATION_YEAR = CONVERSATION_DATE.getFullYear();
  const CONVERSATION_MONTH = CONVERSATION_DATE.getMonth() + 1;
  const CONVERSATION_DAY = CONVERSATION_DATE.getDate();

  const CONVERSATION_DATE_SANITIZED = CONVERSATION_YEAR + '-' + CONVERSATION_MONTH + '-' + CONVERSATION_DAY;
  const RET_VAL = CONVERSATION_ID + ':' + CONVERSATION_DATE_SANITIZED;
  return RET_VAL;
}

const sanitizeConversationReference = (conversationReference) => {
  const USER_NAME = ramda.path(['user', 'name'], conversationReference);
  if (!lodash.isEmpty(USER_NAME)) {
    delete conversationReference.user.name;
  }
}

module.exports = {
  getConversationIdWithDate,
  sanitizeConversationReference,
};
