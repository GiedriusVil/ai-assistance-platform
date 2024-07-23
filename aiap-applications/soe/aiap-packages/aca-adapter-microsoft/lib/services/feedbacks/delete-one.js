/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-adapter-microsoft-services-feedbacks-delete-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { getAcaConversationsDatasourceByTenant } = require('@ibm-aca/aca-conversations-datasource-provider');

const deleteOne = async (context, params) => {
  try {
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps(context);
    const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);

    const MESSAGE_ID = ramda.path(['message', 'id'], params);
    const PARAMS = {
      messageId: MESSAGE_ID,
    };

    const RET_VAL = await DATASOURCE.feedbacks.deleteOneByMessageId(context, PARAMS);
    logger.info('Feedback removed!', { RET_VAL });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteOne,
};
