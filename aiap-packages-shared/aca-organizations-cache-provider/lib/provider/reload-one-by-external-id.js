/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-cache-provider-reload-one-by-external-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaOrganizationsDatasourceByContext } = require('@ibm-aca/aca-organizations-datasource-provider');
const { getMemoryStore } = require('@ibm-aiap/aiap-memory-store-provider');

const reloadOneByExternalId = async (context, params) => {
  try {
    const EXTERNAL_ID = params?.externalId;
    if (
      lodash.isEmpty(EXTERNAL_ID)
    ) {
      const MESSAGE = 'Missing params.externalId required parameter!'
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { params });
    }
    const MEMORY_STORE = getMemoryStore();
    const DATASOURCE = getAcaOrganizationsDatasourceByContext(context);
    const ORGANIZATION_PARAMS = {
      externalId: EXTERNAL_ID,
    };
    const ORGANIZATION = await DATASOURCE.organizations.findOneByExternalId(context, ORGANIZATION_PARAMS);

    if (!lodash.isEmpty(ORGANIZATION)) {
      MEMORY_STORE.set(`ORGANIZATIONS_BY_EXTERNAL_ID:${EXTERNAL_ID}`, ORGANIZATION);
    }

    return ORGANIZATION;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(reloadOneByExternalId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  reloadOneByExternalId,
};
