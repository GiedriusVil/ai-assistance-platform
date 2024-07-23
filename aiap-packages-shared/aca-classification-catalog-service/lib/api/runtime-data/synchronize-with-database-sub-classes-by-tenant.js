/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-runtime-data-service-synchronize-with-database-sub-classes-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseSubClassesByTenant = async (context, params) => {
  let configTenantCustomizerSubClassesAbsolutePath;
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
    configTenantCustomizerSubClassesAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/classification-catalogs/sub-classes`;
    fsExtra.ensureDirSync(configTenantCustomizerSubClassesAbsolutePath);
    const SUB_CLASSES_FILES = fsExtra.readdirSync(configTenantCustomizerSubClassesAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(SUB_CLASSES_FILES) &&
      lodash.isArray(SUB_CLASSES_FILES)
    ) {
      for (let subClassFile of SUB_CLASSES_FILES) {
        if (
          !lodash.isEmpty(subClassFile) &&
          lodash.isString(subClassFile) &&
          subClassFile.endsWith('.json')
        ) {
          const SUB_CLASS = fsExtra.readJsonSync(`${configTenantCustomizerSubClassesAbsolutePath}/${subClassFile}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.subClasses.saveOne(context, { subClass: SUB_CLASS })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseSubClassesByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseSubClassesByTenant,
}
