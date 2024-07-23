/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-validation-engagements-service-validation-engagements-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const validationEngagementsChangesService = require('../validation-engagements-changes')

const runtimeDataService = require('../runtime-data');

const saveAuditRecord = async (context, params) => {
  const IDS = params?.ids;
  if (
    !lodash.isEmpty(IDS) &&
    lodash.isArray(IDS)
  ) {
    const PROMISES = [];
    IDS?.forEach(id => {
      const AUDIT_RECORD = {
        action: 'DELETE',
        engagementId: id,
        docType: 'VALIDATION_ENGAGEMENT'
      }
      logger.info('deleteManyByIds audit', { AUDIT_RECORD });
      PROMISES.push(validationEngagementsChangesService.saveOne(context, { record: AUDIT_RECORD }));
    });
    await Promise.all(PROMISES);
  }
}

const deleteManyByIds = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.validationEngagements.deleteManyByIds(context, params);
    if (!lodash.isEmpty(RET_VAL)) {
      saveAuditRecord(context, params);
    }

    await runtimeDataService.deleteManyByIdsFromConfigDirectory(context, {ids: params});

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByIds,
}
