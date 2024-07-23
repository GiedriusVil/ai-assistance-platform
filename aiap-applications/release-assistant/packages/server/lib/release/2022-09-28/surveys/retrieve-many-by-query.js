/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-09-28-surveys-retrieve-many-by-query';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const retrieveManyByQuery = async (configuration, db) => {
  let retVal;
  let collection;
  try {
    collection = configuration?.app?.collections.surveys;

    if (
      lodash.isEmpty(collection)
    ) {
      const ERROR_MESSAGE = `Missing required configuration.app.collections.survey parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const MATCHER = {
      $match: {
        _processed_2022_09_28: {
          $ne: true
        }
      }
    };
    const LIMIT = {
      $limit: configuration.app.bulkSize
    }
    const PIPELINE = [
      MATCHER,
      LIMIT
    ];
    retVal = await db.collection(collection).aggregate(PIPELINE).toArray();
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(retrieveManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  retrieveManyByQuery,
}
