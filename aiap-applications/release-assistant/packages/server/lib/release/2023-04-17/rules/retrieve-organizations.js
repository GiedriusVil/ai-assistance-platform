/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2023-04-17-rules-retrieve-organizations';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const retrieveOrganizations = async (config, db) => {
  let retVal;
  try {
    const PIPELINE = [];

    retVal = await db
      .collection(config.app.collections.organizations)
      .aggregate(PIPELINE)
      .toArray();
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveOrganizations.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
    retrieveOrganizations,
};
