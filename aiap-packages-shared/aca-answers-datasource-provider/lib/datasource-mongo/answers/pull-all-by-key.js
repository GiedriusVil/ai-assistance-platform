
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'anwers-datasource-mongo-answers-pull-all-by-key';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const pullAllByKey = async (datasource, context, filter, answer) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.answerStores;

  let pullCondition;
  let pullOptions;
  try {
    pullCondition = {
      $pull: {
        answers: {
          key: answer.key
        }
      }
    }
    pullOptions = {
      multi: true
    }
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: pullCondition,
          options: pullOptions,
        });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter });
    logger.error(pullAllByKey.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  pullAllByKey,
}
