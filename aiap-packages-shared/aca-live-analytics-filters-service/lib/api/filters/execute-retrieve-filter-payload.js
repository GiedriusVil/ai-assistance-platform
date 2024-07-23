/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-queries-execute-retrieve-filter-payload';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { executeRetrieveFilterPayloadEnriched } = require('@ibm-aca/aca-live-analytics-filters-executor');
const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const _retrieveFilterPayload = async (context, params) => {
  throwAcaError(
    MODULE_ID,
    ACA_ERROR_TYPE.SYSTEM_ERROR,
    'retrieveFilterPayload() function is not implemented. Please implement it using Filter configurator.',
    { params }
  );
}

const executeRetrieveFilterPayload = async (context, params) => {
  try {
    const FILTER_REF = params?.ref;
    if (lodash.isEmpty(FILTER_REF)) {
      const ERROR_MESSAGE = `Missing required value params.ref`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { params });
    }
    const RET_VAL = await executeRetrieveFilterPayloadEnriched(FILTER_REF, _retrieveFilterPayload, context, params);
    return RET_VAL;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(executeRetrieveFilterPayload.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

module.exports = {
  executeRetrieveFilterPayload,
}
