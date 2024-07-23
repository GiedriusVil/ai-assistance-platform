/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-runtime-data-service-synchronize-with-database-segments-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseSegmentsByTenant = async (context, params) => {
  let configTenantCustomizerSegmentsAbsolutePath;
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
    configTenantCustomizerSegmentsAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/classification-catalogs/segments`;
    fsExtra.ensureDirSync(configTenantCustomizerSegmentsAbsolutePath);
    const SEGMENTS_FILES = fsExtra.readdirSync(configTenantCustomizerSegmentsAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(SEGMENTS_FILES) &&
      lodash.isArray(SEGMENTS_FILES)
    ) {
      for (let segmentFile of SEGMENTS_FILES) {
        if (
          !lodash.isEmpty(segmentFile) &&
          lodash.isString(segmentFile) &&
          segmentFile.endsWith('.json')
        ) {
          const SEGMENT = fsExtra.readJsonSync(`${configTenantCustomizerSegmentsAbsolutePath}/${segmentFile}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.segments.saveOne(context, { segment: SEGMENT })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseSegmentsByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseSegmentsByTenant,
}
