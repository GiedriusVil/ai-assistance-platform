/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-runtime-data-service-synchronize-with-database-catalogs-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseCatalogsByTenant = async (context, params) => {
  let configTenantCustomizerCatalogsAbsolutePath;
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
    configTenantCustomizerCatalogsAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/classification-catalogs/catalogs`;
    fsExtra.ensureDirSync(configTenantCustomizerCatalogsAbsolutePath);
    const CATALOGS_FILES = fsExtra.readdirSync(configTenantCustomizerCatalogsAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(CATALOGS_FILES) &&
      lodash.isArray(CATALOGS_FILES)
    ) {
      for (let cataloglFile of CATALOGS_FILES) {
        if (
          !lodash.isEmpty(cataloglFile) &&
          lodash.isString(cataloglFile) &&
          cataloglFile.endsWith('.json')
        ) {
          const CATALOG = fsExtra.readJsonSync(`${configTenantCustomizerCatalogsAbsolutePath}/${cataloglFile}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.catalogs.saveOne(context, { catalog: CATALOG })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseCatalogsByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseCatalogsByTenant,
}
