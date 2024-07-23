/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2023-03-30-doc-validations-process-operations';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const CONFIG_BUCKET_QUANTITY = 10;
const CONFIG_BUCKET_SIZE = 100;

const processOperations = async (config, operations, db) => {
  try {

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
      PROMISES.push(db.collection(config.app.collections.docValidationAudits).bulkWrite(bucket, { ordered: false }));
    }
    
    logger.info('[BEFORE_BULK_WRITE]');
    await Promise.all(PROMISES);
    logger.info('[AFTER_BULK_WRITE]');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processOperations.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

module.exports = {
  processOperations,
}
