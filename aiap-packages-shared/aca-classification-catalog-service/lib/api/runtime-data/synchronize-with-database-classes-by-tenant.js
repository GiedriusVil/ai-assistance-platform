/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-runtime-data-service-synchronize-with-database-classes-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseClassesByTenant = async (context, params) => {
  let configTenantCustomizerClassesAbsolutePath;
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
    configTenantCustomizerClassesAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/classification-catalogs/classes`;
    fsExtra.ensureDirSync(configTenantCustomizerClassesAbsolutePath);
    const CLASSES_FILES = fsExtra.readdirSync(configTenantCustomizerClassesAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(CLASSES_FILES) &&
      lodash.isArray(CLASSES_FILES)
    ) {
      for (let classFile of CLASSES_FILES) {
        if (
          !lodash.isEmpty(classFile) &&
          lodash.isString(classFile) &&
          classFile.endsWith('.json')
        ) {
          const CLASS = fsExtra.readJsonSync(`${configTenantCustomizerClassesAbsolutePath}/${classFile}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.classes.saveOne(context, { class: CLASS })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseClassesByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseClassesByTenant,
}
