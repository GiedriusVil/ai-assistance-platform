/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-server-services-user';
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

const findOne = async (params) => {
  try {
    const USER_ID = params?.userId;

    const G_ACA_PROPS = params?.gAcaProps;

    const TENANT_ID = G_ACA_PROPS?.tenantId;
    const TENANT_HASH = G_ACA_PROPS?.tenantHash;

    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByIdAndHash({ id: TENANT_ID, hash: TENANT_HASH });

    const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);
    const RET_VAL = await DATASOURCE.transcripts.findOneByConversationId({}, { id: USER_ID });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export default {
  findOne,
};
