/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-express-routes-controller-organizations-import-clear-import';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  transformToAcaErrorFormat,
  transformContextForLogger,
} = require('@ibm-aca/aca-data-transformer');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { organizationsImportService } = require('@ibm-aca/aca-organizations-service');

const clearImport = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const PARAMS = request?.body;
  let result;
  try {
    if (lodash.isEmpty(ERRORS)) {
      logger.info('->', {
        context: transformContextForLogger(CONTEXT),
        params: PARAMS,
      });
      result = await organizationsImportService.clearImport(CONTEXT, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('->', { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  clearImport,
};
