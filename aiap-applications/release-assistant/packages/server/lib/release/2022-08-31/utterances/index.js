/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances';

const { pipeline } = require('stream/promises');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getTransformStream } = require('./transformStream');
const { getUpdateStream } = require('./getUpdateStream');
const { getFindStream } = require('./getFindStream');

const run = async (config) => {
  try {
    console.log('### UTTERANCES UPDATE STARTED');
    console.time('time passed');
    const ACA_MONGO_CLIENT = getAcaMongoClient(config.app.client);
    const DB = await ACA_MONGO_CLIENT.getDB();

    // get count of utterances
    const [
      TOTAL,
      TOTAL_PROCESSED_COUNT,
      TOTAL_UNPROCESSED_COUNT,
    ] = await Promise.all([
      DB.collection(config.app.collections.utterances).count(),
      DB.collection(config.app.collections.utterances).count({
        _processed_2022_08_31: true
      }),
      DB.collection(config.app.collections.utterances).count({
        _processed_2022_08_31: {
          $ne: true
        }
      })
    ]);
    console.log('--> TOTAL:', TOTAL);
    console.log('--> TOTAL_PROCESSED_COUNT:', TOTAL_PROCESSED_COUNT);
    console.log('--> TOTAL_UNPROCESSED_COUNT', TOTAL_UNPROCESSED_COUNT);
    console.timeLog('time passed');

    await pipeline(
      await getFindStream(DB, { config }),
      getTransformStream({ config }),
      getUpdateStream({ config, total: TOTAL_UNPROCESSED_COUNT }),
    );

    const COUNT_AFTER = await DB.collection(config.app.collections.utterances).find({ _processed: true }).count();
    console.log('--> RECORDS COUNT AFTER UPDATE:', COUNT_AFTER);
    console.log('### UTTERANCES UPDATE FINISHED');
    console.timeEnd('time passed');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  run,
};
