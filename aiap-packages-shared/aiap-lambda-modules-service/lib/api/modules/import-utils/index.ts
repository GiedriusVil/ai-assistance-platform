/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-modules-import-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

import { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } from '@ibm-aca/aca-utils-errors';

const readJsonFromFile = async (
  file: { 
    mimetype: string, 
    path: string,
  }) => {
  try {
    let retVal;
    const FILE_MIME_TYPE = file?.mimetype;
    const MESSAGE_UNKNOWN_MIME_TYPE = `File mime type is not supported! [Actual: ${FILE_MIME_TYPE}]`;
    switch (FILE_MIME_TYPE) {
      case 'application/json':
        retVal = fsExtra.readJsonSync(file.path, 'utf8');
        break;
      default:
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE_UNKNOWN_MIME_TYPE);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(readJsonFromFile.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  readJsonFromFile,
};
