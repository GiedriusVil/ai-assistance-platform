/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-update-utterances-stream';

const { Writable } = require('stream');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

let OPERATIONS = [];
let processed = 0;

const CONFIG_BUCKET_QUANTITY = 10;
const CONFIG_BUCKET_SIZE = 1000; // lets try 10

const _processOperations = async (config, operations) => {
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

    const CLIENT = getAcaMongoClient(config.app.clientTarget);
    const DB = await CLIENT.getDB();

    const PROMISES = [];
    for (let bucket of BUCKETS) {
      PROMISES.push(DB.collection(config.app.collections.utterances).bulkWrite(bucket, { ordered: false }));
    }
    console.timeLog('time passed');
    console.log('[BEFORE_BULK_WRITE]', {
      OPERATIONS_LEFT: operations.length,
      BULK_SIZE: config.app.bulkSize,
      BUCKETS_LENGTH: BUCKETS.length,
      PROMISES_LENGTH: PROMISES.length,
    });
    await Promise.all(PROMISES);
    console.timeLog('time passed');
    console.log('[AFTER_BULK_WRITE]');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(_processOperations.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateStream = (params) => {
  const config = params.config;
  const total = params.total;

  const UPDATE_UTTERANCES_STREAM = new Writable({
    objectMode: true,
    async write(record, encoding, done) {
      try {
        const REPLACE_ONE = {
          replaceOne: {
            filter: {
              _id: record._id,
            },
            replacement: record,
          }
        };
        OPERATIONS.push(REPLACE_ONE);
        if (OPERATIONS.length === config.app.bulkSize) { // 1000 writes
          await _processOperations(config, OPERATIONS);
          processed += OPERATIONS.length;
          console.log(`Processed ${processed}/${total} ${Math.round(processed / total * 1000) / 10}%`); // 234/1000 23.4%
          OPERATIONS = [];
        }
        done();
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        console.error('->', { ACA_ERROR });
        done(ACA_ERROR);
      }
    },
    async final(done) {
      try {
        if (OPERATIONS.length === 0) {
          done();
          return;
        }
        await _processOperations(config, OPERATIONS);
        processed += OPERATIONS.length;
        console.log(`Processed ${processed}/${total} ${Math.round(processed / total * 1000) / 10}%`); // 234/1000 23.4%
        console.timeLog('time passed');
        OPERATIONS = [];

        done();
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        console.error('->', { ACA_ERROR });
        done(ACA_ERROR);
      }
    }
  });

  return UPDATE_UTTERANCES_STREAM;
}

module.exports = {
  getUpdateStream,
};
