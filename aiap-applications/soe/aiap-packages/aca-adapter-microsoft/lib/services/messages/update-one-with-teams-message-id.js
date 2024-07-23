/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-adapter-microsoft-agent-services-messages-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { getAcaConversationsDatasourceByTenant } = require('@ibm-aca/aca-conversations-datasource-provider');

const updateOneWithTeamsMessageId = async (context, params) => {
  try {
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps(context);
    const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);
    const BOT_MESSAGE_ID = ramda.path(['botMessageId'], params);
    const MS_TEAMS_MESSAGE_ID = ramda.path(['msTeamsMessageId'], params);

    const PARAMS = {
      message: {
        id: BOT_MESSAGE_ID,
        msTeamsMessageId: MS_TEAMS_MESSAGE_ID,
      }
    };
    const RET_VAL = await DATASOURCE.messages.saveOne({}, PARAMS);
    logger.info('Message log updated with msTeamsMessageId', { RET_VAL });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  updateOneWithTeamsMessageId,
};
