/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-messages-delete-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const _deleteManyByConversationId = async (datasource, context, conversationId, options) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.messages;

  let query;

  if (lodash.isEmpty(conversationId)) {
    const MESSAGE = `Missing required conversation ID parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  try {
    query = {
      _id: conversationId
    }
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__deleteMany(context, {
        collection: COLLECTION,
        options: options,
        filter: query
      });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, query });
    logger.error(_deleteManyByConversationId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const deleteManyByQuery = async (datasource, context, params, options) => {
  const RET_VAL = {
    quantity: 0
  };
  const CONVERSATION_ID = ramda.path(['conversationId'], params);

  if (!lodash.isEmpty(CONVERSATION_ID)) {
    const RESP_DELETION_BY_CONVERSATION_ID = await _deleteManyByConversationId(datasource, context, CONVERSATION_ID, options);
    if (RESP_DELETION_BY_CONVERSATION_ID) {
      RET_VAL.quantity = RET_VAL.quantity + RESP_DELETION_BY_CONVERSATION_ID.deletedCount;
    }
  }
  return RET_VAL;
}

module.exports = {
  deleteManyByQuery
}
