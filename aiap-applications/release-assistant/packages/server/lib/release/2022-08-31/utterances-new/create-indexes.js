/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `release-assistant-2022-08-31-utterances-create-indexes`;

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const createIndexes = async (config, db) => {
  try {
    // await db.collection(config.app.collections.utterances).createIndex({ _processed_2022_08_31: 1 })
    console.log(createIndexes.name, { done: true });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(createIndexes.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  createIndexes,
}
