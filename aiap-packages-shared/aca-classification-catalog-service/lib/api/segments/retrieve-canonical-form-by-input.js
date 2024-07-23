/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-retrieve-canonical-form-by-input';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const _classificationCatalogUtils = require('../../utils/classification-catalog-utils');

const retrieveCanonicalFormByInput = async (context, params) => {

  const PARAMS_INPUT = params?.input;
  const PARAMS_SOURCE = params?.source;

  try {
    const PARAMS = {
      input: PARAMS_INPUT,
      source: PARAMS_SOURCE
    };

    const RET_VAL = _classificationCatalogUtils.retrieveCanonicalFormByInput(PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${retrieveCanonicalFormByInput.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  retrieveCanonicalFormByInput,
}
