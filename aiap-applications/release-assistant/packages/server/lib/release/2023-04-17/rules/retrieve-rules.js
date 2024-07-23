/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2023-04-17-rules-retrieve-rules';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const retrieveRules = async (config, db) => {
  let retVal;
  try {
    const MATCHER = {
      $match: {
        'buyer.name': null,
      },
    };

    const PIPELINE = [MATCHER];
    retVal = await db
      .collection(config.app.collections.rules)
      .aggregate(PIPELINE)
      .toArray();
      
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveRules.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  retrieveRules,
};
