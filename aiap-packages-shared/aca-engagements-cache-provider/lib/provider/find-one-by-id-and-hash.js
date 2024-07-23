/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-tenants-store-engagements-find-one-by-id-and-hash';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getMemoryStore } = require('@ibm-aiap/aiap-memory-store-provider');
const { getEngagementsDatasourceByTenant } = require('@ibm-aiap/aiap-engagements-datasource-provider');

const { saveOne } = require('./save-one');

const _reloadOneIfExistsInDB = async (params) => {
  const TENANT = ramda.path(['tenant'], params);
  const ENGAGEMENTS_DATASOURCE = getEngagementsDatasourceByTenant(TENANT);
  const ENGAGEMENT = await ENGAGEMENTS_DATASOURCE.engagements.findOneById({}, params);
  const PARAMS = {
    engagement: params,
    tenant: TENANT
  }
  if (
    !lodash.isEmpty(ENGAGEMENT)
  ) {
    await saveOne(PARAMS);
  }
}

const findOneByIdAndHash = async (params) => {

  const ENGAGEMENT_ID = ramda.path(['id'], params);
  const TENANT = ramda.path(['tenant'], params);
  const TENANT_HASH = ramda.path(['hash'], TENANT);
  try {
    if (
      lodash.isEmpty(ENGAGEMENT_ID)
    ) {
      const MESSAGE = 'Missing params.id required parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { params })
    }
    if (
      lodash.isEmpty(TENANT_HASH)
    ) {
      const MESSAGE = 'Missing params.hash required parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { params })
    }
    const MEMORY_STORE = getMemoryStore();
    let retVal = await MEMORY_STORE.get(`ENGAGEMENTS:${ENGAGEMENT_ID}:${TENANT_HASH}`);
    if (
      lodash.isEmpty(retVal)
    ) {
      await _reloadOneIfExistsInDB(params);
    }
    retVal = await MEMORY_STORE.get(`ENGAGEMENTS:${ENGAGEMENT_ID}:${TENANT_HASH}`);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findOneByIdAndHash,
};
