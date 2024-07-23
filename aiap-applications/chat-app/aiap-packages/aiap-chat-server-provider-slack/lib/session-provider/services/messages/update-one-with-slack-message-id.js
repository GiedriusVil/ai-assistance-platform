/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-adapter-slack-lib-services-messages-update-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { getAcaConversationsDatasourceByTenant } = require('@ibm-aca/aca-conversations-datasource-provider');

const updateOneWithSlackMessageId = async (context, params) => {
  try {
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const G_ACA_PROPS = ramda.path(['gAcaProps'], context);
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({ gAcaProps: G_ACA_PROPS });
    const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);
    const BOT_MESSAGE_ID = ramda.path(['botMessageId'], params);
    const SLACK_MESSAGE_ID = ramda.path(['slackMessageId'], params);

    const PARAMS = {
      message: {
        id: BOT_MESSAGE_ID,
        slackMessageId: SLACK_MESSAGE_ID,
      }
    };
    const RET_VAL = await DATASOURCE.messages.saveOne({}, PARAMS);
    logger.info('Message log updated with slackMessageId', { RET_VAL });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  updateOneWithSlackMessageId,
};
