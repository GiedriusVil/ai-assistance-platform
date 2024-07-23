/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-express-routes-controllers-classification-rules-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, formatIntoAcaError, throwAcaError } = require('@ibm-aca/aca-utils-errors');
const { currentDateAsString } = require('@ibm-aiap/aiap-utils-date');

const {
  constructDefaultFindManyQueryFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');

const { rulesService } = require('@ibm-aca/aca-classification-rules-service');

const _constructFileName = (context) => {
  try {
    const RET_VAL = `classification.rules.${currentDateAsString()}.json`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_constructFileName', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const exportMany = async (request, response) => {
  const ERRORS = [];

  let params
  let context;
  let result;
  try {
    context = request?.acaContext;
    params = constructDefaultFindManyQueryFromRequest(request);

    if (lodash.isEmpty(context)) {
      const MESSAGE = `Missing required request.acaContext parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, MESSAGE);
    }

    const DATA = await rulesService.exportMany(context, params);
    if (lodash.isEmpty(DATA)) {
      const MESSAGE = `Unable to find classification rules!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE, MESSAGE);
    }
    result = DATA;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    const FILE_NAME = _constructFileName(context);
    response.setHeader('Content-disposition', `attachment; filename=${FILE_NAME}`);
    response.set('Content-Type', 'application/json');
    response.status(200).json(result);
  } else {
    logger.error(`${exportMany.name}`, { errors: ERRORS });
    response.status(400).json({ errors: ERRORS });
  }
};

module.exports = {
  exportMany,
};
