/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-feedbacks-delete-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const _deleteManyByConversationId = async (datasource, context, conversationId, options) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.feedbacks;

  let filter;
  if (lodash.isEmpty(conversationId)) {
    const MESSAGE = `Missing required conversation ID parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  try {
    filter = {
      _id: conversationId
    }
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__deleteMany(context, {
        collection: COLLECTION,
        options: options,
        filter: filter
      });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter });
    logger.error(_deleteManyByConversationId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const deleteManyByQuery = async (datasource, context, params, options) => {
  const RET_VAL = {
    deletedCount: 0
  };
  const CONVERSATION_ID = ramda.path(['conversationId'], params);

  if (!lodash.isEmpty(CONVERSATION_ID)) {
    const RESP_DELETION_BY_CONVERSATION_ID = await _deleteManyByConversationId(datasource, context, CONVERSATION_ID, options);
    if (RESP_DELETION_BY_CONVERSATION_ID) {
      RET_VAL.deletedCount = RET_VAL.deletedCount + RESP_DELETION_BY_CONVERSATION_ID.deletedCount;
    }
  }
  return RET_VAL;
}

module.exports = {
  deleteManyByQuery
}
