/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2023-03-30-doc-validations-retrieve-audits';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const retrieveAudits = async (config, db) => {
  let retVal;
  try {
    const MATCHER = {
      $match: {
        actionId: null,
      },
    };
    const SORT = {
      $sort: {
        'created.date': 1,
      },
    };

    const PIPELINE = [MATCHER, SORT];
    retVal = await db
      .collection(config.app.collections.docValidationAudits)
      .aggregate(PIPELINE)
      .toArray();
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveAudits.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  retrieveAudits,
};
