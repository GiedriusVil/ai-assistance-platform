/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-service-find-one-by-id-append-to-target-for-ibm-wa-v1';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IAiSkillExternalV1WaV1,
  IAiSkillV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const appendToTargetForIbmWaV1 = (
  context: IContextV1,
  params: {
    target: IAiSkillV1,
    options?: {
      addIntents?: boolean,
      addEntities?: boolean,
    },
  },
) => {
  let optionsAddIntents;
  let optionsAddEntities;

  let target: IAiSkillV1;
  let targetExternal: IAiSkillExternalV1WaV1;
  try {
    optionsAddIntents = params?.options?.addIntents;
    optionsAddEntities = params?.options?.addEntities;
    target = params?.target;
    targetExternal = params?.target?.external as IAiSkillExternalV1WaV1;
    // [START] 2023-01-14 -> [LEGO] Quick workarround - to keep classifier working -> Ideally we should introduce API find-one-lite-by-id -> which will be adding additional data!
    if (
      !lodash.isEmpty(target) &&
      optionsAddIntents
    ) {
      const INTENTS = targetExternal?.intents;
      target.intents = INTENTS
    }
    if (
      !lodash.isEmpty(target) &&
      optionsAddEntities
    ) {
      const ENTITIES = targetExternal?.entities;
      target.entities = ENTITIES
    }
    // [END] 2023-01-14 -> [LEGO] Quick workarround - to keep classifier working -> Ideally we should introduce API find-one-lite-by-id -> which will be adding additional data!
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(appendToTargetForIbmWaV1.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
