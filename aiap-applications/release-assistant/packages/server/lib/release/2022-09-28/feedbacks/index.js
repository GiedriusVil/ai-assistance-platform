/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-09-31-feedbacks-index';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { retrieveManyByQuery } = require('./retrieve-many-by-query');
const { constructReplaceOneOperations } = require('./construct-replace-one-operations');
const { processOperations } = require('./process-operations');

const run = async (configuration) => {
  let feedbacks;
  console.log(MODULE_ID, { start: true });
  console.time('time');
  try {
    const ACA_MONGO_CLIENT = getAcaMongoClient(configuration.app.client);
    const DB = await ACA_MONGO_CLIENT.getDB();

    do {
      feedbacks = await retrieveManyByQuery(configuration, DB);
      if (
        !lodash.isEmpty(feedbacks)
      ) {
        console.log(`Selected ${feedbacks.length} feedbacks `);
        const OPERATIONS = await constructReplaceOneOperations(configuration, DB, feedbacks);
        console.log(`Processing ${OPERATIONS.length} operations...`);
        await processOperations(configuration, DB, OPERATIONS);
      }
    } while (!lodash.isEmpty(feedbacks));
    console.time('time');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(run.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  run,
}
