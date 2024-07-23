/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-middleware-classifier-classifier-service-has-to-force-disambiguation';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiSkillV1,
  IClassificationModelV1,
} from '@ibm-aiap/aiap--types-server';

const hasToForceDisambiguation = (
  model: IClassificationModelV1,
  aiSkills: Array<IAiSkillV1>,
) => {
  try {
    let retVal = false;
    const DISAMBIGUATION = model?.ware?.disambiguation;
    if (
      lodash.isEmpty(DISAMBIGUATION)
    ) {
      return retVal;
    }


    const DISAMBIGUATION_THRESHOLD = ramda.pathOr(0.0, ['threshold'], DISAMBIGUATION);
    retVal = true;
    if (
      lodash.isArray(aiSkills) &&
      !lodash.isEmpty(aiSkills)
    ) {
      for (const AI_SKILL of aiSkills) {

        const AI_SKILL_RATE = ramda.pathOr(0.0, ['rate'], AI_SKILL);
        if (
          AI_SKILL_RATE >= DISAMBIGUATION_THRESHOLD
        ) {
          retVal = false;
          break;
        }
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(hasToForceDisambiguation.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  hasToForceDisambiguation,
}
