/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-09-31-helpers-process-operations';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const CONFIG_BUCKET_QUANTITY = 10;
const CONFIG_BUCKET_SIZE = 5000;

const processOperations = async (configuration, db, operations) => {
  let collection;
  try {
    collection = configuration?.app?.collections.surveys;
    if (
      lodash.isEmpty(collection)
    ) {
      const ERROR_MESSAGE = `Missing required configuration.app.collections.survey parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const BUCKETS = [];
    for (let bucketIndex = 0; bucketIndex < CONFIG_BUCKET_QUANTITY; bucketIndex++) {
      let leftOperations = (operations.length - bucketIndex * CONFIG_BUCKET_SIZE);
      if (
        leftOperations > 0
      ) {
        if (
          leftOperations > CONFIG_BUCKET_SIZE
        ) {
          BUCKETS.push(operations.slice(bucketIndex * CONFIG_BUCKET_SIZE, (bucketIndex + 1) * CONFIG_BUCKET_SIZE));
        } else {
          BUCKETS.push(operations.slice(bucketIndex * CONFIG_BUCKET_SIZE));
          break;
        }
      }
    }
    const PROMISES = [];
    for (let bucket of BUCKETS) {
      PROMISES.push(db.collection(collection).bulkWrite(bucket, { ordered: false }));
    }
    console.timeLog('time');
    console.log('[BEFORE_BULK_WRITE]');
    await Promise.all(PROMISES);
    console.timeLog('time');
    console.log('[AFTER_BULK_WRITE]');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(processOperations.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

module.exports = {
  processOperations,
}
