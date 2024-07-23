/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-watson-assistant-v2-request-construct-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  IAiServiceRequestV1,
  IAiServiceRequestExternalV1WaV2,
  IAiServiceRequestExternalContextV1WaV2,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  getUpdateSession,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  IConstructRequestParamsV1,
} from '../../../types';

const _appendContextGlobalToTarget = (
  update: ISoeUpdateV1,
  target: IAiServiceRequestExternalContextV1WaV2,
) => {
  let updateSession;
  let aiServiceId;
  let stateIbmWaV2Global;
  try {
    if (
      !lodash.isObject(target)
    ) {
      return;
    }
    updateSession = getUpdateSession(update);
    aiServiceId = updateSession?.aiService?.id;
    
    if (
      lodash.isEmpty(aiServiceId)
    ) {
      const ERROR_MESSAGE = `Missing required update?.session?.aiService?.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }

    stateIbmWaV2Global = lodash.cloneDeep(
      ramda.pathOr({}, [aiServiceId, 'global'], update?.session?.state?.ibmWaV2),
    );

    target.global = stateIbmWaV2Global;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendContextGlobalToTarget.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _appendContextSkillsToTarget = (
  update: ISoeUpdateV1,
  target: IAiServiceRequestExternalContextV1WaV2,
) => {
  let updateSession;
  let aiServiceId;
  let stateIbmWaV2Skills;
  try {
    if (
      !lodash.isObject(target)
    ) {
      return;
    }
    updateSession = getUpdateSession(update);
    aiServiceId = updateSession?.aiService?.id;
    if (
      lodash.isEmpty(aiServiceId)
    ) {
      const ERROR_MESSAGE = `Missing required update?.session?.aiService?.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    stateIbmWaV2Skills = lodash.cloneDeep(
      ramda.pathOr({}, [aiServiceId, 'skills'], update?.session?.state?.ibmWaV2),
    );
    stateIbmWaV2Skills.user_defined = update?.session?.context || {};


    const ACTIONS_SKILL_SYSTEM_STATE = ramda.path(['actions skill', 'system', 'state'], stateIbmWaV2Skills);

    const ACTIONS_SKILL: any = {
      skill_variables: update?.session?.context || {},
    };

    if (
      !lodash.isEmpty(ACTIONS_SKILL_SYSTEM_STATE)
    ) {
      ACTIONS_SKILL.system = {
        state: ACTIONS_SKILL_SYSTEM_STATE,
      }
    }

    stateIbmWaV2Skills['actions skill'] = ACTIONS_SKILL

    stateIbmWaV2Skills['main skill'] = {
      user_defined: update?.session?.context || {},
    }

    target.skills = stateIbmWaV2Skills;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendContextSkillsToTarget.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const constructOne = async (
  context: ISoeContextV1,
  params: IConstructRequestParamsV1,
): Promise<IAiServiceRequestV1> => {

  let update: ISoeUpdateV1;
  let updateSession;
  let updateRequestMessageText;

  let aiService;

  let aiSkill;
  let selectedIntent;

  let text;

  let external: IAiServiceRequestExternalV1WaV2;

  let retVal: IAiServiceRequestV1;
  try {
    if (
      lodash.isEmpty(params?.update)
    ) {
      const ERROR_MESSAGE = `Missing required params.update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    update = params?.update;
    updateRequestMessageText = update?.request?.message?.text;
    updateSession = getUpdateSession(update);
    aiService = updateSession?.aiService;

    if (
      lodash.isEmpty(aiService)
    ) {
      const ERROR_MESSAGE = `Missing required params.update.session.aiService parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    if (
      !lodash.isEmpty(updateRequestMessageText)
    ) {
      text = updateRequestMessageText
        .replace(/’/g, "'")
        .replace(/\n/g, ' ')
        .replace(/\t/g, ' ');
    }

    aiSkill = aiService?.aiSkill;
    selectedIntent = aiSkill?.selectedIntent;

    external = {
      assistantId: aiService?.external?.environmentId,
      input: {
        message_type: 'text',
        text: text,
      },
    }

    if (
      !lodash.isEmpty(selectedIntent)
    ) {
      external.input.intents = [selectedIntent];
    }

    external.input.options = {
      debug: true,
    };

    external.context = {};

    _appendContextGlobalToTarget(update, external.context);
    _appendContextSkillsToTarget(update, external.context);

    retVal = {
      type: aiService?.type,
      version: aiService?.version,
      external: external,
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructOne.name, { ACA_ERROR, aiService });
    throw ACA_ERROR;
  }
}
