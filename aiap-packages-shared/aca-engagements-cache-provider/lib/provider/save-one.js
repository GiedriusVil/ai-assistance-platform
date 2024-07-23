/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-engagements-cache-provider-lib-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { getEngagementsDatasourceByTenant } = require('@ibm-aiap/aiap-engagements-datasource-provider');

const { getMemoryStore } = require('@ibm-aiap/aiap-memory-store-provider');

const saveOne = async (params) => {
  const ENGAGEMENT = ramda.path(['engagement'], params);
  const ENGAGEMENT_ID = ramda.path(['id'], ENGAGEMENT);
  const TENANT = ramda.path(['tenant'], params);
  const TENANT_HASH = ramda.path(['hash'], TENANT);
  try {
    if (
      lodash.isEmpty(ENGAGEMENT_ID)
    ) {
      const MESSAGE = 'Missing params.id required parameter!'
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { params });
    }
    if (
      lodash.isEmpty(TENANT)
    ) {
      const MESSAGE = 'Missing params.tenant required parameter!'
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { params });
    }
    const DATASOURCE = getEngagementsDatasourceByTenant(TENANT);
    const RET_VAL = await DATASOURCE.engagements.findOneById({}, ENGAGEMENT);
    const MEMORY_STORE = getMemoryStore();
    await MEMORY_STORE.set(`ENGAGEMENTS:${ENGAGEMENT_ID}:${TENANT_HASH}`, RET_VAL);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    const DATA = ramda.pathOr({}, ['data'], ACA_ERROR);
    DATA.engagementId = ENGAGEMENT_ID;
    DATA.tenantHash = TENANT_HASH;
    appendDataToError(ACA_ERROR, DATA);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
};
