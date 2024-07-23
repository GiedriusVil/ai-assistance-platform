/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-express-routes-controller-modules-export-to-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { constructActionContextFromRequest, } = require('@ibm-aiap/aiap-utils-express-routes');
const { lambdaModulesService } = require('@ibm-aiap/aiap-lambda-modules-service');
const { currentDateAsString } = require('@ibm-aiap/aiap-utils-date');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const _constructFileName = (context, moduleId) => {
  try {
    const TENANT_ID = context?.user?.session?.tenant?.id;
    const RET_VAL = `[${TENANT_ID}]lambda_module[${moduleId}].${currentDateAsString()}.json`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_constructFileName', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const exportOne = async (request, response) => {

  let result;
  const ERRORS = [];

  const CONTEXT = constructActionContextFromRequest(request);
  const MODULE_ID = request?.params?.moduleId;
  try {

    if (lodash.isEmpty(MODULE_ID)) {
      ERRORS.push({
        error: 'MODULE_ID',
        message: 'Missing module ID'
      });
      logger.error('ERROR: Missing module ID');
    }

    logger.info('Exporting lambda module');

    if (lodash.isEmpty(ERRORS)) {
      const PARAMS = {
        id: MODULE_ID,
      };
      const DATA = await lambdaModulesService.exportOne(CONTEXT, PARAMS);

      if (lodash.isEmpty(DATA)) {
        ERRORS.push({
          error: 'LAMBDA_MODULE_EXPORT',
          message: 'Lambda module not found in DB'
        });
        logger.error('ERROR: Lambda module not found in DB');
      }
      if (lodash.isEmpty(ERRORS)) {
        result = DATA;
      }
    }
  } catch (err) {
    ERRORS.push({
      error: `${err}`,
      message: 'Caught error while exporting lambda module!'
    });
  }

  if (lodash.isEmpty(ERRORS)) {
    const FILENAME = _constructFileName(CONTEXT, MODULE_ID);
    response.setHeader('Content-disposition', `attachment; filename=${FILENAME}`);
    response.set('Content-Type', 'application/json');
    response.status(200).json(result);
  } else {
    response.status(400).json(ERRORS);
  }

};

module.exports = {
  exportOne,
};
