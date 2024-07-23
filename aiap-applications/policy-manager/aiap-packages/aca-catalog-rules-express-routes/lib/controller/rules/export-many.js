/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-catalog-rules-express-routes-controllers-rules-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, formatIntoAcaError, throwAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { currentDateAsString } = require('@ibm-aiap/aiap-utils-date');
const { constructDefaultFindManyQueryFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { rulesService } = require('@ibm-aca/aca-catalog-rules-service');

const _constructFileName = (context) => {
  try {
    const RET_VAL = `catalog.rules.${currentDateAsString()}.json`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_constructFileName', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const exportMany = async (request, response) => {
  const ERRORS = [];
  let context;
  let contextUserId;
  let params;
  let result;
  try {
    context = request?.acaContext;
    contextUserId = context?.user?.id;
    if (
      lodash.isEmpty(context)
    ) {
      const MESSAGE = `Missing required request.acaContext parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    params = constructDefaultFindManyQueryFromRequest(request);
    result = await rulesService.exportMany(context, params);
    if (
      lodash.isEmpty(result)
    ) {
      const MESSAGE = `Unable to find catalog rules!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE, MESSAGE);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { contextUserId });
    ERRORS.push({ ACA_ERROR });
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    const FILE_NAME = _constructFileName(context);
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
