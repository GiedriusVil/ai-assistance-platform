/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-index';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { createIndexes } = require('./create-indexes');
const { retrieveTotals } = require('./retrieve-totals');

const { retrieveAiServices } = require('./retrieve-ai-services');
const { retrieveAiSkills } = require('./retrieve-ai-skills');

const { retrieveMany } = require('./retrieve-many');
const { constructReplaceOneOperations } = require('./construct-replace-one-operations');
const { processOperations } = require('./process-operations');

const run = async (config) => {
  let utterances;
  let aiServices;
  let aiSkills;
  try {
    const ACA_MONGO_CLIENT = getAcaMongoClient(config.app.client);
    const DB = await ACA_MONGO_CLIENT.getDB();

    aiServices = await retrieveAiServices(config, DB);
    aiSkills = await retrieveAiSkills(config, DB);

    await createIndexes(config, DB);
    do {
      let totals = await retrieveTotals(config, DB);
      console.timeLog('time passed');
      console.log('--> ', { totals });
      utterances = await retrieveMany(config, DB);
      if (
        !lodash.isEmpty(utterances)
      ) {
        console.log(`Selected ${utterances.length} utterances...`);
        const OPERATIONS = constructReplaceOneOperations({ utterances, aiServices, aiSkills });
        console.log(`Processing ${OPERATIONS.length} operations...`);
        await processOperations(config, OPERATIONS, DB);
        console.log(`Left ${Math.round(totals.TOTAL_UNPROCESSED_COUNT / totals.TOTAL * 100)}%`);
      }
    } while (!lodash.isEmpty(utterances));
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(run.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  run,
}
