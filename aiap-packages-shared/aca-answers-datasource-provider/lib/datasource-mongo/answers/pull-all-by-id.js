
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'anwers-datasource-mongo-answers-pull-all-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const pullAllById = async (datasource, context, filter, answer) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.answerStores;

  let updateCondition;
  let updateOptions;
  try {
    updateCondition = {
      $pull: {
        answers: {
          id: answer.id
        }
      }
    }
    updateOptions = {
      multi: true
    }
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions
        });

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter });
    logger.error(pullAllById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  pullAllById,
}
