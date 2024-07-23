/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-cache-provider-find-one-by-external-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getMemoryStore } = require('@ibm-aiap/aiap-memory-store-provider');

const { reloadOneByExternalId } = require('./reload-one-by-external-id');

const _retrieveOrganization = async (externalId) => {
  const MEMORY_STORE = getMemoryStore();
  const RET_VAL = await MEMORY_STORE.get(`ORGANIZATIONS_BY_EXTERNAL_ID:${externalId}`);
  return RET_VAL;
}

const findOneByExternalId = async (context, params) => {
  try {
    const EXTERNAL_ID = ramda.path(['externalId'], params);
    if (
      lodash.isEmpty(EXTERNAL_ID)
    ) {
      const MESSAGE = 'Missing required params.externalId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    let RET_VAL = await _retrieveOrganization(EXTERNAL_ID);
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      await reloadOneByExternalId(context, params);
      RET_VAL = await _retrieveOrganization(EXTERNAL_ID);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findOneByExternalId
}
