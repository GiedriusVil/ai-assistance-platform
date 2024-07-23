/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-queries-compile-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const jshint = require('jshint');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { compileCode } = require('./compile-code');

const compileOne = async (context, params) => {
  try {
    const CODE = params?.code;
    const DECODED_CODE = Buffer.from(CODE, 'base64').toString('utf-8');
    jshint.JSHINT(DECODED_CODE, {
      esversion: 6
    });
    const LINT_ERRORS = jshint.JSHINT.data().errors.map(e => {
      return {
        line: e.line,
        character: e.character,
        message: e.raw,
        severity: e.code
      }
    });
    if (!lodash.isEmpty(LINT_ERRORS)) {
      for (let index = 0; index < LINT_ERRORS.length; index++) {
        let error = LINT_ERRORS[index];
        if (!lodash.isEmpty(error) &&
          !lodash.isEmpty(error.severity) &&
          error.severity.startsWith('E')) {
          const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
          logger.error('->', { ACA_ERROR });
          throw ACA_ERROR;
        }
      }
      logger.warn('->', { LINT_ERRORS });
    }
    await compileCode(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  compileOne,
}
