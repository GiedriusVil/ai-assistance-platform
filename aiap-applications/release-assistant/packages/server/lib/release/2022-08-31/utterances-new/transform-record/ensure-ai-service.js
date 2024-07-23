/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-transform-record-ensure-ai-service';
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const ensureAiService = (params) => {
  let aiServices;
  let aiSkills;
  let aiSkill;
  let aiService;

  let skillName;

  try {
    aiServices = params?.aiServices;
    aiSkills = params?.aiSkills;
    aiService = params?.utterance?.aiService;

    skillName = params?.utterance?.skillName;

    if (
      !lodash.isEmpty(aiService)
    ) {
      return;
    }
    if (
      !lodash.isEmpty(aiSkills) &&
      lodash.isArray(aiSkills)
    ) {
      aiSkill = aiSkills.find((item) => {
        return item?.name === skillName;
      });
    }
    if (
      !lodash.isEmpty(aiSkill?.aiServiceId) &&
      !lodash.isEmpty(aiServices) &&
      lodash.isArray(aiServices)
    ) {
      aiService = aiServices.find((item) => {
        return item?._id === aiSkill.aiServiceId;
      });
      if (
        !lodash.isEmpty(aiService)
      ) {
        aiService.aiSkill = aiSkill;
      }
    }
    if (
      lodash.isEmpty(aiService)
    ) {
      aiService = {
        aiSkill: {
          name: skillName
        }
      }
    }
    params.utterance.aiService = {
      id: aiService?._id,
      type: aiService?.type,
      name: aiService?.name,
      aiSkill: {
        id: aiService?.aiSkill?._id,
        name: aiService?.aiSkill?.name,
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(ensureAiService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  ensureAiService,
}
