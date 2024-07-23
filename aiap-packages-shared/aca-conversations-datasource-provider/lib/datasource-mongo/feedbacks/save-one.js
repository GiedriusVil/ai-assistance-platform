/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasoure-feedbacks-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const sanitizedFeedback = params => {
  const CONVERSATION_ID = ramda.path(['feedback', 'conversationId'], params);
  const USER_ID = ramda.path(['feedback', 'userId'], params);
  const MESSAGE_ID = ramda.path(['feedback', 'messageId'], params);
  const UTTERANCE_ID = ramda.pathOr(MESSAGE_ID, ['feedback', 'utteranceId'], params);
  const SCORE = ramda.path(['feedback', 'score'], params);
  const REASON = ramda.path(['feedback', 'reason'], params);
  const COMMENT = ramda.path(['feedback', 'comment'], params);
  const ASSISTANT_ID = ramda.path(['feedback', 'assistant'], params);
  const TENANT_ID = ramda.path(['feedback', 'tenant'], params);
  const CREATED = ramda.pathOr(new Date(), ['feedback', 'created'], params);
  const _ID = ramda.pathOr(`${CONVERSATION_ID}:${UTTERANCE_ID}`, ['feedback', '_id'], params);
  const RET_VAL = {
    _id: _ID,
    conversationId: CONVERSATION_ID,
    userId: USER_ID,
    utteranceId: UTTERANCE_ID,
    messageId: MESSAGE_ID,
    score: SCORE,
    reason: REASON,
    comment: COMMENT,
    assistantId: ASSISTANT_ID,
    tenantId: TENANT_ID,
    created: CREATED
  };
  return RET_VAL;
}

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.feedbacks;

  let filter;
  let updateCondition;
  let updateOptions;
  try {
    const SANITIZED_FEEDBACK = sanitizedFeedback(params);
    filter = {
      _id: SANITIZED_FEEDBACK._id
    };
    updateCondition = {
      $set: SANITIZED_FEEDBACK
    };
    updateOptions = {
      upsert: true
    }

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    const RET_VAL = {
      modified: ramda.pathOr(0, ['modifiedCount'], RESPONSE),
      upserted: ramda.pathOr(0, ['upsertedCount'], RESPONSE)
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, updateCondition });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne
};
