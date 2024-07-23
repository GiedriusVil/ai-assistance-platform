/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-express-routes-controller-classification-rules-classifications-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { rulesClassificationsService } = require('@ibm-aca/aca-classification-rules-service');
const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');


const deleteManyByIds = async (request, response) => {
    const ERRORS = [];
    let context;
    let params;
    let result;
    try {
      context = request?.acaContext;
      params = request?.body;

      if (lodash.isEmpty(context)) {
        const MESSAGE = `Missing required request.acaContext parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, MESSAGE);
      }

      if (lodash.isEmpty(params)) {
        const MESSAGE = `Missing required request.body paramter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHENTICATION_ERROR, MESSAGE);
      }

      result = await rulesClassificationsService.deleteManyByIds(context, params);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ERRORS.push(ACA_ERROR);
    }
    if (lodash.isEmpty(ERRORS)) {
      response.status(200).json(result);
    }else {
      logger.error(`${deleteManyByIds.name}`, { errors: ERRORS });
      response.status(500).json({ errors: ERRORS });
    }
};

module.exports = {
    deleteManyByIds,
}
