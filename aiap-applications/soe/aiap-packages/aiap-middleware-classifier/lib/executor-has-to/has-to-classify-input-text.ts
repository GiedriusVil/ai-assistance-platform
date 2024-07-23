/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-classifier-has-to-classify-input-text';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getUpdateSessionAiService,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  IAiServiceAdapterV1,
  IAiServiceAdapterV1RegistryV1,
  getRegistry,
} from '@ibm-aiap/aiap-ai-service-adapter-provider';

const CLASSIFICATION_REASONS = {
  DEFAULT: 'DEFAULT',
  //
  ON_INPUT_TEXT_EMPTY: 'ON_INPUT_TEXT_EMPTY',
  ON_INPUT_TEXT_WELCOME: 'ON_INPUT_TEXT_WELCOME',
  ON_INPUT_TEXT_RESTART_CONVERSATION: 'ON_INPUT_TEXT_RESTART_CONVERSATION',
  ON_INPUT_TEXT_SYSTEM: 'ON_INPUT_TEXT_SYSTEM',
  //
  ON_UPDATE_STATUS_NEW: 'ON_UPDATE_STATUS_NEW',
  ON_AI_CHANGE: 'ON_AI_CHANGE',
  ON_BRANCH_EXIT: 'ON_BRANCH_EXIT',
  ON_NON_DEFAULT_AI_SERVICE: 'ON_NON_DEFAULT_AI_SERVICE',
  ON_REQUESTED_BY_AI: 'ON_REQUESTED_BY_AI',
};

const identifyClassificationReason = async (
  update: ISoeUpdateV1,
) => {
  let aiService;
  let aiServiceAdapterRegistry: IAiServiceAdapterV1RegistryV1;
  let aiServiceAdapter: IAiServiceAdapterV1;
  let aiServiceEngagement;
  try {
    const INPUT_TEXT = update?.raw?.message?.text;
    if (
      lodash.isEmpty(INPUT_TEXT)
    ) {
      return CLASSIFICATION_REASONS.ON_INPUT_TEXT_EMPTY;
    }
    if (
      INPUT_TEXT === '§§§WELCOME'
    ) {
      return CLASSIFICATION_REASONS.ON_INPUT_TEXT_WELCOME;
    }
    if (
      INPUT_TEXT === '§§§RESTART_CONVERSATION'
    ) {
      return CLASSIFICATION_REASONS.ON_INPUT_TEXT_RESTART_CONVERSATION;
    }
    if (
      INPUT_TEXT.startsWith('§§§')
    ) {
      return CLASSIFICATION_REASONS.ON_INPUT_TEXT_SYSTEM;
    }
    const UPDATE_STATUS = update?.status;
    if (
      UPDATE_STATUS === 'NEW'
    ) {
      return CLASSIFICATION_REASONS.ON_UPDATE_STATUS_NEW;
    }
    const RESPONSE = update?.response;
    if (
      !lodash.isEmpty(RESPONSE) &&
      lodash.isString(RESPONSE) &&
      RESPONSE.startsWith('<changeWA')
    ) {
      return CLASSIFICATION_REASONS.ON_AI_CHANGE;
    }
    if (
      !lodash.isEmpty(RESPONSE) &&
      lodash.isString(RESPONSE) &&
      RESPONSE.startsWith('<acaReclasify')
    ) {
      return CLASSIFICATION_REASONS.ON_REQUESTED_BY_AI;
    }
    aiService = getUpdateSessionAiService(update);

    aiServiceAdapterRegistry = getRegistry();
    aiServiceAdapter = aiServiceAdapterRegistry[aiService?.type];

    const IS_BRANCH_EXIT = await aiServiceAdapter.state.isBranchExit(
      {},
      {
        update,
      }
    );

    if (
      IS_BRANCH_EXIT?.value
    ) {
      return CLASSIFICATION_REASONS.ON_BRANCH_EXIT;
    }

    aiServiceEngagement = update?.session?.context?.engagement?.soe?.aiService;
    if (
      !lodash.isEmpty(aiService) &&
      !lodash.isEqual(
        {
          aiServiceId: aiService?.id,
          aiSkillId: aiService?.aiSkill?.id,
        },
        {
          aiServiceId: aiServiceEngagement?.id,
          aiSkillId: aiServiceEngagement?.aiSkill?.id,
        },
      )
    ) {
      return CLASSIFICATION_REASONS.ON_NON_DEFAULT_AI_SERVICE;
    }
    return CLASSIFICATION_REASONS.DEFAULT;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(identifyClassificationReason.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const hasToClassifyInputText = async (
  update: ISoeUpdateV1,
) => {
  try {
    if (
      lodash.isEmpty(update)
    ) {
      const MESSAGE = `Missing required update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    let retVal = false;
    const CLASSIFICATION_REASON = await identifyClassificationReason(update);
    switch (CLASSIFICATION_REASON) {
      case CLASSIFICATION_REASONS.ON_UPDATE_STATUS_NEW:
      case CLASSIFICATION_REASONS.ON_BRANCH_EXIT:
      case CLASSIFICATION_REASONS.ON_REQUESTED_BY_AI:
        retVal = true;
        break;
      default:
        break;
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(hasToClassifyInputText.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  hasToClassifyInputText,
}
