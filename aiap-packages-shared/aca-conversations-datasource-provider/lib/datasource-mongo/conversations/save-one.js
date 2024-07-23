/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-conversations-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const _sanitizeBeforeSave = (conversation) => {
  delete conversation.id;
};

const updateDuration = (conversation) => {
  conversation.duration = moment(conversation.end).diff(moment(conversation.start), 'milliseconds');
};

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.conversations;

  let filter;
  let updateCondition;
  let updateOptions;
  try {
    const CONVERSATION = ramda.path(['conversation'], params);
    const ID = ramda.pathOr(uuidv4(), ['id'], CONVERSATION);

    filter = {
      _id: ID
    };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const FOUND_CONVERSATION_RESULT = await ACA_MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        filter: filter,
      });
    const FOUND_CONVERSATION = ramda.pathOr({}, [0], FOUND_CONVERSATION_RESULT);

    if (
      lodash.isEmpty(CONVERSATION)
    ) {
      const MESSAGE = `Missing required params.conversation attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      !lodash.isEmpty(FOUND_CONVERSATION) &&
      !lodash.isEmpty(CONVERSATION)
    ) {
      let incomingInteraction = ramda.pathOr(false, ['hasUserInteraction'], CONVERSATION);
      let currentInteraction = ramda.pathOr(false, ['hasUserInteraction'], FOUND_CONVERSATION);
      CONVERSATION.hasUserInteraction = currentInteraction || incomingInteraction;
    }

    _sanitizeBeforeSave(CONVERSATION);

    if (
      !lodash.isEmpty(FOUND_CONVERSATION)
    ) {
      CONVERSATION.start = FOUND_CONVERSATION.start;
      updateDuration(CONVERSATION);
    }

    updateCondition = {
      $set: CONVERSATION
    };
    updateOptions = {
      upsert: true,
      ...params?.options,
    };

    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    CONVERSATION.id = ID;
    return CONVERSATION;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, updateCondition });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
module.exports = {
  saveOne
}
