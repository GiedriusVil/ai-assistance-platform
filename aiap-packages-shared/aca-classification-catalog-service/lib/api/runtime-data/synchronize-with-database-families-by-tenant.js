/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-runtime-data-service-synchronize-with-database-families-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseFamiliesByTenant = async (context, params) => {
  let configTenantCustomizerFamiliesAbsolutePath;
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
    configTenantCustomizerFamiliesAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/classification-catalogs/families`;
    fsExtra.ensureDirSync(configTenantCustomizerFamiliesAbsolutePath);
    const FAMILIES_FILES = fsExtra.readdirSync(configTenantCustomizerFamiliesAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(FAMILIES_FILES) &&
      lodash.isArray(FAMILIES_FILES)
    ) {
      for (let familyFile of FAMILIES_FILES) {
        if (
          !lodash.isEmpty(familyFile) &&
          lodash.isString(familyFile) &&
          familyFile.endsWith('.json')
        ) {
          const FAMILY = fsExtra.readJsonSync(`${configTenantCustomizerFamiliesAbsolutePath}/${familyFile}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.families.saveOne(context, { family: FAMILY })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseFamiliesByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseFamiliesByTenant,
}
