/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-express-routes-controller-modules-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, formatIntoAcaError, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  constructActionContextFromRequest,
  constructDefaultFindManyQueryFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');

const { lambdaModulesService } = require('@ibm-aiap/aiap-lambda-modules-service');
const { currentDateAsString } = require('@ibm-aiap/aiap-utils-date');

const _constructFileName = (context) => {
  try {
    const TENANT_ID = context?.user?.session?.tenant?.id;
    const RET_VAL = `[${TENANT_ID}]lambda_modules.${currentDateAsString()}.json`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_constructFileName', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const exportMany = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  let result;
  try {
    const PARAMS = constructDefaultFindManyQueryFromRequest(request);
    if (lodash.isArray(request?.query?.ids)) {
      PARAMS.ids = request?.query?.ids;
    } else if (lodash.isString(request?.query?.ids)) {
      PARAMS.ids = [request?.query?.ids];
    }
    const DATA = await lambdaModulesService.exportMany(CONTEXT, PARAMS);
    if (
      lodash.isEmpty(DATA)
    ) {
      const MESSAGE = `Unable to find lambda modules!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE, MESSAGE);
    }
    result = DATA;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push({ ACA_ERROR });
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    const FILE_NAME = _constructFileName(CONTEXT);
    response.setHeader('Content-disposition', `attachment; filename=${FILE_NAME}`);
    response.set('Content-Type', 'application/json');
    response.status(200).json(result);
  } else {
    logger.error('->', { ERRORS });
    response.status(400).json(ERRORS);
  }
};

module.exports = {
  exportMany,
};
