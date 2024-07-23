/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-queries-executor-utils-construct-query-runtime-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const constructQueryRuntimeIdByRefAndTenant = (params) => {
  try {
    const TENANT_ID = params?.tenant?.id;
    const QUERY_REF = params?.ref;
    if (
      lodash.isEmpty(QUERY_REF)
    ) {
      const MESSAGE = 'Missing required params.ref parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = 'Missing required params.tenant.id parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = `${TENANT_ID}:${QUERY_REF}`
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructQueryRuntimeIdByRefAndTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  constructQueryRuntimeIdByRefAndTenant,
}
