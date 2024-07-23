/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-express-routes-utils-read-json'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { transformationService } = require('@ibm-aca/aca-etl-transformation-service');
const { readJsonFromXls } = require('./read-json-from-xls');

const readJsonFromFile = async (CONTEXT, file) => {
  let retVal;

  let FILE_MIME_TYPE = ramda.path(['mimetype'], file);

  if (
    ramda.isNil(FILE_MIME_TYPE)
  ) {
    FILE_MIME_TYPE = ramda.path(['type'], file);
  }

  let params;
  let rawImport;
  switch (FILE_MIME_TYPE) {
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      rawImport = await readJsonFromXls(file);
      params = {
        templateId: 'rules-xls-transformator',
        document: rawImport
      }

      retVal = await transformationService.transformOne(CONTEXT, params);
      break;
    case 'application/json':
      retVal = fsExtra.readJsonSync(file.path, 'utf8');
      break;
    default:
      throw new Error(`File mime type is not supported! ${FILE_MIME_TYPE}`);
  }
  logger.info('RETVAL -> ', retVal);
  return retVal;
}


module.exports = {
  readJsonFromFile,
};
