/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2023-03-30-doc-validations-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { retrieveAudits } = require('./retrieve-audits');
const { processOperations } = require('./process-operations');
const { addActionId } = require('./add-action-id');
const { constructReplaceOneOperations } = require('./construct-replace-one-operations');
const { groupAudits } = require('./group-audits');

const run = async (config) => {
  logger.info(MODULE_ID, { start: true });

  try {
    const ACA_MONGO_CLIENT = getAcaMongoClient(config.app.client);
    const DB = await ACA_MONGO_CLIENT.getDB();

    const AUDITS = await retrieveAudits(config, DB);

    if (lodash.isEmpty(AUDITS)) {
      logger.info('Nothing to migrate');
      return;
    }

    logger.info(`Found ${AUDITS.length} audits with no actionId`);

    const GROUPED = groupAudits(AUDITS);

    for (const [KEY, GROUP_AUDITS] of Object.entries(GROUPED)) {
      await _doMigration(config, GROUP_AUDITS, DB, KEY);
    }

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(run.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _doMigration = async (config, groupedAudits, db, key) => {
  try {
    const UPDATED_AUDITS = addActionId(groupedAudits);
    const OPERATIONS = constructReplaceOneOperations(UPDATED_AUDITS);
    await processOperations(config, OPERATIONS, db);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { key });
    logger.error(_doMigration.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  run,
}
