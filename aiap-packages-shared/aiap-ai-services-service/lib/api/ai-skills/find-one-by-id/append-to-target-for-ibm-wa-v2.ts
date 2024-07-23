
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-service-find-one-by-id-append-to-target-for-ibm-wa-v2';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  IAiSkillV1,
  IAiSkillExternalV1WaV2,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const appendToTargetForIbmWaV2 = (
  context: IContextV1,
  params: {
    target: IAiSkillV1,
    options?: {
      addActions?: boolean,
      addIntents?: boolean,
      addEntities?: boolean,
    },
  },
) => {
  let optionsAddActions;
  let optionsAddIntents;
  let optionsAddEntities;

  let target: IAiSkillV1;
  let targetExternal: IAiSkillExternalV1WaV2;
  try {
    optionsAddActions = params?.options?.addActions;
    optionsAddIntents = params?.options?.addIntents;
    optionsAddEntities = params?.options?.addEntities;

    target = params?.target;
    targetExternal = params?.target?.external as IAiSkillExternalV1WaV2;

    // [START] 2023-01-14 -> [LEGO] Quick workarround - to keep classifier working -> Ideally we should introduce API find-one-lite-by-id -> which will be adding additional data!
    if (
      !lodash.isEmpty(target) &&
      optionsAddActions
    ) {
      const ENTITIES = targetExternal?.workspace?.actions;
      target.actions = ENTITIES
    }
    if (
      !lodash.isEmpty(target) &&
      optionsAddIntents
    ) {
      const INTENTS = targetExternal?.workspace?.intents;
      target.intents = INTENTS
    }
    if (
      !lodash.isEmpty(target) &&
      optionsAddEntities
    ) {
      const ENTITIES = targetExternal?.workspace?.entities;
      target.entities = ENTITIES
    }
    // [END] 2023-01-14 -> [LEGO] Quick workarround - to keep classifier working -> Ideally we should introduce API find-one-lite-by-id -> which will be adding additional data!

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(appendToTargetForIbmWaV2.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
