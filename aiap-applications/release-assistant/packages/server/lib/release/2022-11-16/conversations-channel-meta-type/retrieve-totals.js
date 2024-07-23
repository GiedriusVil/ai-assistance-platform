/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-retrieve-totals';

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const retrieveTotals = async (config, db) => {
  try {
    const [
      TOTAL,
      TOTAL_PROCESSED_COUNT,
      TOTAL_UNPROCESSED_COUNT,
    ] = await Promise.all([
      db.collection(config.app.collections.conversations).count(),
      db.collection(config.app.collections.conversations).count({
        _processed_2022_11_16: true
      }),
      db.collection(config.app.collections.conversations).count({
        _processed_2022_11_16: {
          $ne: true
        }
      })
    ]);
    const RET_VAL = { TOTAL, TOTAL_PROCESSED_COUNT, TOTAL_UNPROCESSED_COUNT };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(retrieveTotals.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  retrieveTotals,
}
