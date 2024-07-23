/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-tiles-runtime-data-service-synchronize-with-database-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseLiveAnalyticsTilesByTenant = async (context, params) => {
  let configLiveAnalyticsTilesAbsolutePath;
  let retVal = [];
  try {
    if (
      lodash.isEmpty(params?.configLiveAnalyticsAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.configLiveAnalyticsAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(params?.tenantId)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.tenantId!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    configLiveAnalyticsTilesAbsolutePath = `${params?.configLiveAnalyticsAbsolutePath}/${params?.tenantId}/tiles`;
    fsExtra.ensureDirSync(configLiveAnalyticsTilesAbsolutePath);

    const TILES_FILES = fsExtra.readdirSync(configLiveAnalyticsTilesAbsolutePath);

    const PROMISES = [];
    if (
      !lodash.isEmpty(TILES_FILES) &&
      lodash.isArray(TILES_FILES)
    ) {
      for (let dtileFile of TILES_FILES) {
        if (
          !lodash.isEmpty(dtileFile) &&
          lodash.isString(dtileFile) &&
          dtileFile.endsWith('.json')
        ) {
          const TILE = fsExtra.readJsonSync(`${configLiveAnalyticsTilesAbsolutePath}/${dtileFile}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.tiles.saveOne(context, { value: TILE })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseLiveAnalyticsTilesByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseLiveAnalyticsTilesByTenant,
}
