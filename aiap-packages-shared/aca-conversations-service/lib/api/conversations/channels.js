/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-service-conversations-channels';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaConversationsDatasourceByContext } = require('@ibm-aca/aca-conversations-datasource-provider');

const channels = async (context, params) => {
  try {
    const DATASOURCE = getAcaConversationsDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.conversations.channels(context, params);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${channels.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  channels,
};
