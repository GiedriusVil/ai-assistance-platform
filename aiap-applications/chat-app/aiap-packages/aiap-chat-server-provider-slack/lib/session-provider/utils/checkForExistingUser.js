/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-adapter-slack-lib-utils-check-for-existing-user';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');
const { getAcaConversationsDatasourceByTenant } = require('@ibm-aca/aca-conversations-datasource-provider');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructIdFromRawUpdate } = require('./constructIdFromRawUpdate');

const checkForExistingUser = async (params) => {
  try {
    const TENANT_ID = ramda.path(['settings', 'tenantId'], params);
    const RAW_UPDATE = ramda.path(['rawUpdate'], params);
    const USER_ID = constructIdFromRawUpdate(RAW_UPDATE);
    const DATASOURCE = getDatasourceV1App();
    const TENANT = await DATASOURCE.tenants.findOneById({}, { id: TENANT_ID });
    const CONVERSATIONS_DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);
    const USER = await CONVERSATIONS_DATASOURCE.users.findOneById({}, { id: USER_ID });

    return USER;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  checkForExistingUser,
}; 
