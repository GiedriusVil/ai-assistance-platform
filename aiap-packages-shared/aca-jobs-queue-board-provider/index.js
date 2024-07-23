/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `${require('./package.json').name}-index`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('lodash');
const ramda = require('ramda');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');

const { setConfigurationProvider } = require('./lib/configuration');
const { setApp, addRouter } = require('./lib/express-app');
const { addOneByTenantId, getOneByTenantId, getRegistry } = require('./lib/board-registry');

const { AcaJobsQueueBoardBull } = require('./lib/board-bull');

const initOneByTenant = async (params) => {
  const TENANT = ramda.path(['tenant'], params);
  const TENANT_ID = ramda.path(['id'], TENANT);
  const TENANT_HASH = ramda.path(['hash'], TENANT);
  const CONFIG = {
    basePath: '/bull-board',
    tenantId: TENANT_ID,
  };
  const SILENT = ramda.pathOr(false, ['options', 'silent'], params);
  try {
    const RET_VAL = new AcaJobsQueueBoardBull(CONFIG);
    addOneByTenantId({
      tenantId: TENANT_ID,
      board: RET_VAL,
    });
    addRouter(RET_VAL.getPath(), RET_VAL.getRouter());
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ACA_ERROR.tenant = {
      id: TENANT_ID,
      hash: TENANT_HASH,
    }
    logger.error('->', { ACA_ERROR });
    if (
      !SILENT
    ) {
      throw ACA_ERROR;
    }
  }
}

const initMany = async () => {
  try {
    const QUERY = {
      sort: {
        field: 'id',
        direction: 'asc'
      }
    };
    const DATASOURCE = getDatasourceV1App();
    const RESULT = await DATASOURCE.tenants.findManyByQuery({}, QUERY);
    const TENANTS = ramda.path(['items'], RESULT);
    let retVal;
    if (
      lodash.isArray(TENANTS) &&
      !lodash.isEmpty(TENANTS)
    ) {
      const PROMISES = [];
      for (let tenant of TENANTS) {
        if (
          !lodash.isEmpty(tenant)
        ) {
          PROMISES.push(initOneByTenant({ tenant }))
        }
      }
      retVal = await Promise.all(PROMISES);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = `Missing required configuration provider! [aca-common-config || aca-lite-config]!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = `Missing required app parameter! [aca-common-config || aca-lite-config]!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);
    setApp(app);
    logger.info('INITIALIZED');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('initByConfigurationProvider', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  initMany,
  initOneByTenant,
  initByConfigurationProvider,
  getOneByTenantId,
  getRegistry,
}
