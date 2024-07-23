/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-slack-utils-message-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { getAcaConversationsDatasourceByTenant } = require('@ibm-aca/aca-conversations-datasource-provider');


const isUserSlackMessage = (message) => {
  const CLIENT_MESSAGE_ID = ramda.path(['client_msg_id'], message);
  try {
    let retVal = false;
    if (
      !lodash.isEmpty(CLIENT_MESSAGE_ID)
    ) {
      retVal = true;
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('isUserSlackMessage', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const findOneBySlackMessageId = async (context, params) => {
  try {
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const TENANT_ID = ramda.path(['tenantId'], context);
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.reloadOneById(TENANT_ID);
    const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);
    const SLACK_MESSAGE_ID = ramda.path(['message', 'message', 'ts'], context);
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

const retrieveActionId = (message) => {
  try {
    const PATTERN = /.+?(?=-)/;
    const MATCH = PATTERN.exec(message);
    if (MATCH && MATCH[0]) {
      return MATCH[0];
    }
    return 'default';
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('retrieveActionId', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  isUserSlackMessage,
  retrieveActionId,
  findOneBySlackMessageId
}
