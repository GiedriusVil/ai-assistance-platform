/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-slack-utils-save-feedbacks-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaConversationsDatasourceByTenant } = require('@ibm-aca/aca-conversations-datasource-provider');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { v4: uuidv4 } = require('uuid');
const { findOneBySlackMessageId } = require('./slack-message.utils');

const processFeedback = async (params) => {
  const TENANT = ramda.path(['tenantId'], params);
  const MESSAGE = ramda.path(['message'], params);
  try {
    if (
      lodash.isEmpty(TENANT)
    ) {
      const MESSAGE = `Missing required params.tenant parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TENANT)
    ) {
      const MESSAGE = `Missing required params.message parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const FEEDBACK_PARAMS = {
      tenantId: TENANT,
      message: MESSAGE
    };
    saveUsersFeedback(FEEDBACK_PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const saveUsersFeedback = async (params) => {
  try {
    const TENANT_ID = ramda.path(['tenantId'], params);
    if (!lodash.isEmpty(TENANT_ID)) {
      const MESSAGE = ramda.path(['message'], params);
      const CONTEXT = {
        tenantId: TENANT_ID,
        message: MESSAGE,
      };
      const SLACK_MESSAGE = await findOneBySlackMessageId(CONTEXT, {});
      if (!lodash.isEmpty(SLACK_MESSAGE)) {

        const FEEDBACK_SAVE_PARAMS = {
          message: SLACK_MESSAGE,
        };
        await saveOne(CONTEXT, FEEDBACK_SAVE_PARAMS);
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const saveOne = async (context, params) => {
  try {
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const TENANT_ID = ramda.path(['tenantId'], context);
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.reloadOneById(TENANT_ID);
    const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);
    const PARAMS = constructFeedbackSaveParams(context, params);
    const RET_VAL = await DATASOURCE.feedbacks.saveOne(context, PARAMS);
    logger.info('Executed feedback logging!', { RET_VAL });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const constructFeedbackSaveParams = (context, params) => {
  try {
    const _ID = uuidv4();
    const TENANT_ID = params?.message?.tenantId;
    const ASSISTANT_ID = params?.message?.assistantId;
    const CONVERSATION_ID = params?.message?.conversationId;
    const USER_ID = context?.gAcaProps?.userProfile?.id;
    const REACTION_ADDED = context?.message?.actions?.value;
    const MESSAGE_ID = params?.message?._id;
    const UTTERANCE_ID = params?.message?.utteranceId;
    const TRANSFORMED_REACTION = transformReactionByType(REACTION_ADDED);

    const RET_VAL = {
      feedback: {
        _id: _ID,
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
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const transformReactionByType = (reaction) => {
  const REACTION_TYPE = reaction;
  switch (REACTION_TYPE) {
    case 'positive':
      return {
        score: 1,
        reason: 'User reaction added to message',
        comment: `User reaction: ${REACTION_TYPE}`
      };
    case 'negative':
      return {
        score: -1,
        reason: 'User reaction added to message',
        comment: `User reaction: ${REACTION_TYPE}`
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
  processFeedback
}
