/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-validation-engagements-service-validation-engagements-delete-many-by-keys';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const validationEngagementsChangesService = require('../validation-engagements-changes')

const runtimeDataService = require('../runtime-data');

const saveAuditRecord = async (context, params) => {
  const KEYS = params?.keys;
  if (
    !lodash.isEmpty(KEYS) &&
    lodash.isArray(KEYS)
  ) {
    const PROMISES = [];
    KEYS?.forEach(key => {
      const AUDIT_RECORD = {
        action: 'DELETE',
        engagementKey: key,
        docType: 'VALIDATION_ENGAGEMENT'
      }
      logger.info('deleteManyByKeys audit', { AUDIT_RECORD });
      PROMISES.push(validationEngagementsChangesService.saveOne(context, { record: AUDIT_RECORD }));
    });
    await Promise.all(PROMISES);
  }
}

const deleteManyByKeys = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.validationEngagements.deleteManyByKeys(context, params);
    if (!lodash.isEmpty(RET_VAL)) {
      saveAuditRecord(context, params);
    }

    await runtimeDataService.deleteManyByKeysFromConfigDirectory(context, params);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByKeys.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByKeys,
}
