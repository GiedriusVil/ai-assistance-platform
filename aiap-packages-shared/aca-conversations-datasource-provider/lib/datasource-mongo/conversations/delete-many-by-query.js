/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-conversations-delete-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { deleteOneByConversationId } = require('./delete-one-by-conversation-id');

const deleteManyByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.conversations;

  let query;

  const EMPLOYEE_ID = ramda.path(['employeeId'], params);

  let session = {
    endSession: () => { },
  };
  try {
    query = {
      employeeId: EMPLOYEE_ID
    };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESULT = await ACA_MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        filter: query,
      });

    const CONVERSATIONS = ramda.pathOr({}, [0], RESULT);

    const PROMISES = [];

    if (
      !lodash.isEmpty(CONVERSATIONS) &&
      lodash.isArray(CONVERSATIONS)
    ) {
      for (let conversation of CONVERSATIONS) {
        const PARAMS = {
          id: conversation._id
        };
        PROMISES.push(deleteOneByConversationId(datasource, context, PARAMS));
      }
    }

    const PROMISES_RESULT = await Promise.all(PROMISES);

    const RET_VAL = {
      conversations: 0,
      messages: 0,
      surveys: 0,
      feedbacks: 0,
      tones: 0,
      utterances: 0,
      environments: 0
    };

    if (
      !lodash.isEmpty(PROMISES_RESULT) &&
      lodash.isArray(PROMISES_RESULT)
    ) {
      for (let promiseResult of PROMISES_RESULT) {
        RET_VAL.conversations = RET_VAL.conversations + promiseResult.conversations;
        RET_VAL.messages = RET_VAL.messages + promiseResult.messages;
        RET_VAL.surveys = RET_VAL.surveys + promiseResult.surveys;
        RET_VAL.feedbacks = RET_VAL.feedbacks + promiseResult.feedbacks;
        RET_VAL.tones = RET_VAL.tones + promiseResult.tones;
        RET_VAL.utterances = RET_VAL.utterances + promiseResult.utterances;
        RET_VAL.environments = RET_VAL.environments = promiseResult.environments;
      }
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, query, params });
    logger.error(deleteManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  } finally {
    session.endSession();
  }
};

module.exports = {
  deleteManyByQuery
};
