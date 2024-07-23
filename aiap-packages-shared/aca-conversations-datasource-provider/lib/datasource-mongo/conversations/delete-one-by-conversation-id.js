/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-conversations-delete-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');


const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const _messages = require('../messages');
const _surveys = require('../surveys');
const _feedbacks = require('../feedbacks');
const _tones = require('../tones');
const _utterances = require('../utterances');
const _environments = require('../environments');

const _deleteOne = async (datasource, context, params, options) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.conversations;

  let filter;

  const CONVERSATION_ID = ramda.path(['id'], params);
  if (lodash.isEmpty(CONVERSATION_ID)) {
    const MESSAGE = (`Missing required conversation ID attribute`);
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  filter = {
    _id: CONVERSATION_ID,
  };
  try {
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__deleteOne(context, {
        collection: COLLECTION,
        filter: filter,
        options: options
      });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, params });
    logger.error(_deleteOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


const deleteOneByConversationId = async (datasource, collections, context, params) => {
  const CONVERSATION_ID = ramda.path(['id'], params);
  let session = {
    endSession: () => { },
  };
  try {
    const CLIENT = await datasource._getClient();
    session = await CLIENT.startSession();
    session.startTransaction();

    const PARAMS = {
      conversationId: CONVERSATION_ID,
    };

    const RET_VAL = {};
    const PROMISES = [];

    const OPTIONS = {
      session: session
    };

    PROMISES.push(_deleteOne(datasource, context, params, OPTIONS));
    PROMISES.push(_messages.deleteManyByQuery(datasource, context, PARAMS, OPTIONS));
    PROMISES.push(_surveys.deleteManyByQuery(datasource, context, PARAMS, OPTIONS));
    PROMISES.push(_feedbacks.deleteManyByQuery(datasource, context, PARAMS, OPTIONS));
    PROMISES.push(_tones.deleteManyByQuery(datasource, context, PARAMS, OPTIONS));
    PROMISES.push(_utterances.deleteManyByQuery(datasource, context, PARAMS, OPTIONS));
    PROMISES.push(_environments.deleteManyByQuery(datasource, context, PARAMS, OPTIONS));

    const PROMISES_RESULTS = await Promise.all(PROMISES);

    RET_VAL.conversations = PROMISES_RESULTS[0].deletedCount;
    RET_VAL.messages = PROMISES_RESULTS[1].deletedCount;
    RET_VAL.surveys = PROMISES_RESULTS[2].deletedCount;
    RET_VAL.feedbacks = PROMISES_RESULTS[3].deletedCount;
    RET_VAL.tones = PROMISES_RESULTS[4].deletedCount;
    RET_VAL.utterances = PROMISES_RESULTS[5].deletedCount;
    RET_VAL.environments = PROMISES_RESULTS[6].deletedCount;

    logger.info(`CONVERSATION_DELETION_RESULT: `, RET_VAL);

    await session.commitTransaction();

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteOneByConversationId.name, { ACA_ERROR });
    throw ACA_ERROR;
  } finally {
    session.endSession();
    logger.info(`SESSION ended: `);
  }

};

module.exports = {
  deleteOneByConversationId
};
