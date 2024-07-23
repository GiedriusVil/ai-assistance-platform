/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-filters-runtime-data-service-synchronize-with-database-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const {
  ACA_CODEC_ENCODE_TYPES,
  encode,
} = require('@ibm-aca/aca-utils-codec');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseLiveAnalyticsFiltersByTenant = async (context, params) => {
  let configLiveAnalyticsFiltersAbsolutePath;
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
    configLiveAnalyticsFiltersAbsolutePath = `${params?.configLiveAnalyticsAbsolutePath}/${params?.tenantId}/filters`;
    fsExtra.ensureDirSync(configLiveAnalyticsFiltersAbsolutePath);

    const FILTERS_FILES = fsExtra.readdirSync(configLiveAnalyticsFiltersAbsolutePath);

    const PROMISES = [];
    if (
      !lodash.isEmpty(FILTERS_FILES) &&
      lodash.isArray(FILTERS_FILES)
    ) {
      for (let filterFile of FILTERS_FILES) {
        if (
          !lodash.isEmpty(filterFile) &&
          lodash.isString(filterFile) &&
          filterFile.endsWith('.json')
        ) {
          let valueJsFile = filterFile.replace('.json', '.js');
          const FILTER = fsExtra.readJsonSync(`${configLiveAnalyticsFiltersAbsolutePath}/${filterFile}`)
          const FILTER_CODE_JS = fsExtra.readFileSync(`${configLiveAnalyticsFiltersAbsolutePath}/${valueJsFile}`).toString();

          FILTER.code = encode({
            input: FILTER_CODE_JS,
            type: ACA_CODEC_ENCODE_TYPES.STRING_2_BASE64,
          });
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.filters.saveOne(context, { value: FILTER })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseLiveAnalyticsFiltersByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseLiveAnalyticsFiltersByTenant,
}
