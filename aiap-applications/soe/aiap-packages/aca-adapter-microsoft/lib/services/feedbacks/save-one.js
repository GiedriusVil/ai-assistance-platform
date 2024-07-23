/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-adapter-microsoft-services-feedbacks-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { getAcaConversationsDatasourceByTenant } = require('@ibm-aca/aca-conversations-datasource-provider');

const saveOne = async (context, params) => {
  try {
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps(context);
    const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);
    const PARAMS = constructParams(context, params);
    const RET_VAL = await DATASOURCE.feedbacks.saveOne(context, PARAMS);
    logger.info('Feedback saved!', { RET_VAL });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const constructParams = (context, params) => {
  const G_ACA_PROPS = context?.gAcaProps;
  const TENANT_ID = G_ACA_PROPS?.tenantId;
  const ASSISTANT_ID = G_ACA_PROPS?.assistantId;
  const REACTIONS_ADDED = context?.activity?.reactionsAdded;
  const MESSAGE_ID = params?.message?._id;
  const UTTERANCE_ID = params?.message?.utteranceId;
  const CONVERSATION_ID = params?.message?.conversationId;
  const USER_ID = G_ACA_PROPS?.userProfile?.id;

  const TRANSFORMED_REACTION = transformReactionByType(REACTIONS_ADDED);

  const RET_VAL = {
    feedback: {
      tenant: TENANT_ID,
      assistant: ASSISTANT_ID,
      conversationId: CONVERSATION_ID,
      userId: USER_ID,
      messageId: MESSAGE_ID,
      utteranceId: UTTERANCE_ID,
      score: TRANSFORMED_REACTION.score,
      reason: TRANSFORMED_REACTION.reason,
      comment: TRANSFORMED_REACTION.comment,
      created: new Date(),
    }
  };
  return RET_VAL;
}

const transformReactionByType = (reactions) => {
  const REACTION_TYPE = ramda.path([[0], 'type'], reactions);
  switch (REACTION_TYPE) {
    case 'like':
    case 'heart':
    case 'laugh':
      return {
        score: 1,
        reason: 'User reaction added to message',
        comment: 'User reaction: ' + REACTION_TYPE,
      };
    case 'surprised':
    case 'sad':
    case 'angry':
      return {
        score: -1,
        reason: 'User reaction added to message',
        comment: 'User reaction: ' + REACTION_TYPE,
      };
    default:
      return {
        score: null,
        reason: null,
        comment: 'Not provided / unknown reaction'
      };
  }
}

module.exports = {
  saveOne,
};
