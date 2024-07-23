/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'anwers-datasource-mongo-answers-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { v4: uuidv4 } = require('uuid');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const importMany = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.answerStores;

  let filter;
  let updateCondition;
  let updateOptions;
  try {
    const ID = ramda.pathOr(uuidv4(), ['_id'], params);
    filter = {
      _id: ID
    };
    updateCondition = { $set: params };
    updateOptions = { upsert: true };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions
        });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(importMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  importMany
}
