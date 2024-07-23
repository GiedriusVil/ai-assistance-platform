/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/* eslint-disable no-case-declarations */
const MODULE_ID = `aca-lambda-modules-executor-runtime-storage-load-one-by-id-and-tenant`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getLibConfiguration } = require('../configuration');

const {
  constructModuleRuntimeIdByIdAndTenant,
  getLambdaModulesDatasourceByTenant,
} = require('../utils');

const { compileOne } = require('../compilator');
const { getStorage } = require('./get-storage');

const { LAMBDA_MODULE_TYPES } = require('../lambda-module-types');

const loadOneByIdAndTenant = async (params) => {
  const SILENT = ramda.pathOr(false, ['options', 'silent'], params);
  const TENANT = ramda.path(['tenant'], params);
  const ENABLED_LAMBDA_MODULE_TYPES = ramda.pathOr([], ['types'], getLibConfiguration());
  try {
    const STORAGE = getStorage();

    const LAMBDA_MODULE_ID = ramda.path(['id'], params);
    const LAMBDA_MODULE_RUNTIME_ID = constructModuleRuntimeIdByIdAndTenant(params);
    const DATASOURCE = getLambdaModulesDatasourceByTenant(TENANT);
    const LAMBDA_MODULE_DEF = await DATASOURCE.modules.findOneById({}, { id: LAMBDA_MODULE_ID });
    const LAMBDA_MODULE_CONFIG_KEY = ramda.path(['configurationId'], LAMBDA_MODULE_DEF);
    const LAMBDA_MODULE_TYPE = ramda.path(['type'], LAMBDA_MODULE_DEF);
    if (
      lodash.isEmpty(LAMBDA_MODULE_TYPE)
    ) {
      return;
    }
    if (
      !ENABLED_LAMBDA_MODULE_TYPES.includes(LAMBDA_MODULE_TYPE)
    ) {
      return;
    }
    const LAMBDA_MODULE_COMPILED = await compileOne(LAMBDA_MODULE_DEF);
    if (
      !lodash.isEmpty(LAMBDA_MODULE_CONFIG_KEY)
    ) {
      const LAMBDA_MODULE_CONFIGURATION = await DATASOURCE.modulesConfigurations.findOneByKey({}, { key: LAMBDA_MODULE_CONFIG_KEY });
      const CONFIG_VALUE = ramda.path(['value'], LAMBDA_MODULE_CONFIGURATION);
      LAMBDA_MODULE_COMPILED.configuration = CONFIG_VALUE;
    }
    STORAGE[LAMBDA_MODULE_RUNTIME_ID] = LAMBDA_MODULE_COMPILED;
    switch (LAMBDA_MODULE_TYPE) {
      case LAMBDA_MODULE_TYPES.ACTION_TAG:
        const { actionsTenantRegistry } = require('@ibm-aca/aca-middleware-fulfill');
        let params = {
          module: LAMBDA_MODULE_DEF,
          moduleCompiled: LAMBDA_MODULE_COMPILED
        };
        let context = { tenant: TENANT };
        await actionsTenantRegistry.loadOneByLambdaModule(context, params);
        break
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('loadOneByIdAndTenant', { ACA_ERROR, params });
    if (!SILENT) {
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  loadOneByIdAndTenant,
}
