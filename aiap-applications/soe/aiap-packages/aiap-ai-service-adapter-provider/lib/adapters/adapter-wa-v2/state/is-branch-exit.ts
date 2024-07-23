/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-wa-v2-state-is-branch-exit';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  getUpdateSessionState,
  getUpdateSession,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IStateIsBranchExitParamsV1,
  IStateIsBranchExitResponseV1,
} from '../../../types';

export const isBranchExit = async (
  context: ISoeContextV1,
  params: IStateIsBranchExitParamsV1,
): Promise<IStateIsBranchExitResponseV1> => {
  let update;
  let updateSession;
  let updateSessionState;

  let aiServiceId;
  let debug;

  let hasNodeVisitedEvent = false;
  let hasActionVisitedEvent = false;
  let hasActionFinishedEvent = false;

  const RET_VAL: IStateIsBranchExitResponseV1 = {
    value: false
  };
  try {
    update = params?.update;
    updateSession = getUpdateSession(update);

    aiServiceId = updateSession?.aiService?.id;
    if (
      lodash.isEmpty(aiServiceId)
    ) {
      const ERROR_MESSAGE = `Missing required update?.session?.aiService?.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    updateSessionState = getUpdateSessionState(update);
    debug = updateSessionState?.ibmWaV2[aiServiceId]?.debug;
    if (
      !lodash.isEmpty(debug?.turn_events) &&
      lodash.isArray(debug?.turn_events)
    ) {
      for (const TMP_EVENT of debug.turn_events) {
        if (
          TMP_EVENT?.event === 'node_visited' &&
          !hasNodeVisitedEvent
        ) {
          hasNodeVisitedEvent = true;
        }
        if (
          [
            'action_visited',
            'step_visited',
            'step_answered',
            'action_finished',
          ].includes(TMP_EVENT?.event) &&
          !hasActionVisitedEvent
        ) {
          hasActionVisitedEvent = true;
        }
        if (
          TMP_EVENT?.event === 'action_finished' &&
          !hasActionFinishedEvent
        ) {
          hasActionFinishedEvent = true;
        }
      }
    }
    if (
      hasNodeVisitedEvent
    ) {
      if (
        true === debug?.branch_exited
      ) {
        RET_VAL.value = true;
      }
    } else if (
      !hasNodeVisitedEvent &&
      hasActionVisitedEvent
    ) {
      RET_VAL.value = hasActionFinishedEvent;
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(isBranchExit.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
