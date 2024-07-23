/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-express-routes-controller-rules-audits-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const moment = require('moment');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { constructDefaultFindManyQueryFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { rulesAuditsService } = require('@ibm-aca/aca-buy-rules-service');

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
    result = await rulesAuditsService.exportMany(context, params);
    if (
      lodash.isEmpty(result)
    ) {
      const MESSAGE = `Unable to retrieve any data for export!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE)
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.setHeader('Content-disposition', 'attachment; filename=lambda_modules_audits_' + moment().format() + '.json');
    response.set('Content-Type', 'application/json');
    response.status(200).json(result);
  } else {
    logger.error(`${exportMany.name}`, { errors: ERRORS });
    response.status(400).json(ERRORS);
  }
};

module.exports = {
  exportMany,
};
