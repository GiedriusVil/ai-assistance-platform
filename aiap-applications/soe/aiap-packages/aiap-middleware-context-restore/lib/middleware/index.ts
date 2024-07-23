/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `middleware-context-restore`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  ACA_ERROR_TYPE,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  shouldSkipBySenderActionTypes
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  getLibConfiguration
} from '../configuration';

import {
  retrieveUtteranceByUpdateSenderAction
} from '../service';

import {
  restoreAiService,
  restoreContext,
} from '../executor-restore';

class ContextRestoreWare extends AbstractMiddleware {
  constructor() {
    try {
      super(
        [botStates.NEW, botStates.UPDATE, botStates.INTERNAL_UPDATE],
        'context-restore-ware',
        middlewareTypes.INCOMING
      );
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(adapter, update) {
    let configuration;
    let supportedActions;
    let messageActionType;

    let currentSkillId;

    let utterance;
    let extractedContext;
    let extractedState;
    let extractedAiServiceId;
    let extractedAiSkillId;

    let aiServiceRestoreParams;
    let contextRestoreParams;

    try {
      configuration = getLibConfiguration();
      supportedActions = configuration?.supportedActions;
      messageActionType = update?.raw?.message?.sender_action?.type;

      if (lodash.isEmpty(messageActionType)) {
        return;
      }

      if (lodash.includes(supportedActions, messageActionType)) {
        currentSkillId = update?.session?.aiService?.aiSkill?.id;

        utterance = await retrieveUtteranceByUpdateSenderAction(update);
        if (lodash.isEmpty(utterance)) {
          const ERROR_MESSAGE = `Unable to retrieve utterance! Context cannot be restored.`;
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
        }

        extractedContext = utterance.context;
        extractedState = utterance.state;
        extractedAiServiceId = utterance.serviceId;
        extractedAiSkillId = utterance.skillId;

        const EXTRACTED_G_ACA_PROPS = extractedContext?.gAcaProps?.userSelectedLanguage;
        const SESSION_G_ACA_PROPS = update?.session?.context?.gAcaProps?.userSelectedLanguage;
        if (EXTRACTED_G_ACA_PROPS && EXTRACTED_G_ACA_PROPS?.iso2 !== SESSION_G_ACA_PROPS?.iso2) {
          extractedContext.gAcaProps.userSelectedLanguage = SESSION_G_ACA_PROPS;
        }

        contextRestoreParams = {
          context: extractedContext,
          state: extractedState,
        }

        aiServiceRestoreParams = {
          aiService: {
            id: extractedAiServiceId,
            aiSkill: {
              id: extractedAiSkillId,
            },
          },
        };

        restoreContext(update, contextRestoreParams);
        if (extractedAiSkillId !== currentSkillId) {
          await restoreAiService(update, aiServiceRestoreParams);
        }
      }
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('executor', { ACA_ERROR });
      appendDataToError(ACA_ERROR, {
        messageActionType,
        currentSkillId,
        extractedContext,
        extractedState,
        aiServiceRestoreParams,
        contextRestoreParams,
      });
      throw ACA_ERROR;
    }
  }
}

export {
  ContextRestoreWare,
}
