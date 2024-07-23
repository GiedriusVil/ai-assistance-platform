/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-express-routes-controller-rules-messages-import-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { rulesMessagesImportService } = require('@ibm-aca/aca-rules-service');

const deleteManyByIds = async (request, response) => {
  const ERRORS = [];
  let result;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = request?.body;
    if (
      lodash.isEmpty(PARAMS)
    ) {
      const MESSAGE = `Missing required request.body parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    result = await rulesMessagesImportService.deleteManyByIds(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(`${deleteManyByIds.name}`, ERRORS);
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  deleteManyByIds,
};
