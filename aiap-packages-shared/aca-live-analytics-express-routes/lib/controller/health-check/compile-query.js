/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-express-routes-compile-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { compileOne } = require('@ibm-aca/aca-live-analytics-queries-executor')

/**
 * Function provides possibility to check if query, provided as Javascript snippet, compiles
 * @param {*} request 
 * @param {*} response 
 */
const compileQuery = async (request, response) => {
  let ERROR;
  try {
    const MODULE = request?.body;
    if (lodash.isEmpty(MODULE)) {
      const MESSAGE = 'Missing required request.body parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    await compileOne(MODULE);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERROR = ACA_ERROR;
  }

  if (lodash.isEmpty(ERROR)) {
    response.status(200).json(true);
  } else {
    logger.error('->', { ERROR });
    response.status(200).json(ERROR);
  }
};

module.exports = {
  compileQuery,
};
