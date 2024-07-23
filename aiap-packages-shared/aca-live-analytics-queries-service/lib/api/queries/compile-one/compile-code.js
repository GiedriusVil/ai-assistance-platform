/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-queries-compile-one-compile-code';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { compileOne } = require('@ibm-aca/aca-live-analytics-queries-executor')

const compileCode = async (context, params) => {
  let response;
  try {
    response = await compileOne(params);
  } catch (error) {
    const ERROR = ramda.pathOr(error, ['body', 'errors'], error);
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, ERROR);
    appendDataToError(ACA_ERROR, { params });
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }

  if (lodash.isEmpty(response)) {
    const MESSAGE = 'No response was provided';
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, MESSAGE);
    appendDataToError(ACA_ERROR, { params });
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}
module.exports = {
  compileCode
}
