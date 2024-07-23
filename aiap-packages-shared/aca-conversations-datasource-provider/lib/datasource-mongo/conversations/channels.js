/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-conversations-channels';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const channels = async (datasource, context, params) => {
  const COLLECTION = datasource._collections.conversations;
  const KEY = params?.key;
  if (lodash.isEmpty(KEY)) {
    const MESSAGE = (`Missing required params.key attribute`);
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
  }

  try {
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT
      .__distinct(context,
        {
          collection: COLLECTION,
          key: KEY,
        });
    return RESPONSE;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(channels.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  channels,
};
