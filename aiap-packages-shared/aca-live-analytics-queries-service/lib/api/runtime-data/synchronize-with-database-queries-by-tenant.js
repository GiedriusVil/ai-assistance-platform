/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-queries-service-runtime-data-service-synchronize-with-database-queries-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const {
  ACA_CODEC_ENCODE_TYPES,
  encode,
} = require('@ibm-aca/aca-utils-codec');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseQueriesByTenant = async (context, params) => {
  let configLiveAnalyticsQueriesAbsolutePath;
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
    configLiveAnalyticsQueriesAbsolutePath = `${params?.configLiveAnalyticsAbsolutePath}/${params?.tenantId}/queries`;
    fsExtra.ensureDirSync(configLiveAnalyticsQueriesAbsolutePath);

    const ENTITIES_FILES = fsExtra.readdirSync(configLiveAnalyticsQueriesAbsolutePath);

    const PROMISES = [];
    if (
      !lodash.isEmpty(ENTITIES_FILES) &&
      lodash.isArray(ENTITIES_FILES)
    ) {
      for (let valueJsonFile of ENTITIES_FILES) {
        if (
          !lodash.isEmpty(valueJsonFile) &&
          lodash.isString(valueJsonFile) &&
          valueJsonFile.endsWith('.json')
        ) {
          let valueJsFile = valueJsonFile.replace('.json', '.js');
          const VALUE = fsExtra.readJsonSync(`${configLiveAnalyticsQueriesAbsolutePath}/${valueJsonFile}`);
          const VALUE_CODE_JS = fsExtra.readFileSync(`${configLiveAnalyticsQueriesAbsolutePath}/${valueJsFile}`).toString();

          VALUE.code = encode({
            input: VALUE_CODE_JS,
            type: ACA_CODEC_ENCODE_TYPES.STRING_2_BASE64,
          });

          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.queries.saveOne(context, { value: VALUE })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseQueriesByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseQueriesByTenant,
}
