/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-policy-engine-api-doc-validation-v1-validate-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { execHttpPostRequest } = require('@ibm-aca/aca-wrapper-http');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getLibConfiguration } = require('../../configuration');

const validateOne = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let libConfiguration;

  let tenant;
  let document;
  let options;
  let requestPath = `/api/v1/doc-validation/validate-one`;
  let requestHostname;
  let requestUrl;
  let requestBody;
  try {
    libConfiguration = getLibConfiguration();
    requestHostname = libConfiguration?.client?.hostname;
    document = params?.document;
    tenant = params?.tenant;
    options = params?.options;
    if (
      lodash.isEmpty(requestHostname)
    ) {
      const MESSAGE = `Missing required libConfiguration.client.hostname parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(tenant)
    ) {
      const MESSAGE = `Missing required params.tenant parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(document)
    ) {
      const MESSAGE = `Missing required params.document parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    requestUrl = `${requestHostname}${requestPath}`;
    requestBody = { context, params };

    const RESPONSE = await execHttpPostRequest(context, {
      url: requestUrl,
      body: requestBody,
    });
    const RET_VAL = RESPONSE?.body;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    const ERRORS = error?.body?.errors;
    if (
      !lodash.isEmpty(ERRORS) &&
      lodash.isArray(ERRORS)
    ) {
      ERRORS.forEach(error => { delete error.context });
    }
    logger.error(validateOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  validateOne,
};
