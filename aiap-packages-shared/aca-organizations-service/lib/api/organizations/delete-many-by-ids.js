/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-service-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getAcaOrganizationsDatasourceByContext } = require('@ibm-aca/aca-organizations-datasource-provider');
const { organizationsAuditorService } = require('@ibm-aca/aca-auditor-service');
const runtimeDataService = require('../runtime-data');

const deleteManyByIds = async (context, params) => {
  try {
    const DATASOURCE = getAcaOrganizationsDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.organizations.deleteManyByIds(context, params);

    await runtimeDataService.deleteManyByIdsFromConfigDirectory(context, {ids: params});

    const IDS = params;

    if (lodash.isArray(IDS)) {
      const PROMISES = [];
      IDS.forEach(id => {
        const AUDIT_PARAMS = {
          action: 'DELETE',
          docId: id,
          docType: 'ORGANIZATION',
          doc: {
            id: id,
          },
        };
        PROMISES.push(organizationsAuditorService.saveOne(context, AUDIT_PARAMS));
      });
      await Promise.all(PROMISES);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByIds,
}
