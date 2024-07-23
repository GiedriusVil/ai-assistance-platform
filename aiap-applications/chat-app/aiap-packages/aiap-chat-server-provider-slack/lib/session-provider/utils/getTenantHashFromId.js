/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-adapter-slack-lib-utils-get-tenant-hash-from-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const getTenantHashFromId = async (tenantId) => {
  try {
    const TENANT_ID = tenantId
    const DATASOURCE = getDatasourceV1App();
    const TENANT = await DATASOURCE.tenants.findOneById({}, { id: TENANT_ID });
    const TENANT_HASH = ramda.path(['hash'], TENANT);
    return TENANT_HASH;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getTenantHashFromId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  getTenantHashFromId,
};
