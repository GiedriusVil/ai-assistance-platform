/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-purchase-request-express-routes-controller-engine-reset-all';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const engineProvider = require('@ibm-aca/aca-rules-engine-provider');

const resetAllEngines = async (req, res) => {
  const ERRORS = [];
  let result;
  try {
    if (lodash.isEmpty(ERRORS)) {
      result = await engineProvider.resetAllEngines();
    }
  } catch (err) {
    ERRORS.push({
      error: err, 
      message: `Cought error while calling engineProvider: ${err}`
    });
  }

  if (lodash.isEmpty(ERRORS)) {
    logger.info(`Engine instances have been reset!`);
    res.status(200).json(result);
  } else {
    logger.error('ERROR', ERRORS);
    res.status(500).json({});
  }
};


module.exports = {
  resetAllEngines,
};
