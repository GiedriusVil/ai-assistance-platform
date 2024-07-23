/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-segments-read-json-from-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { readJsonFromFile: _readJsonFromFile } = require('@ibm-aiap/aiap-utils-file');
const { readJsonFromXls } = require('./read-json-from-xls');

const readJsonFromFile = async (file) => {
  try {
    let retVal;
    const FILE_MIME_TYPE = file?.mimetype;
    const MESSAGE_UNKNOWN_MIME_TYPE = `File mime type is not supported! [Actual: ${FILE_MIME_TYPE}]`;
    switch (FILE_MIME_TYPE) {
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        retVal = await readJsonFromXls(file);
        break;
      case 'application/json':
        retVal = _readJsonFromFile(file);
        break;
      default:
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE_UNKNOWN_MIME_TYPE);
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
