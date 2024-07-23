/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-retrieve-ai-skills';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const retrieveAiSkills = async (config, db) => {
  let retVal;
  try {
    const PIPELINE = [];

    retVal = await db.collection(config.app.collections.aiSkills).aggregate(PIPELINE).toArray();

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(retrieveAiSkills.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  retrieveAiSkills,
}
