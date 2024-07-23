/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-service-find-one-by-id-append-to-target-for-aws-lex-v2';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IAiSkillExternalV1AwsLexV2,
  IAiSkillV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const appendToTargetForAwsLexV2 = (
  context: IContextV1,
  params: {
    target: IAiSkillV1,
    options: {
      addIntents?: boolean,
      addEntities?: boolean,
    },
  },
) => {
  let external: IAiSkillExternalV1AwsLexV2;
  let optionsAddIntents;
  let target: IAiSkillV1;
  try {
    optionsAddIntents = params?.options?.addIntents;
    target = params?.target;
    // [START] 2023-01-14 -> [LEGO] Quick workarround - to keep classifier working -> Ideally we should introduce API find-one-lite-by-id -> which will be adding additional data!
    if (
      !lodash.isEmpty(target) &&
      optionsAddIntents
    ) {
      external = target?.external as IAiSkillExternalV1AwsLexV2;
      const EXTERNAL_INTENTS = external?.intents;
      const INTENTS = [];
      if (
        !lodash.isEmpty(EXTERNAL_INTENTS) &&
        lodash.isArray(EXTERNAL_INTENTS)
      ) {
        for (const EXTERNAL_INTENT of EXTERNAL_INTENTS) {
          if (
            !lodash.isEmpty(EXTERNAL_INTENT?.intentName) &&
            !lodash.isEmpty(EXTERNAL_INTENT?.describe?.sampleUtterances) &&
            lodash.isArray(EXTERNAL_INTENT?.describe?.sampleUtterances)
          ) {
            const TMP_EXAMPLES = [];
            for (const SAMPLE_UTTERANCE of EXTERNAL_INTENT.describe.sampleUtterances) {
              if (
                !lodash.isEmpty(SAMPLE_UTTERANCE?.utterance)
              ) {
                TMP_EXAMPLES.push({ text: SAMPLE_UTTERANCE?.utterance })
              }
            }
            INTENTS.push({
              intent: EXTERNAL_INTENT?.intentName,
              examples: TMP_EXAMPLES,
            });
          }

        }
      }
      target.intents = INTENTS
    }
    // [END] 2023-01-14 -> [LEGO] Quick workarround - to keep classifier working -> Ideally we should introduce API find-one-lite-by-id -> which will be adding additional data!
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(appendToTargetForAwsLexV2.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
