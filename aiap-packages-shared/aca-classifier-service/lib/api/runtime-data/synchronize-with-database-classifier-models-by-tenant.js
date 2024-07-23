/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-service-runtime-data-service-synchronize-with-database-classifier-models-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseClassifierModelsByTenant = async (context, params) => {
  let configTenantCustomizerClassifierModelsAbsolutePath;
  let retVal = [];
  try {
    if (
      lodash.isEmpty(params?.configTenantCustomizerAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.configTenantCustomizerAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(params?.tenantId)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.tenantId!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    configTenantCustomizerClassifierModelsAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/classifier-models`;
    fsExtra.ensureDirSync(configTenantCustomizerClassifierModelsAbsolutePath);
    const CLASSIFIER_MODELS_FILES = fsExtra.readdirSync(configTenantCustomizerClassifierModelsAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(CLASSIFIER_MODELS_FILES) &&
      lodash.isArray(CLASSIFIER_MODELS_FILES)
    ) {
      for (let classifierModelFile of CLASSIFIER_MODELS_FILES) {
        if (
          !lodash.isEmpty(classifierModelFile) &&
          lodash.isString(classifierModelFile) &&
          classifierModelFile.endsWith('.json')
        ) {
          const VALUE = fsExtra.readJsonSync(`${configTenantCustomizerClassifierModelsAbsolutePath}/${classifierModelFile}`)

          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.classifier.saveOne(context, { value: VALUE })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseClassifierModelsByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseClassifierModelsByTenant,
}
