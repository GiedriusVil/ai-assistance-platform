/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-adapter-slack-services-messages-find-one-by-slack-message-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { getAcaConversationsDatasourceByTenant } = require('@ibm-aca/aca-conversations-datasource-provider');

const findOneBySlackMessageId = async (context, params) => {
  try {
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const G_ACA_PROPS = ramda.path(['gAcaProps'], context);
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({ gAcaProps: G_ACA_PROPS });
    const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);
    const SLACK_MESSAGE_ID = ramda.path(['message', 'item', 'ts'], context);
    const MESSAGES_QUERY = {
      slackMessageId: SLACK_MESSAGE_ID,
      sort: {
        field: 'created',
        direction: 'desc'
      }
    };
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
  findOneBySlackMessageId,
};
