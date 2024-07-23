/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-datasource-mongo-test-cases-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { v4: uuidv4 } = require('uuid');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.testCases;

  let filter;
  try {
    const INSTANCE = ramda.path(['testCase'], params);
    if (
      lodash.isEmpty(INSTANCE)
    ) {
      const MESSAGE = 'Missing required params.testCase attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const ID = ramda.pathOr(uuidv4(), ['id'], INSTANCE);
    const USERNAME = ramda.path(['user', 'username'], context);

    if (
      lodash.isEmpty(INSTANCE.created) &&
      lodash.isEmpty(INSTANCE.createdBy)
    ) {
      INSTANCE.createdBy = USERNAME;
      INSTANCE.created = new Date();
    }

    INSTANCE.changed = new Date();
    INSTANCE.changedBy = USERNAME;

    delete INSTANCE.id;
    filter = {
      _id: ID
    }
    const UPDATE_SET_CONDITION = {
      $set: INSTANCE
    };
    const UPDATE_OPTIONS = {
      upsert: true
    };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: UPDATE_SET_CONDITION,
          options: UPDATE_OPTIONS,
        });

    INSTANCE.id = ID;
    return INSTANCE;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
