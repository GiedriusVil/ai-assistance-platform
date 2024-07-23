/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-watson-assistant-v1-request-construct-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceV1,
  IAiServiceRequestV1,
  IAiServiceRequestExternalV1WaV1,
  IAiSkillV1,
  IAiSkillExternalV1WaV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getUpdateSession
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  IConstructRequestParamsV1,
} from '../../../types';

const todaysDate = () => {
  const DATE = new Date();
  return DATE.getFullYear() + '-' + DATE.getMonth() + '-' + DATE.getDate();
};

const _appendMetadataToTarget = (update, target) => {
  let stateIbmWaV1Metadata;
  try {
    if (
      !lodash.isObject(target)
    ) {
      return;
    }
    stateIbmWaV1Metadata = lodash.cloneDeep(
      update?.session?.state?.ibmWaV1?.metadata || {},
    );

    stateIbmWaV1Metadata.utteranceId = String(update.traceId && update.traceId.utteranceId);
    stateIbmWaV1Metadata.messageId = String(update.traceId && update.traceId.messageId);

    stateIbmWaV1Metadata.user_id = String(
      update?.session?.context?.profile?.emplid || (update.sender && update.sender.id)
    );

    target.metadata = stateIbmWaV1Metadata;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendMetadataToTarget.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _appendSystemToTarget = (update, target) => {
  let aiSkill;

  let stateIbmWaV1System;
  try {
    if (
      !lodash.isObject(target)
    ) {
      return;
    }
    aiSkill = update?.session?.aiService?.aiSkill;

    if (
      aiSkill?.external?.systemContext
    ) {
      stateIbmWaV1System = lodash.cloneDeep(
        aiSkill?.external?.systemContext,
      );
    } else {
      stateIbmWaV1System = lodash.cloneDeep(
        update?.session?.state?.ibmWaV1?.system || {},
      );
    }

    target.system = stateIbmWaV1System;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendSystemToTarget.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _constructContext = (update) => {
  let context;
  try {
    context = update?.session?.context || {};
    const RET_VAL = lodash.cloneDeep(context);
    _appendSystemToTarget(update, RET_VAL);
    _appendMetadataToTarget(update, RET_VAL)
    RET_VAL.utteranceId = String(update.traceId && update.traceId.utteranceId);
    RET_VAL.messageId = String(update.traceId && update.traceId.messageId);
    RET_VAL.aca ? (RET_VAL.aca.channel = update.channel) : (RET_VAL.aca = { channel: update.channel });
    // TODO
    // if (config.service.config.timezone) {
    //   context.timezone = config.service.config.timezone;
    // }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_constructContext.name, { ACA_ERROR });
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

  let aiService: IAiServiceV1;

  let aiSkill: IAiSkillV1;
  let aiSkillExternal: IAiSkillExternalV1WaV1;
  let aiSkillExternalWorkspaceId;
  let selectedIntent;

  let customerId;

  let text;

  let external: IAiServiceRequestExternalV1WaV1;

  let retVal: IAiServiceRequestV1;
  try {
    update = params?.update;

    updateRequestMessageText = update?.request?.message?.text;

    if (
      !lodash.isEmpty(updateRequestMessageText)
    ) {
      text = updateRequestMessageText
        .replace(/’/g, "'")
        .replace(/\n/g, ' ')
        .replace(/\t/g, ' ');
    }

    updateSession = getUpdateSession(update);
    // TODO
    // const ALTERNATE_INTENTS = ramda.pathOr(true, ['service', 'config', 'alternateIntents'], config);

    if (
      lodash.isEmpty(update)
    ) {
      const ERROR_MESSAGE = `Missing required params.update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    aiService = updateSession?.aiService;
    if (
      lodash.isEmpty(aiService)
    ) {
      const ERROR_MESSAGE = `Missing required params.update.session.aiService parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    aiSkill = aiService?.aiSkill;
    aiSkillExternal = aiSkill?.external as IAiSkillExternalV1WaV1;
    aiSkillExternalWorkspaceId = aiSkillExternal?.workspace_id;
    selectedIntent = aiSkill?.selectedIntent;

    customerId = todaysDate();

    external = {
      workspaceId: aiSkillExternalWorkspaceId,
      input: {
        text: text,
      },
      context: _constructContext(update),
      headers: {
        'X-Watson-Metadata': {
          customer_id: customerId
        },
      },
    }

    if (
      !lodash.isEmpty(selectedIntent)
    ) {
      external.intents = [selectedIntent];
    }

    retVal = {
      type: aiService?.type,
      version: aiService?.version,
      external: external,
    };

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructOne.name, { ACA_ERROR, aiService });
    throw ACA_ERROR;
  }
}
