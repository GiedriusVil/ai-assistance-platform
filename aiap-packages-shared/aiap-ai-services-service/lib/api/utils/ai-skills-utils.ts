/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-ai-services-service-ai-skills-utils`;
const logger = require(`@ibm-aca/aca-common-logger`)(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiSkillExternalV1WaV1,
  IAiSkillExternalV1WaV2,
  IAiSkillV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';


const _calcArrayLength = (
  array: Array<any>,
) => {
  let retVal = 0;
  if (
    lodash.isArray(array) &&
    !lodash.isEmpty(array)
  ) {
    retVal = array.length;
  }
  return retVal;
}

const _recalculateTotalsForWA1 = (
  aiSkill: IAiSkillV1,
) => {
  let external: IAiSkillExternalV1WaV1;
  try {
    if (
      !lodash.isEmpty(aiSkill)
    ) {
      external = aiSkill?.external as IAiSkillExternalV1WaV1;
      if (
        lodash.isEmpty(aiSkill?.totals)
      ) {
        aiSkill.totals = {};
      }
      aiSkill.totals.intents = _calcArrayLength(external?.intents);
      aiSkill.totals.entities = _calcArrayLength(external?.entities);
      aiSkill.totals.dialog_nodes = _calcArrayLength(external?.dialog_nodes);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_recalculateTotalsForWA1.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _recalculateTotalsForWA2 = (
  aiSkill: IAiSkillV1,
) => {
  let external: IAiSkillExternalV1WaV2;
  try {
    if (
      !lodash.isEmpty(aiSkill)
    ) {
      external = aiSkill?.external as IAiSkillExternalV1WaV2;
      if (
        lodash.isEmpty(aiSkill?.totals)
      ) {
        aiSkill.totals = {};
      }
      aiSkill.totals.intents = _calcArrayLength(external?.workspace?.intents);
      aiSkill.totals.entities = _calcArrayLength(external?.workspace?.entities);
      aiSkill.totals.dialog_nodes = _calcArrayLength(external?.workspace?.dialog_nodes);
      aiSkill.totals.actions = _calcArrayLength(external?.workspace?.actions);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_recalculateTotalsForWA2.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const recalculateTotals = (
  params: {
    aiServiceType: AI_SERVICE_TYPE_ENUM,
    aiSkill: IAiSkillV1,
  }
) => {
  let aiServiceId;
  let aiServiceType
  let aiSkillId;
  try {
    aiServiceId = params?.aiSkill?.aiServiceId;
    aiServiceType = params?.aiServiceType;
    aiSkillId = params?.aiSkill?.id;
    if (
      lodash.isEmpty(aiServiceType)
    ) {
      const ERROR_MESSAGE = `Missing required params.aiServiceType`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.aiSkill)
    ) {
      const ERROR_MESSAGE = `Missing required params.aiSkill`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    switch (aiServiceType) {
      case AI_SERVICE_TYPE_ENUM.WA_V1:
        _recalculateTotalsForWA1(params?.aiSkill);
        break;
      case AI_SERVICE_TYPE_ENUM.WA_V2:
        _recalculateTotalsForWA2(params?.aiSkill);
        break;
      default:
        break;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { aiServiceId, aiServiceType, aiSkillId })
    logger.error(recalculateTotals.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
