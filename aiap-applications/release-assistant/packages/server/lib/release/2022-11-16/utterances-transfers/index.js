/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-index';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { retrieveTotals } = require('./retrieve-totals');

const { retrieveMany } = require('./retrieve-many');
const { constructReplaceOneOperationsUtterances } = require('./construct-replace-one-operations-utterances');
const { constructReplaceOneOperationsMessages } = require('./construct-replace-one-operations-messages');
const { processOperations } = require('./process-operations');

const run = async (config) => {
  let messagesWithUtterances;
  console.log(MODULE_ID, { start: true });
  console.time('time passed');

  try {
    const ACA_MONGO_CLIENT = getAcaMongoClient(config.app.client);
    const DB = await ACA_MONGO_CLIENT.getDB();

    do {
      let totals = await retrieveTotals(config, DB);
      console.timeLog('time passed');
      console.log('--> ', { totals });
      messagesWithUtterances = await retrieveMany(config, DB);
      if (
        !lodash.isEmpty(messagesWithUtterances)
      ) {
        console.log(`Selected ${messagesWithUtterances.length} messagesWithUtterances...`);
        const OPERATIONS_UTTERANCES = constructReplaceOneOperationsUtterances({ messagesWithUtterances });
        const OPERATIONS_MESSAGES = constructReplaceOneOperationsMessages({ messagesWithUtterances });
        console.log(`Processing ${OPERATIONS_MESSAGES.length} messages operations...`);
        console.log(`Processing ${OPERATIONS_UTTERANCES.length} utterances operations...`);
        await processOperations(config, OPERATIONS_UTTERANCES, OPERATIONS_MESSAGES, DB);
        console.log(`Left ${Math.round(totals.TOTAL_UNPROCESSED_COUNT / totals.TOTAL * 100)}%`);
      }
    } while (!lodash.isEmpty(messagesWithUtterances));
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(run.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  run,
}
