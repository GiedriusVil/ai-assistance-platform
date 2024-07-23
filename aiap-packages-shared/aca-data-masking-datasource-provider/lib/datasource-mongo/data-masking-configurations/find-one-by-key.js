/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-data-masking-datasource-mongo-configurations-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const ReadPreference = require('mongodb').ReadPreference;

const findOneByKey = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.dataMaskingConfigurations;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };
  const PARAMS_KEY = params?.key;
  let query;
  try {
    if (
      lodash.isEmpty(PARAMS_KEY)
    ) {
      const MESSAGE = `Missing required params.key parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    query = {
      _id: PARAMS_KEY
    };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__findOne(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: query,
      });
    if (!lodash.isEmpty(RET_VAL)) {
      RET_VAL.key = RET_VAL._id;
      delete RET_VAL._id;
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(`${findOneByKey.name}`, { ACA_ERROR });
    throw error;
  }
}

module.exports = {
  findOneByKey,
}
