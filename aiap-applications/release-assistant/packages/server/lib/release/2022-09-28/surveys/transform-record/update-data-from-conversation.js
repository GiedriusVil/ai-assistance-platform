/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-09-31-surveys-transform-record-update-data-from-conversation';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { retrieveConversationById } = require('../../helpers/retrieve-conversation-by-id');

const updateDataFromConversation = async (configuration, db, survey) => {
  let conversationId;
  let conversation;
  let userId;
  try {
    if (
      !lodash.isEmpty(survey)
    ) {
      userId = survey?.userId;
      if (
        lodash.isEmpty(userId)
      ) {
        conversationId = survey?.conversationId;
        conversation = await retrieveConversationById(configuration, db, conversationId);
        survey.userId = conversation?.userId;
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(updateDataFromConversation.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  updateDataFromConversation,
}
