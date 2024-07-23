/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-server-services-transcripts-find-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  getTenantsCacheProvider
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getAcaConversationsDatasourceByTenant
} from '@ibm-aca/aca-conversations-datasource-provider';

const findOne = async (params) => {
  let gAcaProps;
  try {
    gAcaProps = params?.gAcaProps;
    const CONVERSATION_ID = params?.conversationId;

    const TENANT_ID = '';
    const TENANT_HASH = '';

    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByIdAndHash({ id: TENANT_ID, hash: TENANT_HASH });

    const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);
    const RET_VAL = await DATASOURCE.transcripts.findOneByConversationId({}, { id: CONVERSATION_ID });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { gAcaProps });
    logger.error(`${findOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  findOne,
};
