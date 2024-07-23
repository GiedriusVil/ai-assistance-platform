/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-service-runtime-data-service-synchronize-with-database-answers-stores-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseAnswersStoresByTenant = async (context, params) => {
  let configTenantCustomizerAnswersStoresAbsolutePath;
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
    configTenantCustomizerAnswersStoresAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/answers-stores`;
    fsExtra.ensureDirSync(configTenantCustomizerAnswersStoresAbsolutePath);
    const ANSWERS_STORES_FILES = fsExtra.readdirSync(configTenantCustomizerAnswersStoresAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(ANSWERS_STORES_FILES) &&
      lodash.isArray(ANSWERS_STORES_FILES)
    ) {
      for (let answersStoreFile of ANSWERS_STORES_FILES) {
        if (
          !lodash.isEmpty(answersStoreFile) &&
          lodash.isString(answersStoreFile) &&
          answersStoreFile.endsWith('.json')
        ) {
          const ANSWERS_STORE = fsExtra.readJsonSync(`${configTenantCustomizerAnswersStoresAbsolutePath}/${answersStoreFile}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.answerStores.saveOne(context, { answerStore: ANSWERS_STORE })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseAnswersStoresByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseAnswersStoresByTenant,
}
