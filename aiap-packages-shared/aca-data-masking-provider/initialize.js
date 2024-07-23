/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-data-masking-provider-initialize';

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');
const { getAcaDataMaskingDatasourceByTenant } = require('@ibm-aca/aca-data-masking-datasource-provider');
const { addOneToRegistry } = require('./lib/data-masking-registry');
const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (provider) => {
  if (!ramda.isNil(provider)) {
    setConfigurationProvider(provider);
    await initialize();
  } else {
    const MESSAGE = 'Ensure that either configuration provider is passed!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
  }
}

//[ersidas.baniulis@ibm.com - 2022-07-04]: this initialization is not being exported in index.js because of circular import issues with logger
const initialize = async () => {
  const DATASOURCE = getDatasourceV1App();
  const QUERY = {
    sort: {
      field: 'id',
      direction: 'asc'
    }
  };
  const TENANTS = await DATASOURCE.tenants.findManyByQuery({}, QUERY);
  if (!lodash.isEmpty(TENANTS?.items)) {
    for (let tenant of TENANTS.items) {
      const TENANT_ID = ramda.path(['id'], tenant);
      const DATA_MASKING_DATASOURCE = await getAcaDataMaskingDatasourceByTenant(tenant);
      if (lodash.isEmpty(DATA_MASKING_DATASOURCE)) {
        logger.warn(`Tenant ${TENANT_ID} is missing data masking datasource!`);
        continue;
      }
      const DATA_MASKING_CONFIGURATIONS = await DATA_MASKING_DATASOURCE.dataMaskingConfigurations.findManyByQuery({}, QUERY);
      if (lodash.isEmpty(DATA_MASKING_CONFIGURATIONS?.items)) {
        logger.warn(`Tenant ${TENANT_ID} has no data masking configurations!`);
        continue;
      }
      for (let configuration of DATA_MASKING_CONFIGURATIONS.items) {
        addOneToRegistry(TENANT_ID, configuration);
      }
    }
  } else {
    logger.warn(`[${MODULE_ID}] Could not initialize - no tenants were found!`);
  }
}

module.exports = {
  initByConfigurationProvider,
}
