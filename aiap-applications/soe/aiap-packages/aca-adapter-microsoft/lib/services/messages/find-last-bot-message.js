/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-adapter-microsoft-services-messages-find-last-bot-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { getAcaConversationsDatasourceByTenant } = require('@ibm-aca/aca-conversations-datasource-provider');

const findLastBotMessage = async (context, params) => {
  try {
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps(context);
    const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);

    const CONVERSATION_ID = ramda.path(['activity', 'conversation', 'id'], context);
    const MESSAGES_QUERY = {
      conversationId: CONVERSATION_ID,
      author: 'BOT',
      sort: {
        field: 'created',
        direction: 'desc'
      }
    }
    const RESULT = await DATASOURCE.messages.findManyByQuery({}, MESSAGES_QUERY);
    const RET_VAL = ramda.path(['items', [0]], RESULT);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findLastBotMessage,
};
