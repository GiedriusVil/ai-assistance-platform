/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-validation-engagements-service-validation-engagements-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');
const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const validationEngagementsChangesService = require('../validation-engagements-changes');

const runtimeDataService = require('../runtime-data');

const saveOne = async (context, params) => {
  let validationEngagement;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const VALIDATION_ENGAGEMENT_CLONE = lodash.cloneDeep(params?.validationEngagement);
    validationEngagement = params?.validationEngagement;
    appendAuditInfo(context, validationEngagement);
    const RET_VAL = await DATASOURCE.validationEngagements.saveOne(context, params);

    if (RET_VAL) {
      const AUDIT_RECORD = {
        action: 'SAVE',
        engagementKey: VALIDATION_ENGAGEMENT_CLONE?.key,
        docType: 'VALIDATION_ENGAGEMENT'
      }
      logger.info('saveOne audit', { AUDIT_RECORD });
      await validationEngagementsChangesService.saveOne(context, { record: AUDIT_RECORD });
    }

    await runtimeDataService.synchronizeWithConfigDirectory(context, { value: RET_VAL });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
}
