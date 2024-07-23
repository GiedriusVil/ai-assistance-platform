/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-rules-engine-provider-v2-utils`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const constructEngineIdByContext = (context) => {
  let tenantId;
  let tenantHash;
  let engagementKey;
  let retVal;
  try {
    tenantId = context?.user?.session?.tenant?.id;
    tenantHash = context?.user?.session?.tenant?.hash;
    engagementKey = context?.user?.session?.engagement?.key;
    if (
      lodash.isEmpty(tenantId)
    ) {
      const ERROR_MESSAGE = `Missing required context?.user?.session?.tenant?.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(tenantHash)
    ) {
      const ERROR_MESSAGE = `Missing required context?.user?.session?.tenant?.hash attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(engagementKey)
    ) {
      const ERROR_MESSAGE = `Missing required context?.user?.session?.engagement?.key attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    retVal = `${tenantId}:${tenantHash}:${engagementKey}`;
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructEngineIdByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  constructEngineIdByContext,
}
