/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-queries-service-runtime-data-service-import-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const readJsonFromFile = async (file) => {
  try {
    let retVal;
    const FILE_MIME_TYPE = ramda.path(['mimetype'], file);
    const MESSAGE_UNKNOWN_MIME_TYPE = `File mime type is not supported! [Actual: ${FILE_MIME_TYPE}]`;
    switch (FILE_MIME_TYPE) {
      case 'application/json':
        retVal = fsExtra.readJsonSync(file.path, 'utf8');
        break;
      default:
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE_UNKNOWN_MIME_TYPE);
        break;
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  readJsonFromFile,
};
