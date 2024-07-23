/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-server-service-feedbacks-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  getTenantsCacheProvider
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getAcaConversationsDatasourceByTenant
} from '@ibm-aca/aca-conversations-datasource-provider';

const saveOne = async (context, params) => {
  try {
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    // 2021-12-23 [LEGO] - Need to return and fix this peace!
    const TENANT_ID = context?.gAcaProps?.tenantId;
    const TENANT_HASH = context?.gAcaProps?.tenantHash;

    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByIdAndHash({
      id: TENANT_ID,
      hash: TENANT_HASH
    });
    const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);
    const RET_VAL = await DATASOURCE.feedbacks.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  saveOne,
};
