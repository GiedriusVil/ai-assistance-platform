/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-process-operations';

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');


const CONFIG_BUCKET_QUANTITY = 10;
const CONFIG_BUCKET_SIZE = 5000; // lets try 10

const processOperations = async (config, operations, db) => {
  try {

    // const ACA_MONGO_CLIENT = getAcaMongoClient(config.app.clientTarget);
    // const DB = await ACA_MONGO_CLIENT.getDB();

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
      PROMISES.push(db.collection(config.app.collections.conversations).bulkWrite(bucket, { ordered: false }));
    }
    console.timeLog('time passed');
    console.log('[BEFORE_BULK_WRITE]');
    await Promise.all(PROMISES);
    console.timeLog('time passed');
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
