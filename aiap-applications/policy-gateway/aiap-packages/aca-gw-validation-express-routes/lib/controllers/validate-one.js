/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-gw-validation-express-routes-validate-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const {
  validationServiceV1,
  validationServiceV2,
} = require('@ibm-aca/aca-gw-validation-service');


const validateOne = async (request, response) => {
  const ERRORS = [];

  let headerServiceVersion;

  let context;
  let contextUserId;
  let params;

  let document;
  let options;

  let result;
  try {
    headerServiceVersion = request?.headers['x-aiap-service-version'];

    context = request?.context;
    document = request?.body?.document;
    options = request?.body?.options;
    if (
      lodash.isEmpty(context?.user?.session?.tenant)
    ) {
      const MESSAGE = `Missing required context?.user?.session?.tenant parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(document)
    ) {
      const MESSAGE = `Missing required request.body.document parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isObject(options) &&
      lodash.isEmpty(options)
    ) {
      const MESSAGE = `Empty request.body.options parameter! Can not be empty!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    params = { document, options };

    if (
      headerServiceVersion === 'v2'
    ) {
      result = await validationServiceV2.validateOne(context, params);
    } else {
      result = await validationServiceV1.validateOne(context, params);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { contextUserId, params });
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(validateOne.name, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};


module.exports = {
  validateOne
};
