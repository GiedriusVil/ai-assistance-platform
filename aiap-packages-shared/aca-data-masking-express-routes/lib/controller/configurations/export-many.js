/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-data-masking-express-routes-controllers-configurations-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, formatIntoAcaError, throwAcaError } = require('@ibm-aca/aca-utils-errors');
const { currentDateAsString } = require('@ibm-aiap/aiap-utils-date');

const {
  constructActionContextFromRequest,
  constructDefaultFindManyQueryFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');

const { dataMaskingConfigurationsService } = require('@ibm-aca/aca-data-masking-service');

const _constructFileName = (context) => {
  try {
    const TENANT_ID = context?.user?.session?.tenant?.id;
    const RET_VAL = `[${TENANT_ID}]data-masking-configurations.${currentDateAsString()}.json`;
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
    const DATA = await dataMaskingConfigurationsService.exportMany(CONTEXT, PARAMS);
    if (
      lodash.isEmpty(DATA)
    ) {
      const MESSAGE = `Unable to find masking configurations!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
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
